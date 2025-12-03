import React from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function Layout({ activeView, setActiveView, onLogout, children }) {
  return (
    <div className="flex h-screen bg-gray-50 font-[Inter]">
      <Sidebar activeView={activeView} setActiveView={setActiveView} onLogout={onLogout} />

      <div className="flex flex-col flex-grow overflow-auto">
        <Header onLogout={onLogout} />
        <main className="flex-grow">{children}</main>
      </div>
    </div>
  );
}
