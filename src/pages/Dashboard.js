import React from "react";

export default function Dashboard() {
  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Dashboard Overview</h1>
      <p className="text-gray-600 mb-8">Here are your key metrics.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-lg text-blue-600 font-semibold">Total Clients</h2>
          <p className="text-4xl font-bold mt-2">125</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-lg text-green-600 font-semibold">Active Assessments</h2>
          <p className="text-4xl font-bold mt-2">789</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-lg text-yellow-600 font-semibold">Pending Tasks</h2>
          <p className="text-4xl font-bold mt-2">14</p>
        </div>
      </div>
    </div>
  );
}
