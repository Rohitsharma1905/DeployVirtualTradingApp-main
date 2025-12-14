
// tooltip
import React, { useState } from "react";
import { Edit, Trash2, ChevronDown, ChevronRight, CreditCard } from "lucide-react";
import Tooltip from "../../../Common/Tooltip"; // Adjust the import path as necessary

const TYPE_COLORS = {
  "Male": "bg-lightBlue-200 text-lightBlue-600",
  "Female": "bg-red-100 text-red-800",
};


const OrgUserTable = ({ users, onEdit, onDelete, expandedRow, toggleRow }) => {
  const [hoveredTooltip, setHoveredTooltip] = useState(null);

  return (
    <div className="bg-white shadow-md rounded-lg overflow-x-auto max-h-[500px] overflow-y-auto">
      <table className="w-full">
        <thead className="bg-gray-50 border-b">
          <tr>
            {["Name", "Email", "Mobile", "Gender", "Date of Birth", "Added By",  "Actions"].map((header) => (
              <th key={header} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {users.map((user) => (
            <React.Fragment key={user._id}>
              <tr
                onClick={() => toggleRow(user._id)}
                className={`cursor-pointer hover:bg-gray-50 transition-colors ${expandedRow === user._id ? "bg-gray-50" : ""}`}
              >
                <td className="px-6 py-4 flex items-center">
                  {/* {expandedRow === user._id ? (
                    <ChevronDown className="mr-2 text-gray-500" size={16} />
                  ) : (
                    <ChevronRight className="mr-2 text-gray-500" size={16} />
                  )}
                  {user.name} */}
                   <div className="text-sm font-medium text-gray-900">
                      {user.name}
                    </div>
                </td>
                <td className="px-6 py-4 text-gray-500">{user.email}</td>
                <td className="px-6 py-4 text-gray-500">{user.mobile}</td>
                <td className="px-6 py-4 text-gray-500"><span 
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${TYPE_COLORS[user.gender] || "bg-gray-100 text-gray-800"}`}
                    >
                      {user.gender}
                    </span></td>
                <td className="px-6 py-4 text-gray-500">
                  {user.dob && !isNaN(new Date(user.dob)) ? new Date(user.dob).toISOString().split("T")[0] : "N/A"}
                </td>
                <td className="px-6 py-4 text-gray-500">{user.addedby}</td>
                {/* <td className="px-6 py-4 text-gray-500">true</td> */}
                <td className="px-6 py-4 flex space-x-2 relative group">
                  <div className="relative flex items-center">
                    {/* Edit Button with Tooltip */}
                    <Tooltip title="Edit" isVisible={hoveredTooltip === `edit-${user._id}`}>
                      <button
                        onMouseEnter={() => setHoveredTooltip(`edit-${user._id}`)}
                        onMouseLeave={() => setHoveredTooltip(null)}
                        onClick={(e) => {
                          e.stopPropagation();
                          onEdit(user);
                        }}
                      className="text-yellow-600 mx-2 hover:text-yellow-900 transition-colors duration-200"
                        aria-label="Edit user"
                      >
                        <Edit size={18} />
                      </button>
                    </Tooltip>
                    
                    {/* Add Plan Button with Tooltip */}
                    <Tooltip title="Add Plan" isVisible={hoveredTooltip === `addPlan-${user._id}`}>
                      <button
                        onMouseEnter={() => setHoveredTooltip(`addPlan-${user._id}`)}
                        onMouseLeave={() => setHoveredTooltip(null)}
                        className="text-lightBlue-600 mx-2 hover:text-lightBlue-900 transition-colors duration-200"
                        aria-label="Manage subscription"
                      >
                        <CreditCard size={18} />
                      </button>
                    </Tooltip>

                    {/* Delete Button with Tooltip */}
                    <Tooltip title="Delete" isVisible={hoveredTooltip === `delete-${user._id}`}>
                      <button
                        onMouseEnter={() => setHoveredTooltip(`delete-${user._id}`)}
                        onMouseLeave={() => setHoveredTooltip(null)}
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(user);
                        }}
                        className="text-red-600 mx-2 hover:text-red-900 transition-colors duration-200"
                      >
                        <Trash2 size={18} />
                      </button>
                    
                                              
                    </Tooltip>

                    
                  </div>
                </td>
              </tr>
              {expandedRow === user._id && (
                <tr>
                  <td colSpan="10" className="px-6 py-4 bg-gray-50">
                    <div className="grid grid-cols-2 gap-4 bg-white p-4 rounded-md shadow-sm">
                      <div>
                        <p className="text-sm font-semibold text-gray-600 mb-1">Created Date</p>
                        <p className="text-sm text-gray-800">{new Date(user.createdDate).toLocaleDateString("en-US")}</p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-600 mb-1">Last Updated</p>
                        <p className="text-sm text-gray-800">{new Date(user.updatedDate).toLocaleDateString("en-US")}</p>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrgUserTable;