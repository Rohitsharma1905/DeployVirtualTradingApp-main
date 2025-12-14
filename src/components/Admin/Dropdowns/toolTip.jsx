import React, { useEffect, useRef, useState } from "react";
import { createPopper } from "@popperjs/core";
import ConfirmationModal from "../Modals/ConformationModal"; // Import the modal component

const Tooltip = ({ children, content, placement = "top", orgId, collection }) => {
  const [tooltipShow, setTooltipShow] = useState(false);
  const [status, setStatus] = useState(null); // Track the current status
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const [pendingAction, setPendingAction] = useState(null); // Track pending action ("approved" or "rejected")
  const btnRef = useRef(null);
  const tooltipRef = useRef(null);
  const popperInstance = useRef(null);

  // Fetch the current status of the organization when the component mounts
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const endpoint = collection === "organizations"
          ? `http://localhost:5000/api/organizations/${orgId}`
          : `http://localhost:5000/api/orgRegister/${orgId}`;

        const response = await fetch(endpoint);
        const result = await response.json();
        if (response.ok) {
          setStatus(result.approvalStatus); // Initialize the status state
        } else {
          console.error("Failed to fetch organization status:", result.error);
        }
      } catch (error) {
        console.error("Error fetching organization status:", error);
      }
    };

    fetchStatus();
  }, [orgId, collection]); // Fetch status whenever orgId or collection changes

  useEffect(() => {
    if (tooltipShow && btnRef.current && tooltipRef.current) {
      popperInstance.current = createPopper(btnRef.current, tooltipRef.current, {
        placement: placement,
        modifiers: [{ name: "preventOverflow", options: { boundary: "viewport" } }],
      });
    }
  }, [tooltipShow, placement]);

  const closeTooltip = () => {
    setTooltipShow(false);
  };

  const handleApproval = async (newStatus) => {
    try {
      const endpoint = collection === "organizations"
        ? `http://localhost:5000/api/organizations/${orgId}/approval`
        : `http://localhost:5000/api/orgRegister/${orgId}/approve`;

      const response = await fetch(endpoint, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }), // Send `status` field
      });

      const result = await response.json();
      if (response.ok) {
        setStatus(newStatus); // Update the status state
        setTooltipShow(false); // Close tooltip after action
      } else {
        console.error(`Failed to update: ${result.error}`);
      }
    } catch (error) {
      console.error("Error updating approval status:", error);
    }
  };

  const handleActionClick = (action) => {
    setPendingAction(action); // Set the pending action ("approved" or "rejected")
    setIsModalOpen(true); // Open the confirmation modal
  };

  const handleConfirm = () => {
    setIsModalOpen(false); // Close the modal
    handleApproval(pendingAction); // Perform the approval/rejection action
  };

  const handleCancel = () => {
    setIsModalOpen(false); // Close the modal
    setPendingAction(null); // Reset the pending action
  };

  return (
    <div className="relative inline-block">
      <div
        ref={btnRef}
        onMouseEnter={() => setTooltipShow(true)}
        onMouseLeave={closeTooltip}
        onClick={() => setTooltipShow(!tooltipShow)}
      >
        {children}
      </div>
      {tooltipShow && (
        <div
          ref={tooltipRef}
          className="absolute bg-lightBlue-600 text-white px-4 py-3 rounded shadow-lg z-50 transition-opacity duration-200 ease-in-out"
          onMouseEnter={() => setTooltipShow(true)}
          onMouseLeave={closeTooltip}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="mb-4">{content}</div>
          <div className="flex gap-4">
            <button
              onClick={() => handleActionClick("approved")}
              className={`bg-green-500 px-4 py-2 rounded-md text-sm font-medium ${
                status !== "approved" ? "hover:bg-green-600" : "opacity-50 cursor-not-allowed"
              } transition-colors duration-200`}
              disabled={status === "approved"} // Disable if status is "approved"
            >
              Approve
            </button>
            <button
              onClick={() => handleActionClick("rejected")}
              className={`bg-red-500 px-3 py-1.5 rounded-md text-sm font-medium ${
                status !== "rejected" ? "hover:bg-red-600" : "opacity-50 cursor-not-allowed"
              } transition-colors duration-200`}
              disabled={status === "rejected"} // Disable if status is "rejected"
            >
              Reject
            </button>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={handleCancel}
        onConfirm={handleConfirm}
        message={`Are you sure you want to ${pendingAction} this organization?`}
      />
    </div>
  );
};

export default Tooltip;