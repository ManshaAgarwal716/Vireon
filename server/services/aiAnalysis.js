function clampScore(n) {
  const num = Number(n);
  if (Number.isNaN(num)) return 0;
  return Math.max(0, Math.min(100, Math.round(num)));
}

function safeArray(value) {
  if (!Array.isArray(value)) return [];
  return value
    .map((x) => (typeof x === "string" ? x.trim() : ""))
    .filter(Boolean)
    .slice(0, 20);
}

function safeString(value, max = 2000) {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, max);
}

function extractJson(text) {
  if (!text) return null;
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) return null;
  const slice = text.slice(start, end + 1);
  try {
    return JSON.parse(slice);
  } catch {
    return null;
  }
}

async function callOpenAI({ title, description, techStack, tags, githubLink }) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    const err = new Error("OPENAI_API_KEY is not set");
    err.code = "OPENAI_MISSING_KEY";
    throw err;
  }

  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

  const prompt = [
    "You are an expert technical product reviewer.",
    "Analyze a software project submission and return STRICT JSON only.",
    "",
    "Return JSON with this exact shape:",
    "{",
    '  "score": number,',
    '  "suggestions": string[],',
    '  "improvements": string[]',
    "}",
    "",
    "Scoring rules:",
    "- score is 0-100 and reflects description quality + clarity + completeness + tech stack relevance.",
    "- suggestions: concrete, actionable suggestions to improve the project listing.",
    "- improvements: concrete improvements to the project itself or next steps (features, testing, docs).",
    "",
    "Project:",
    `Title: ${safeString(title, 200)}`,
    `Description: ${safeString(description, 3000)}`,
    `Tech stack: ${safeArray(techStack).join(", ")}`,
    `Tags: ${safeArray(tags).join(", ")}`,
    `GitHub: ${safeString(githubLink, 300)}`,
  ].join("\n");

  const resp = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      input: prompt,
      temperature: 0.2,
      max_output_tokens: 350,
    }),
  });

  if (!resp.ok) {
    const body = await resp.text().catch(() => "");
    const err = new Error(`OpenAI error ${resp.status}: ${body || resp.statusText}`);
    err.code = "OPENAI_HTTP_ERROR";
    throw err;
  }

  const data = await resp.json();
  const text =
    data?.output_text ||
    data?.output?.[0]?.content?.map((c) => c?.text).filter(Boolean).join("\n") ||
    "";

  const json = extractJson(text);
  if (!json) {
    const err = new Error("Failed to parse AI analysis JSON");
    err.code = "OPENAI_PARSE_ERROR";
    err.raw = text;
    throw err;
  }

  return {
    score: clampScore(json.score),
    suggestions: safeArray(json.suggestions),
    improvements: safeArray(json.improvements),
  };
}

exports.analyzeProject = async (project) => {
  const result = await callOpenAI(project);
  return {
    ...result,
    analyzedAt: new Date(),
    model: process.env.OPENAI_MODEL || "gpt-4o-mini",
  };
};

