import React from "react";
import PropTypes from 'prop-types'; // Import PropTypes

const PORTAL_FEE = 25; // Keep this if needed for trading actions

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title, // Generic title, can be overridden by type
  message, // Generic message, used especially for delete
  stockName, // Optional: For trading actions
  quantity, // Optional: For trading actions
  pricePerStock, // Optional: For trading actions
  type, // 'buy', 'sell', or 'delete'
  itemName // Optional: Name of the item being deleted (e.g., user name)
}) => {

  // Determine action specifics based on type
  const isTradingAction = type === 'buy' || type === 'sell';
  const isDeleteAction = type === 'delete';

  // --- Define dynamic text content based on type ---
  let modalTitle = title;
  let confirmButtonText = 'Confirm'; // Default button text
  let messageContent = message; // Use provided message by default

  // Set Title and Button Text based on type
  if (type === 'buy') {
    modalTitle = title || 'Confirm Purchase';
    confirmButtonText = 'Confirm Buy';
  } else if (type === 'sell') {
    modalTitle = title || 'Confirm Sale';
    confirmButtonText = 'Confirm Sell';
  } else if (isDeleteAction) {
    modalTitle = title || 'Confirm Deletion';
    confirmButtonText = 'Confirm Delete';
    // Construct a default delete message if a specific one wasn't provided
    if (!message) {
        messageContent = `Are you sure you want to delete ${itemName ? `"${itemName}"` : 'this item'}? This action cannot be undone.`;
    }
  }
  // --- End dynamic text content ---


  // --- Format message content for Trading Actions ---
  // Show detailed trading info only if type is buy/sell AND relevant props exist
  if (isTradingAction && stockName && typeof quantity === 'number' && typeof pricePerStock === 'number') {
    const stockTotal = (quantity * pricePerStock);
    const totalWithFee = type === 'buy'
      ? (stockTotal + PORTAL_FEE)
      : (stockTotal - PORTAL_FEE);

    messageContent = (
      // Using original formatting structure
      <div className="space-y-2">
        <p className="mb-4"> {/* Original margin */}
          Are you sure you want to {type} {quantity} {quantity === 1 ? 'stock' : 'stocks'} of {stockName}?
        </p>
        {/* Details Box - Using original classes */}
        <div className="bg-gray-50 p-4 rounded-lg space-y-2">
          <div className="flex justify-between">
            <span>Stock Price:</span>
            <span>₹{pricePerStock.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Quantity:</span>
            <span>{quantity}</span>
          </div>
          <div className="flex justify-between">
            <span>Stock Total:</span>
            <span>₹{stockTotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-orange-600"> {/* Original color */}
            <span>Portal Fee:</span>
            <span>₹{PORTAL_FEE.toFixed(2)}</span>
          </div>
          {/* Separator and Total - Original structure/classes */}
          <div className="border-t pt-2 mt-2">
            <div className="flex justify-between font-bold">
              <span>{type === 'buy' ? 'Total Cost:' : 'Net Proceeds:'}</span>
              <span className={type === 'buy' ? 'text-red-600' : 'text-green-600'}> {/* Original colors for total */}
                ₹{totalWithFee.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  } else if (isDeleteAction && !message) {
    // Use the default delete message constructed earlier if no specific message was passed
     messageContent = `Are you sure you want to delete ${itemName ? `"${itemName}"` : 'this item'}? This action cannot be undone.`;
  }
  // If it's not a trading action with full details, or not delete with default message,
  // `messageContent` remains the `message` prop passed in.


  // --- Modal Rendering ---
  // Restore original outer structure and classes
  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center overflow-y-auto ${isOpen ? 'block' : 'hidden'}`}>
      {/* Backdrop - Original */}
      <div className="fixed inset-0 bg-gray-900 opacity-50"></div>

      {/* Modal Content Box - Restore original classes and transitions */}
      <div className={`relative w-full max-w-md mx-auto my-8 bg-white rounded-2xl shadow-2xl border border-gray-100 transform transition-all duration-300 ease-in-out ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
        {/* Modal Body - Original padding */}
        <div className="p-6">
          {/* Modal Title - Original styling */}
          <h2 id="confirmation-modal-title" className="text-2xl font-semibold text-gray-800">
             {modalTitle} {/* Use dynamic title */}
          </h2>

          {/* Modal Message - Original styling */}
          <div id="confirmation-modal-description" className="mt-4 text-gray-600">
             {messageContent} {/* Use dynamic message content */}
          </div>

          {/* Action Buttons - Restore original structure and classes */}
          <div className="mt-6 flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors duration-200" // Original cancel style
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirm}
              // Use BLUE button style consistently
              className={`px-6 py-3 rounded-xl text-white transition-colors duration-200 bg-lightBlue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`} // Use blue color
            >
              {confirmButtonText} {/* Use dynamic button text */}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Add PropTypes for type safety and documentation
ConfirmationModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  title: PropTypes.string, // Optional: Custom title
  message: PropTypes.oneOfType([PropTypes.string, PropTypes.node]), // Can be string or JSX
  stockName: PropTypes.string, // Optional: Required for buy/sell detail view
  quantity: PropTypes.number, // Optional: Required for buy/sell detail view
  pricePerStock: PropTypes.number, // Optional: Required for buy/sell detail view
  type: PropTypes.oneOf(['buy', 'sell', 'delete']).isRequired, // Action type
  itemName: PropTypes.string // Optional: Name of item for delete message
};

export default ConfirmationModal;