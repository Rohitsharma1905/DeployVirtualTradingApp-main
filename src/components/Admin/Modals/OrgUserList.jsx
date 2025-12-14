
import Loader from '../../Common/Loader';
import React from "react";
import {
ChevronDown,
ChevronRight,
Edit,
Trash2,
PlusCircle,
Filter,
MoreVertical,
Check,
X,
} from "lucide-react";

const OrgUserListModal = ({ isOpen, onClose, students, loading, orgName }) => {
if (!isOpen) return null;

return (
<div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-gray">
<div className="fixed inset-0 bg-gray-900 opacity-50"></div>


Collapse
  {/* Modal Container */}
  <div
    style={{ width: "100%", maxWidth: "80%" }}
    className="relative w-full sm:mx-auto my-8 bg-white rounded-2xl shadow-2xl border border-gray-100"
  >
    {/* Modal Header */}
    <div className="flex justify-between items-center p-6 border-b border-gray-100">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-lightBlue-600 rounded-xl flex items-center justify-center shadow-lg">
          <i className="fas fa-users text-white"></i>
        </div>
        <h2 className="text-2xl font-semibold text-gray-800">{orgName} Users</h2>
      </div>
      <button
        onClick={onClose}
        className="p-2 hover:bg-gray-100 rounded-xl transition-colors duration-200"
      >
        <i className="fas fa-times text-gray-400 hover:text-gray-600"></i>
      </button>
    </div>

    {/* Modal Body */}
    <div className="p-6 overflow-y-auto max-h-[80vh]">
      {loading ? (
      <div>
        <Loader />
      </div>
    
      ) : students.length === 0 ? (
        <p>No students found for this organization.</p>
      ) : (
        <div className="bg-gray-50 p-6 rounded-xl">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                {["Name", "Email", "Mobile", "Gender", "Date of Birth"].map(
                  (header) => (
                    <th
                      key={header}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {header}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {students.map((student) => (
                <tr
                  key={student._id}
                  className="cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 flex items-center">
                    <span className="hover:underline cursor-pointer">
                      {student.name}
                    </span>
                  </td>
                  <td className="px-6 py-4">{student.email}</td>
                  <td className="px-6 py-4">{student.mobile}</td>
                  <td className="px-6 py-4">{student.gender}</td>
                  <td className="px-6 py-4">
                    {new Date(student.dob).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>

    {/* Modal Footer */}
    <div className="flex justify-end items-center p-6 border-t border-gray-100">
      <button
        onClick={onClose}
        className="px-6 py-3 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors duration-200"
      >
        Close
      </button>
    </div>
  </div>
</div>
);
};

export default OrgUserListModal;