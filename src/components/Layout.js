import React from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function Layout({ activeView, setActiveView, children }) {
  return (
    <div className="flex h-screen bg-gray-50 font-[Inter]">
      <Sidebar activeView={activeView} setActiveView={setActiveView} />

      <div className="flex flex-col flex-grow overflow-auto">
        <Header />
        <main className="flex-grow">{children}</main>
      </div>
    </div>
  );
}
