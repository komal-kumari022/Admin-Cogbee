import React from "react";
import {
  LayoutDashboard,
  Users,
  FlaskConical,
  ClipboardList,
//   Clock, 
  Plus
} from "lucide-react";

const navItems = [
  { name: "Dashboard", icon: LayoutDashboard, view: "dashboard" },
  { name: "Client", icon: Users, view: "client" },
  { name: "Tests", icon: FlaskConical, view: "tests" },
  { name: "Test Questions", icon: ClipboardList, view: "testQuestions" },
//   { name: "Comming Soon", icon: Clock, view: "commingSoon" }, 
];

export default function Sidebar({ activeView, setActiveView }) {
  const isActive = (view) => activeView === view;

  return (
    <div className="flex flex-col w-64 bg-white h-full border-r border-gray-200">
      {/* Brand */}
      <div className="p-4 flex items-center h-16 border-b border-gray-200">
        <div className="w-8 h-8 flex items-center justify-center bg-blue-600 text-white font-bold text-xl rounded-md mr-3 shadow-md">
          C
        </div>
        <h1 className="text-xl font-semibold text-gray-900">Cogbee</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-grow p-4 space-y-2">
        {navItems.map((item) => (
          <button
            key={item.name}
            onClick={() => setActiveView(item.view)}
            className={`flex items-center w-full p-3 rounded-xl transition-colors duration-200 ${
              isActive(item.view)
                ? "bg-blue-600 text-white shadow-lg"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <item.icon className="w-5 h-5 mr-3" />
            <span>{item.name}</span>
          </button>
        ))}

        {/* Coming Soon (separated) */}
        <div className="pt-4 border-t border-gray-100 mt-4">
          <button
            onClick={() => setActiveView("commingSoon")}
            className={`flex items-center w-full p-3 rounded-xl transition-colors duration-200 ${
              isActive("commingSoon")
                ? "bg-blue-50 text-blue-600 font-semibold"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <Plus className="w-5 h-5 mr-3" />
            <span>Comming Soon</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
