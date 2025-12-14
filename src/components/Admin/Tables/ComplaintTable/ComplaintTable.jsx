// ComplaintTable.js
import React, { useEffect, useState, useCallback, memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Trash2 } from 'lucide-react';
import PropTypes from 'prop-types';
import { toast } from 'react-hot-toast';
import ConfirmationModal from '../../Modals/ConformationModal';
import {
  deleteComplaint,
  updateComplaintStatus,
  selectComplaintDeleting,
  selectComplaintUpdating
} from '../../../../redux/Admin/ComplaintListPage/complaintTableSlice';
import { fetchDashboardStats } from '../../../../redux/User/userSlice';

const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-800',
  solved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800'
};

const CATEGORY_COLORS = {
  "Account Issues": "bg-blue-100 text-blue-800",
  "Payment Problems": "bg-green-100 text-green-800",
  "Technical Errors": "bg-purple-100 text-purple-800",
  "Service Quality": "bg-yellow-100 text-yellow-800",
  "Other": "bg-gray-100 text-gray-800"
};

const ToggleSwitch = memo(({ isOn, onToggle, disabled }) => (
  <label className="relative inline-flex items-center cursor-pointer">
    <input type="checkbox" className="sr-only" checked={isOn} onChange={onToggle} disabled={disabled} />
    <div
      className={`relative w-11 h-6 rounded-full transition-colors duration-200 ease-in-out
        ${isOn ? 'bg-green-500' : 'bg-red-500'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <div
        className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ease-in-out
          ${isOn ? 'translate-x-5' : 'translate-x-0'}`}
      />
    </div>
  </label>
));

const Tooltip = memo(({ children, text }) => (
  <div className="relative group inline-flex">
    {children}
    <div className="absolute z-10 invisible group-hover:visible bg-gray-800 text-white text-xs rounded py-1 px-2 -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
      {text}
    </div>
  </div>
));

const StatusBadge = memo(({ status }) => (
  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${STATUS_COLORS[status]}`}>
    {status.charAt(0).toUpperCase() + status.slice(1)}
  </span>
));

const TableHeader = memo(() => (
  <tr>
    {['Name', 'Email', 'Category', 'Complaint Message', 'Date', 'Status', 'Actions'].map(header => (
      <th key={header} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
        {header}
      </th>
    ))}
  </tr>
));

const ComplaintTable = ({ complaints }) => {
  const dispatch = useDispatch();
  const isDeleting = useSelector(selectComplaintDeleting);
  const isUpdating = useSelector(selectComplaintUpdating);

  const [state, setState] = useState({
    expandedRow: null,
    showDeleteModal: false,
    deleteId: null,
    toggleStates: {}
  });

  useEffect(() => {
    const initialToggleStates = complaints.reduce((acc, complaint) => ({
      ...acc,
      [complaint._id]: complaint.status === 'solved'
    }), {});
    setState(prev => ({ ...prev, toggleStates: initialToggleStates }));
  }, [complaints]);

  const handlers = {
    delete: useCallback(async () => {
      try {
        const loadingToast = toast.loading('Deleting complaint...');
        await dispatch(deleteComplaint(state.deleteId)).unwrap();
        dispatch(fetchDashboardStats()).unwrap();
        toast.success('Complaint deleted successfully', { id: loadingToast });
        setState(prev => ({ ...prev, showDeleteModal: false, deleteId: null }));
      } catch (error) {
        toast.error(error.message || 'Failed to delete complaint');
      }
    }, [dispatch, state.deleteId]),

    status: useCallback(async (id) => {
      try {
        const newStatus = state.toggleStates[id] ? 'pending' : 'solved';
        const loadingToast = toast.loading('Updating status...');
        setState(prev => ({
          ...prev,
          toggleStates: { ...prev.toggleStates, [id]: !prev.toggleStates[id] }
        }));
        await dispatch(updateComplaintStatus({ id, status: newStatus })).unwrap();
        toast.success(`Status updated to ${newStatus}`, { id: loadingToast });
      } catch (error) {
        setState(prev => ({
          ...prev,
          toggleStates: { ...prev.toggleStates, [id]: !prev.toggleStates[id] }
        }));
        toast.error(error.message || 'Failed to update status');
      }
    }, [dispatch, state.toggleStates]),

    toggleRow: useCallback((id) => {
      setState(prev => ({
        ...prev,
        expandedRow: prev.expandedRow === id ? null : id
      }));
    }, [])
  };

  const TableRow = memo(({ complaint }) => (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
        {complaint.userId?.name || complaint.organizationId?.name || 'N/A'}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {complaint.userId?.email || complaint.organizationId?.email || 'N/A'}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm">
  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
    ${CATEGORY_COLORS[complaint.category] || "bg-gray-100 text-gray-800"}`}>
    {complaint.category}
  </span>
</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {state.expandedRow === complaint._id ? (
          <>
            {complaint.complaintMessage}
            <button onClick={() => handlers.toggleRow(complaint._id)} className="ml-2 text-lightBlue-600 hover:text-blue-700">
              Show less
            </button>
          </>
        ) : (
          <>
            {complaint.complaintMessage?.length > 50
              ? `${complaint.complaintMessage.substring(0, 50)}...`
              : complaint.complaintMessage}
            {complaint.complaintMessage?.length > 50 && (
              <button onClick={() => handlers.toggleRow(complaint._id)} className="ml-2 text-lightBlue-600 hover:text-blue-700">
                Show more
              </button>
            )}
          </>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {new Date(complaint.createdDate).toLocaleDateString()}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <StatusBadge status={complaint.status} />
      </td>
      <td className="px-10 py-4 whitespace-nowrap">
        <div className="flex items-center gap-4">
          <Tooltip text={`${complaint.status === 'solved' ? 'Mark Pending' : 'Mark Solved'}`}>
            <ToggleSwitch
              isOn={state.toggleStates[complaint._id]}
              onToggle={() => handlers.status(complaint._id)}
              disabled={isUpdating}
            />
          </Tooltip>
          <Tooltip text="Delete complaint">
            <button
              onClick={() => setState(prev => ({
                ...prev,
                showDeleteModal: true,
                deleteId: complaint._id
              }))}
              disabled={isDeleting}
              className="text-red-500 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed p-1"
            >
              <Trash2 size={18} />
            </button>
          </Tooltip>
        </div>
      </td>
    </tr>
  ));

  return (
    <>
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <TableHeader />
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {complaints.length > 0 ? (
                complaints.map(complaint => (
                  <TableRow key={complaint._id} complaint={complaint} />
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                    No complaints found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmationModal
        isOpen={state.showDeleteModal}
        onClose={() => setState(prev => ({ ...prev, showDeleteModal: false, deleteId: null }))}
        onConfirm={handlers.delete}
        title="Confirm Delete"
        message="Are you sure you want to delete this complaint?"
      />
    </>
  );
};

ComplaintTable.propTypes = {
  complaints: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      userId: PropTypes.shape({ name: PropTypes.string, email: PropTypes.string }),
      category: PropTypes.string.isRequired,
      complaintMessage: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
      createdDate: PropTypes.string.isRequired
    })
  ).isRequired
};

export default ComplaintTable;