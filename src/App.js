import React, { useState, useEffect } from "react";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Tests from "./pages/Tests";
import TestQuestions from "./pages/TestQuestions";
import Client from "./pages/Client";
import CommingSoon from "./pages/CommingSoon";
import AddQuestionPage from "./pages/AddQuestionPage";
import Login from "./components/Login"; // New: Import Login component
import "./index.css";

export default function App() {
  const [activeView, setActiveView] = useState("login"); // Default to login
  const [selectedSkill, setSelectedSkill] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false); // New: Auth state

  // Check auth on mount
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      setIsAuthenticated(true);
      setActiveView("dashboard"); // Your default protected view
    }
  }, []);

  // Login success callback
  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setActiveView("dashboard");
  };

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setIsAuthenticated(false);
    setActiveView("login");
  };

  // Protect views: Redirect to login if not auth'd
  const protectedViews = ["dashboard", "client", "tests", "testQuestions", "commingSoon", "addQuestion"];
  useEffect(() => {
    if (protectedViews.includes(activeView) && !isAuthenticated) {
      setActiveView("login");
    }
  }, [activeView, isAuthenticated]);

  const renderPage = () => {
    switch (activeView) {
      case "login":
        return <Login onLoginSuccess={handleLoginSuccess} />; // New: Login view (no Layout)
      case "dashboard":
        return <Dashboard />;
      case "client":
        return <Client />;
      case "tests":
        return <Tests />;
      case "testQuestions":
        return (
          <TestQuestions
            setSelectedSkill={setSelectedSkill}
            setActiveView={setActiveView}
          />
        );
      case "commingSoon":
        return <CommingSoon />;
      case "addQuestion":
        return (
          <AddQuestionPage
            skillName={selectedSkill}
            onBack={() => setActiveView("testQuestions")}
          />
        );
      default:
        return <Client />; // Or redirect to login
    }
  };

  // 🔥 KEY CHANGE: Handle login (no Layout) and addQuestion (full-width, but protected)
  if (activeView === "login") {
    return renderPage(); // No Layout for login
  }

  if (activeView === "addQuestion") {
    return renderPage(); // Full-width, no sidebar/header (but auth-protected via useEffect)
  }

  // All other protected views: Wrap in Layout
  return (
    <Layout activeView={activeView} setActiveView={setActiveView} onLogout={handleLogout}>
      {renderPage()}
    </Layout>
  );
}