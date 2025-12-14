import React from "react";
import { Trash2, Edit } from "lucide-react";
import { useSelector } from "react-redux";

const CATEGORY_COLORS = {
  "Account Issues": "bg-blue-100 text-blue-800",
  "Payment Problems": "bg-green-100 text-green-800",
  "Technical Errors": "bg-purple-100 text-purple-800",
  "Service Quality": "bg-yellow-100 text-yellow-800",
  "Other": "bg-gray-100 text-gray-800"
};

const OrganizationComplaintTable = ({ complaints, onDelete, onEdit }) => {
  const {loading, orgId, currentOrg } = useSelector((state) => state.organization.auth);
console.log(complaints);
const date = new Date(complaints.createdDate);
console.log(`${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`);
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
    <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50 border-b">
          <tr>
            {["Name", "Email", "Category", "Complaint", "Date", "Status", "Actions"].map((header) => (
              <th
                key={header}
                className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {complaints.length === 0 ? (
            <tr>
              <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                No complaints found
              </td>
            </tr>
          ) : (
            complaints.map((complaint) => (
              <tr key={complaint._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {currentOrg?.name || "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {currentOrg?.email || "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      CATEGORY_COLORS[complaint.category] || "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {complaint.category}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {complaint.complaintMessage}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {/* {new Date(complaint.complaintDate).toLocaleDateString()} */}
                  {new Date(complaint.createdDate).toLocaleDateString()}

                  {/* {complaint.createdDate} */}

                  
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      complaint.status?.toLowerCase() === "solved"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {complaint.status?.charAt(0).toUpperCase() + complaint.status?.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center flex gap-x-3">
                  <button
                    onClick={() => onEdit(complaint)}
                    className="text-yellow-600 mx-2 hover:text-yellow-900 transition-colors duration-200"
                    aria-label="Edit complaint"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => onDelete(complaint._id)}
                    className="text-red-600 mx-2 hover:text-red-900 transition-colors duration-200"
                    aria-label="Delete complaint"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  </div>
  );
};

export default OrganizationComplaintTable;
