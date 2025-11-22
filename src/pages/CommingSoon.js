import React from "react";
import { Clock } from "lucide-react";

export default function CommingSoon() {
  return (
    <div className="p-8 bg-gray-50 min-h-screen flex justify-center items-center">
      <div className="bg-white p-10 shadow-2xl rounded-xl text-center">
        <Clock className="w-16 h-16 text-blue-500 mx-auto mb-4" />
        <h1 className="text-4xl font-bold mb-2">Coming Soon!</h1>
        <p className="text-gray-600 text-lg">This feature is under development.</p>
      </div>
    </div>
  );
}
