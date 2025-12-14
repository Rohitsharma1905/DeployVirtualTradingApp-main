import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  ChevronDown,
  ChevronRight,
  Edit,
  Trash2,
  Check,
  X
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const Tooltip = ({ children, text }) => (
  <div className="relative group">
    {children}
    <div className="absolute z-10 invisible group-hover:visible bg-gray-800 text-white text-xs rounded py-1 px-2 -top-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
      {text}
    </div>
  </div>
);

Tooltip.propTypes = {
  children: PropTypes.node.isRequired,
  text: PropTypes.string.isRequired
};

const getStatusColor = (status) => {
  if (!status || typeof status !== 'string') return "bg-gray-100 text-gray-800";
  
  const statusColors = {
    approved: "bg-green-100 text-green-800",
    pending: "bg-yellow-100 text-yellow-800",
    rejected: "bg-red-100 text-red-800"
  };
  
  return statusColors[status.toLowerCase()] || "bg-gray-100 text-gray-800";
};

const formatDate = (date) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString();
};

// Toggle Switch Component
const ToggleSwitch = ({ isOn, onToggle, disabled }) => (
  <label className="relative inline-flex items-center cursor-pointer">
    <input
      type="checkbox"
      className="sr-only"
      checked={isOn}
      onChange={onToggle}
      disabled={disabled}
    />
    <div
      className={`
        relative w-11 h-6 rounded-full transition-colors duration-200 ease-in-out
        ${isOn ? 'bg-green-500' : 'bg-red-500'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
    >
      <div
        className={`
          absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ease-in-out
          ${isOn ? 'translate-x-5' : 'translate-x-0'}
        `}
      />
    </div>
  </label>
);

ToggleSwitch.propTypes = {
  isOn: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
  disabled: PropTypes.bool
};

const OrganizationTable = ({
  organizations = [],
  isLoading = false,
  onEdit,
  onDelete,
  onStatusChange
}) => {
  const [state, setState] = useState({
    expandedRow: null,
    showDeleteModal: false,
    selectedOrg: null
  });

  const toggleRow = (id) => {
    setState(prev => ({
      ...prev,
      expandedRow: prev.expandedRow === id ? null : id
    }));
  };

  const handleStatusToggle = async (org) => {
    if (!org || !org._id) {
      console.error('Invalid organization object:', org);
      toast.error('Invalid organization selected');
      return;
    }

    const newStatus = org.approvalStatus === 'approved' ? 'rejected' : 'approved';

    try {
      await onStatusChange(org._id, newStatus);
      toast.success(`Organization status updated to ${newStatus}`);
    } catch (error) {
      toast.error('Failed to update organization status');
      console.error('Status update error:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-lightBlue-500" />
      </div>
    );
  }

  const renderTableHeader = () => (
    <thead className="bg-gray-50 border-b">
      <tr>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact Person</th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mobile</th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Join Date</th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
      </tr>
    </thead>
  );

  const renderActionButtons = (org) => (
    <div className="flex space-x-3">
            <Tooltip text={`Toggle to ${org.approvalStatus === 'approved' ? 'reject' : 'approve'}`}>
        <ToggleSwitch
          isOn={org.approvalStatus === 'approved'}
          onToggle={() => handleStatusToggle(org)}
          disabled={isLoading}
        />
      </Tooltip>
      <Tooltip text="Edit organization">
        <button
          onClick={() => onEdit(org)}
          className="text-yellow-600 mx-2 hover:text-yellow-900 transition-colors focus:outline-none"
        >
          <Edit size={18} />
        </button>
      </Tooltip>

      <Tooltip text="Delete organization">
        <button
          onClick={() => onDelete(org)}
          className="text-red-600 hover:text-red-900 transition-colors focus:outline-none"
        >
          <Trash2 size={18} />
        </button>
      </Tooltip>


    </div>
  );

  const renderTableBody = () => (
    <tbody className="divide-y divide-gray-200">
      {organizations.length === 0 ? (
        <tr>
          <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
            No organizations found
          </td>
        </tr>
      ) : (
        organizations.map((org) => (
          <tr key={org._id} className="hover:bg-gray-50 transition-colors duration-150">
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="flex items-center">
                {/* <button 
                  onClick={() => toggleRow(org._id)}
                  className="mr-2 focus:outline-none"
                >
                  {state.expandedRow === org._id ? (
                    <ChevronDown className="text-gray-500" size={16} />
                  ) : (
                    <ChevronRight className="text-gray-500" size={16} />
                  )}
                </button> */}
                <div className="text-sm font-medium text-gray-900">{org.name}</div>
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="text-sm text-gray-500">{org.contactPerson || 'N/A'}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="text-sm text-gray-500">{org.email || 'N/A'}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="text-sm text-gray-500">{org.mobile || 'N/A'}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(org.approvalStatus)}`}>
                {org.approvalStatus || 'N/A'}
              </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="text-sm text-gray-500">{formatDate(org.createDate)}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              {renderActionButtons(org)}
            </td>
          </tr>
        ))
      )}
    </tbody>
  );

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
          <table className="w-full">
            {renderTableHeader()}
            {renderTableBody()}
          </table>
        </div>
      </div>
    </div>
  );
};

OrganizationTable.propTypes = {
  organizations: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      contactPerson: PropTypes.string,
      email: PropTypes.string,
      mobile: PropTypes.string,
      approvalStatus: PropTypes.string,
      createDate: PropTypes.string,
      address: PropTypes.string,
      website: PropTypes.string
    })
  ).isRequired,
  isLoading: PropTypes.bool,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onStatusChange: PropTypes.func.isRequired
};

export default OrganizationTable;