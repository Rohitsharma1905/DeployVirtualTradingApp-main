import React, { useEffect, useState, useCallback, memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Trash2, Star, ThumbsUp, ThumbsDown } from 'lucide-react';
import PropTypes from 'prop-types';
import { toast } from 'react-hot-toast';
import ConfirmationModal from '../../Modals/ConformationModal';
import {
  deleteFeedback,
  updateFeedbackStatus,
  selectIsDeleting,
  selectIsUpdating
} from '../../../../redux/Admin/FeedbackListPage/FeedbackTableSlice';
import { fetchDashboardStats } from '../../../../redux/User/userSlice';

const CATEGORY_COLORS = {
  "Website UI/UX": "bg-blue-100 text-blue-800",
  "Trading Features": "bg-green-100 text-green-800",
  "Data Accuracy": "bg-purple-100 text-purple-800",
  "Performance & Speed": "bg-yellow-100 text-yellow-800",
  "Customer Support": "bg-orange-100 text-orange-800",
  "Other": "bg-gray-100 text-gray-800"
};

// Toggle Switch Component
const ToggleSwitch = memo(({ isOn, onToggle, disabled }) => (
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
));

const Tooltip = memo(({ children, text }) => (
  <div className="relative group inline-flex">
    {children}
    <div className="absolute z-10 invisible group-hover:visible bg-gray-800 text-white text-xs rounded py-1 px-2 -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
      {text}
    </div>
  </div>
));

const Stars = memo(({ rating }) => (
  <div className="flex">
    {[...Array(rating)].map((_, i) => (
  <Star 
    key={i} 
    size={16} 
    fill="#FFD700" 
    stroke="#FFD700" 
    className="inline-block"
  />
))}

  </div>
));



const TableHeader = memo(() => (
  <tr>
    {[
      'Name',
      'Email',
      'Category',
      'Rating',
      'Recommend',
      'Feedback',
      'Suggestions',
      'Date',
      'Status',
      'Actions'
    ].map(header => (
      <th
        key={header}
        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
      >
        {header}
      </th>
    ))}
  </tr>
));

// Status Badge Component
const StatusBadge = memo(({ status }) => (
  <span
    className={`
      px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
      ${status.toLowerCase() === 'approved' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
    `}
  >
    {status.charAt(0).toUpperCase() + status.slice(1)}
  </span>
));

// PropTypes
const componentProps = {
  ToggleSwitch: {
    isOn: PropTypes.bool.isRequired,
    onToggle: PropTypes.func.isRequired,
    disabled: PropTypes.bool
  },
  Tooltip: {
    children: PropTypes.node.isRequired,
    text: PropTypes.string.isRequired
  },
  Stars: {
    rating: PropTypes.number.isRequired
  },
  StatusBadge: {
    status: PropTypes.oneOf(['approved', 'rejected']).isRequired
  }
};

// Apply PropTypes
[ToggleSwitch, Tooltip, Stars, StatusBadge].forEach(component => {
  component.propTypes = componentProps[component.name];
});

const FeedbackTable = ({ feedbacks }) => {
  const dispatch = useDispatch();
  const isDeleting = useSelector(selectIsDeleting);
  const isUpdating = useSelector(selectIsUpdating);

  const [state, setState] = useState({
    expandedRow: null,
    showDeleteModal: false,
    deleteId: null,
    toggleStates: {} // Track toggle states locally
  });

  // Initialize toggle states
  useEffect(() => {
    const initialToggleStates = feedbacks.reduce((acc, feedback) => ({
      ...acc,
      [feedback._id]: feedback.status === 'approved'
    }), {});
    setState(prev => ({ ...prev, toggleStates: initialToggleStates }));
  }, [feedbacks]);

  const handlers = {
    delete: useCallback(async () => {
      try {
        const loadingToast = toast.loading('Deleting feedback...');
        await dispatch(deleteFeedback(state.deleteId)).unwrap();
        dispatch(fetchDashboardStats()).unwrap();
        toast.success('Feedback deleted successfully', { id: loadingToast });
        setState(prev => ({ ...prev, showDeleteModal: false, deleteId: null }));
      } catch (error) {
        toast.error(error.message || 'Failed to delete feedback');
      }
    }, [dispatch, state.deleteId]),

    status: useCallback(async (id) => {
      try {
        const newStatus = state.toggleStates[id] ? 'rejected' : 'approved';
        const loadingToast = toast.loading('Updating status...');
        
        // Update local state immediately for better UX
        setState(prev => ({
          ...prev,
          toggleStates: {
            ...prev.toggleStates,
            [id]: !prev.toggleStates[id]
          }
        }));

        await dispatch(updateFeedbackStatus({ id, status: newStatus })).unwrap();
        toast.success(`Status updated to ${newStatus}`, { id: loadingToast });
      } catch (error) {
        // Revert toggle state on error
        setState(prev => ({
          ...prev,
          toggleStates: {
            ...prev.toggleStates,
            [id]: !prev.toggleStates[id]
          }
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

  const TableRow = memo(({ feedback }) => (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
        {feedback.userId?.name || feedback.organizationId?.name ||  'N/A'}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {feedback.userId?.email || feedback.organizationId?.email || 'N/A'}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${CATEGORY_COLORS[feedback.feedbackCategory]}`}>
          {feedback.feedbackCategory}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <Stars rating={feedback.rating} />
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-center">
        {feedback.recommend ? (
          <ThumbsUp className="text-green-500 inline" size={20} />
        ) : (
          <ThumbsDown className="text-red-500 inline" size={20} />
        )}
      </td>
      <td className="px-6 py-4">
        <div className="text-sm text-gray-500">
          {state.expandedRow === feedback._id ? (
            <>
              {feedback.feedbackMessage}
              <button
                onClick={() => handlers.toggleRow(feedback._id)}
                className="ml-2 text-lightBlue-600 hover:text-blue-700"
              >
                Show less
              </button>
            </>
          ) : (
            <>
              {feedback.feedbackMessage?.length > 50
                ? `${feedback.feedbackMessage.substring(0, 50)}...`
                : feedback.feedbackMessage}
              {feedback.feedbackMessage?.length > 50 && (
                <button
                  onClick={() => handlers.toggleRow(feedback._id)}
                  className="ml-2 text-lightBlue-600 hover:text-blue-700"
                >
                  Show more
                </button>
              )}
            </>
          )}
        </div>
      </td>
      <td className="py-4 text-sm text-gray-500">
        {feedback.suggestions || "No suggestions provided"}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {new Date(feedback.createdDate).toLocaleDateString()}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <StatusBadge status={feedback.status} />
      </td>
      <td className="px-10 py-4 whitespace-nowrap">
        <div className="flex items-center gap-4">
          <Tooltip text={`${feedback.status === 'approved' ? 'Reject' : 'Approve'} Status `}>
            <ToggleSwitch
              isOn={state.toggleStates[feedback._id]}
              onToggle={() => handlers.status(feedback._id)}
              disabled={isUpdating}
            />
          </Tooltip>
          <Tooltip text="Delete feedback">
            <button
              onClick={() => setState(prev => ({ 
                ...prev, 
                showDeleteModal: true, 
                deleteId: feedback._id 
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
              {feedbacks.length > 0 ? (
                feedbacks.map(feedback => (
                  <TableRow key={feedback._id} feedback={feedback} />
                ))
              ) : (
                <tr>
                  <td colSpan="10" className="px-6 py-4 text-center text-gray-500">
                    No feedback found
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
        message="Are you sure you want to delete this feedback?"
      />
    </>
  );
};

// PropTypes for the main FeedbackTable component
FeedbackTable.propTypes = {
  feedbacks: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      userId: PropTypes.shape({
        name: PropTypes.string,
        email: PropTypes.string
      }),
      feedbackCategory: PropTypes.string.isRequired,
      feedbackMessage: PropTypes.string.isRequired,
      rating: PropTypes.number.isRequired,
      recommend: PropTypes.bool.isRequired,
      status: PropTypes.oneOf(['approved', 'rejected']).isRequired,
      suggestions: PropTypes.string,
      createdDate: PropTypes.string.isRequired
    })
  ).isRequired
};

// Optional CSS styles to add to your global styles or Tailwind config
const styles = {
  table: {
    container: "bg-white rounded-lg shadow-lg overflow-hidden",
    wrapper: "overflow-x-auto",
    table: "min-w-full divide-y divide-gray-200",
    header: "bg-gray-50",
    body: "bg-white divide-y divide-gray-200",
    row: "hover:bg-gray-50 transition-colors duration-150",
    cell: "px-6 py-4 whitespace-nowrap",
    textCell: "px-6 py-4",
    actionCell: "flex items-center gap-4"
  },
  toggle: {
    base: "relative inline-flex items-center cursor-pointer",
    switch: `
      relative w-11 h-6 rounded-full transition-colors duration-200 ease-in-out
      focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lightBlue-500
    `,
    dot: `
      absolute left-1 top-1 w-4 h-4 bg-white rounded-full 
      transition-transform duration-200 ease-in-out
    `,
    disabled: "opacity-50 cursor-not-allowed"
  },
  button: {
    base: `
      inline-flex items-center justify-center rounded-md text-sm font-medium
      transition-colors duration-150 ease-in-out focus:outline-none focus:ring-2
      focus:ring-offset-2 focus:ring-lightBlue-500
    `,
    delete: `
      text-red-500 hover:text-red-700 disabled:opacity-50 
      disabled:cursor-not-allowed p-1 rounded-full hover:bg-red-50
    `
  },
  badge: {
    base: "px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full",
    approved: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800"
  }
};

// Custom hooks for better state management (optional)
const useTableState = (initialFeedbacks) => {
  const [state, setState] = useState({
    expandedRow: null,
    showDeleteModal: false,
    deleteId: null,
    toggleStates: initialFeedbacks.reduce((acc, feedback) => ({
      ...acc,
      [feedback._id]: feedback.status === 'approved'
    }), {})
  });

  const updateState = useCallback((updates) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  return [state, updateState];
};

// Utility functions (optional)
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const truncateText = (text, limit = 50) => {
  if (text?.length > limit) {
    return `${text.substring(0, limit)}...`;
  }
  return text;
};

// Export components
export {
  ToggleSwitch,
  Tooltip,
  Stars,
  StatusBadge,
  styles,
  useTableState,
  formatDate,
  truncateText
};

export default memo(FeedbackTable);