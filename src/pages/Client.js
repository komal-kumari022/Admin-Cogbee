import React, { useState } from "react";
import { Search, Plus, EllipsisVertical } from "lucide-react";

const mockClients = [
  { id: 1, name: "Acme Corp", industry: "Technology", tests: 42, assessments: 156, status: "Active", addedDate: "8/15/2024" },
  { id: 2, name: "Tech Solutions Inc", industry: "IT Services", tests: 28, assessments: 89, status: "Active", addedDate: "9/22/2024" },
  { id: 3, name: "Global Industries", industry: "Manufacturing", tests: 15, assessments: 34, status: "Active", addedDate: "10/10/2024" },
  { id: 4, name: "Startup Hub", industry: "Consulting", tests: 8, assessments: 12, status: "Trial", addedDate: "11/1/2024" },
];

const StatusBadge = ({ status }) => {
  const classes = "px-3 py-1 text-xs rounded-full font-medium";

  if (status === "Active") return <span className={`${classes} bg-green-100 text-green-700`}>Active</span>;
  if (status === "Trial") return <span className={`${classes} bg-yellow-100 text-yellow-700`}>Trial</span>;
  return <span className={`${classes} bg-gray-100 text-gray-700`}>{status}</span>;
};

export default function Client() {
  const [search, setSearch] = useState("");

  const filtered = mockClients.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.industry.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header Row */}
      <div className="flex justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Client Management</h1>
          <p className="text-gray-500">Manage all your client accounts</p>
        </div>

        <button className="flex items-center bg-blue-600 text-white px-6 py-3 rounded-xl shadow-lg hover:bg-blue-700">
          <Plus className="w-5 h-5 mr-2" /> Add New Client
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-lg mb-8">
        <Search className="absolute left-4 top-3 w-5 h-5 text-gray-400" />
        <input
          className="w-full pl-12 pr-4 py-3 border rounded-xl"
          placeholder="Search clients..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="bg-white shadow-xl rounded-xl overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {["Client Name", "Industry", "Tests", "Assessments", "Status", "Added Date", "Actions"].map((h) => (
                <th key={h} className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {filtered.map((client) => (
              <tr key={client.id} className="hover:bg-blue-50">
                <td className="px-6 py-4">{client.name}</td>
                <td className="px-6 py-4">{client.industry}</td>
                <td className="px-6 py-4">{client.tests}</td>
                <td className="px-6 py-4">{client.assessments}</td>
                <td className="px-6 py-4">
                  <StatusBadge status={client.status} />
                </td>
                <td className="px-6 py-4">{client.addedDate}</td>
                <td className="px-6 py-4 text-right">
                  <button className="p-1 hover:bg-gray-100 rounded-full">
                    <EllipsisVertical className="w-5 h-5 text-gray-400" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="p-6 text-center text-gray-500">
            No clients found.
          </div>
        )}
      </div>
    </div>
  );
}
