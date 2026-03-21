exports.analyzeProject = async (project) => {
  return {
    score: Math.floor(Math.random() * 40) + 60, // random 60–100
    suggestions: ["Improve UI", "Add more features"],
    improvements: ["Use better naming", "Optimize performance"],
    model: "mock-ai",
    analyzedAt: new Date(),
  };
};