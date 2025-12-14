import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Trash2 } from 'lucide-react';
import PropTypes from 'prop-types';
import ConfirmationModal from '../../Modals/ConformationModal';
import { deleteContact } from '../../../../redux/Admin/QueryListPage/QueryTableSllice';

const TYPE_COLORS = {
  "General Inquiry": "bg-blue-100 text-blue-800",
  "Technical Support": "bg-green-100 text-green-800",
  "Billing Issue": "bg-red-100 text-red-800",
  "Feedback": "bg-yellow-100 text-yellow-800",
};

const TableHeader = () => (
  <tr>
    {['Name', 'Email', 'Mobile', 'Type', 'Description', 'Join Date', 'Actions'].map(header => (
      <th key={header} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{header}</th>
    ))}
  </tr>
);

const QueriesTable = ({ contacts, tempFilters, searchQuery }) => {
  const dispatch = useDispatch();
  const { isDeleting } = useSelector(state => state.admin.queryTable);

  const [state, setState] = useState({
    expandedRow: null,
    showDeleteModal: false,
    deleteId: null
  });

  const handleDeleteClick = (id) => {
    setState(prev => ({
      ...prev,
      showDeleteModal: true,
      deleteId: id
    }));
  };

  const handleDeleteConfirm = () => {
    dispatch(deleteContact(state.deleteId));
    setState(prev => ({
      ...prev,
      showDeleteModal: false,
      deleteId: null
    }));
  };

  const toggleRow = (id) => {
    setState(prev => ({
      ...prev,
      expandedRow: prev.expandedRow === id ? null : id
    }));
  };

  const renderTableRow = (contact) => (
    <tr key={contact._id} className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900">{contact.name}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-500">{contact.email}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-500">{contact.mobile}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${TYPE_COLORS[contact.type] || "bg-gray-100 text-gray-800"}`}>
          {contact.type}
        </span>
      </td>
      <td className="px-6 py-4">
        <div className="text-sm text-gray-500">
          {state.expandedRow === contact._id 
            ? contact.desc 
            : contact.desc?.length > 50 
              ? `${contact.desc.substring(0, 50)}...` 
              : contact.desc}
          {contact.desc?.length > 50 && (
            <button
              onClick={() => toggleRow(contact._id)}
              className="ml-2 text-lightBlue-600 hover:text-lightBlue-700"
            >
              {state.expandedRow === contact._id ? "Show less" : "Show more"}
            </button>
          )}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-500">
          {new Date(contact.createDate).toLocaleDateString()}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-left text-sm font-medium">
        <button 
          onClick={() => handleDeleteClick(contact._id)}
          className={`text-red-600 hover:text-red-900 flex items-center ${isDeleting ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={isDeleting}
        >
          <Trash2 size={18} />
          {isDeleting && <span className="ml-2 text-xs">Deleting...</span>}
        </button>
      </td>
    </tr>
  );

  const renderEmptyRow = () => (
    <tr>
      <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
        No queries found
      </td>
    </tr>
  );

  return (
    <>
      <ConfirmationModal
        isOpen={state.showDeleteModal}
        onClose={() => setState(prev => ({ ...prev, showDeleteModal: false, deleteId: null }))}
        onConfirm={handleDeleteConfirm}
        title="Confirm Delete"
        message="Are you sure you want to delete this contact? This action cannot be undone."
      />
      <div className="bg-white rounded-lg shadow-lg">
        <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <TableHeader />
            </thead>
            <tbody className="divide-y divide-gray-200">
              {contacts.length ? contacts.map(renderTableRow) : renderEmptyRow()}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

QueriesTable.propTypes = {
  contacts: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      mobile: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      desc: PropTypes.string,
      createDate: PropTypes.string.isRequired
    })
  ).isRequired,
  tempFilters: PropTypes.shape({
    type: PropTypes.string.isRequired,
    startDate: PropTypes.instanceOf(Date),
    endDate: PropTypes.instanceOf(Date),
  }).isRequired,
  searchQuery: PropTypes.string.isRequired,
};

export default QueriesTable;