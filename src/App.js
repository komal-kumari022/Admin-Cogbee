import React, { useState } from "react";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Tests from "./pages/Tests";
import TestQuestions from "./pages/TestQuestions";
import Client from "./pages/Client";
import CommingSoon from "./pages/CommingSoon";
import AddQuestionPage from "./pages/AddQuestionPage";
import "./index.css"

export default function App() {
  const [activeView, setActiveView] = useState("dashboard");
  const [selectedSkill, setSelectedSkill] = useState("");

  const renderPage = () => {
    switch (activeView) {
      case "dashboard": return <Dashboard />;
      case "client": return <Client/>;
      case "tests": return <Tests />;
      case "testQuestions": return (
        <TestQuestions
          setSelectedSkill={setSelectedSkill}
          setActiveView={setActiveView}
        />
      );
      case "commingSoon": return <CommingSoon/>;
       case "addQuestion": 
        return (
          <AddQuestionPage
            skillName={selectedSkill}
            onBack={() => setActiveView("testQuestions")}
          />
        );
      default: return <Client/>;
    }
  };

    // 🔥 KEY CHANGE: If view = addQuestion → Don't show Layout
  if (activeView === "addQuestion") {
    return renderPage();  // full-width, no sidebar/header
  }

  return (
    <Layout activeView={activeView} setActiveView={setActiveView}>
      {renderPage()}
    </Layout>
  );
}
