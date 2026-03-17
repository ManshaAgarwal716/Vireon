import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MotionPage from "./motion/MotionPage";
import Home from "./pages/Home";
import UploadProject from "./pages/UploadProject";
import ProjectDetail from "./pages/ProjectDetail";
import AppShell from "./components/AppShell";
import CollaborationRequests from "./pages/CollaborationRequests";
import Dashboard from "./pages/Dashboard";
import { getToken } from "./auth/storage";

function App() {
  return (
    <BrowserRouter>
      <AnimatedRoutes />
    </BrowserRouter>
  );
}

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <EntryRoute />
          }
        />

        <Route element={<AppShell />}>
          <Route
            path="/home"
            element={
              <MotionPage>
                <Home />
              </MotionPage>
            }
          />
          <Route
            path="/projects/new"
            element={
              <RequireAuth>
                <MotionPage>
                  <UploadProject />
                </MotionPage>
              </RequireAuth>
            }
          />
          <Route
            path="/projects/:id"
            element={
              <MotionPage>
                <ProjectDetail />
              </MotionPage>
            }
          />
          <Route
            path="/requests"
            element={
              <RequireAuth>
                <MotionPage>
                  <CollaborationRequests />
                </MotionPage>
              </RequireAuth>
            }
          />
          <Route
            path="/dashboard"
            element={
              <RequireAuth>
                <MotionPage>
                  <Dashboard />
                </MotionPage>
              </RequireAuth>
            }
          />
          <Route
            path="/landing"
            element={
              <MotionPage>
                <Landing />
              </MotionPage>
            }
          />
        </Route>

        <Route
          path="/login"
          element={
            <RedirectIfAuth>
              <MotionPage>
                <Login />
              </MotionPage>
            </RedirectIfAuth>
          }
        />
        <Route
          path="/register"
          element={
            <RedirectIfAuth>
              <MotionPage>
                <Register />
              </MotionPage>
            </RedirectIfAuth>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}

function EntryRoute() {
  const token = getToken();
  if (token) return <Navigate to="/dashboard" replace />;
  return (
    <MotionPage>
      <Landing />
    </MotionPage>
  );
}

function RequireAuth({ children }) {
  const token = getToken();
  if (!token) return <Navigate to="/" replace />;
  return children;
}

function RedirectIfAuth({ children }) {
  const token = getToken();
  if (token) return <Navigate to="/dashboard" replace />;
  return children;
}

export default App;