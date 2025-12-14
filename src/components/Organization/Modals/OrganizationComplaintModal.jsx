import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast, { Toaster } from "react-hot-toast";

const OrganizationComplaintModal = ({
  isOpen,
  onClose,
  onSubmit,
  complaintData,
  loading,
}) => {
  const org = localStorage.getItem("org");
  const today = new Date().toISOString().split("T")[0];

  const formik = useFormik({
    initialValues: {
      category: "",
      complaintMessage: "",
      complaintDate: today,
    },
    validationSchema: Yup.object({
      category: Yup.string().required("Complaint type is required"),
      complaintMessage: Yup.string()
      .min(5, "Message must be at least 5 characters")
      .max(200, "Message must be less than 200 characters")
        .required("Complaint message is required"),
    }),
    onSubmit: (values) => {
      if (!org) {
        toast.error("Organization not found. Please log in.");
        return;
      }

      const payload = {
        ...values,
        orgName: localStorage.getItem("orgName"),
        organizationId: JSON.parse(org)._id,
      };

      onSubmit(payload);
      onClose();
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (complaintData) {
        formik.setValues({
          category: complaintData.category || "",
          complaintMessage: complaintData.complaintMessage || "",
          complaintDate: complaintData.complaintDate || today,
        });
      } else {
        formik.setValues({
          category: "",
          complaintMessage: "",
          complaintDate: today,
        });
      }
    }
  }, [isOpen, complaintData]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-gray">
    <div className="fixed inset-0 bg-gray-900 opacity-50"></div>
    
    <div
      className="relative w-full sm:mx-auto my-8 bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col"
      style={{ width: "80%", maxWidth: "80%", maxHeight: "90vh" }}
    >
      {/* Header - fixed */}
      <div className="flex justify-between items-center p-6 border-b border-gray-100">
        <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
          <i className="fas fa-exclamation-circle text-red-600 mr-2"></i>
          {complaintData ? "Edit Complaint" : "Submit Complaint"}
        </h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-xl transition-colors duration-200"
        >
          <i className="fas fa-times text-gray-400 hover:text-gray-600"></i>
        </button>
      </div>
  
      {/* Scrollable form area */}
      <div className="overflow-y-auto px-6 py-4" style={{ maxHeight: "calc(90vh - 140px)" }}>
        <form className="space-y-6" onSubmit={formik.handleSubmit}>
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Complaint Type
              </label>
              <select
                name="category"
                value={formik.values.category}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full px-4 py-3 rounded-xl border ${
                  formik.touched.category && formik.errors.category
                    ? 'border-yellow-500 focus:ring-yellow-500/20'
                    : 'border-gray-200 focus:border-lightBlue-500 focus:ring-lightBlue-500/20'
                }`}
              >
                <option value="">Select Type</option>
                <option value="Account Issues">Account Issues</option>
                <option value="Payment Problems">Payment Problems</option>
                <option value="Technical Errors">Technical Errors</option>
                <option value="Service Quality">Service Quality</option>
                <option value="Other">Other</option>
              </select>
              {formik.touched.category && formik.errors.category && (
                <p className="text-sm text-red-600 mt-1">{formik.errors.category}</p>
              )}
            </div>
  
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Complaint Message
              </label>
              <textarea
                name="complaintMessage"
                value={formik.values.complaintMessage}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Write your complaint here..."
                className={`w-full px-4 py-3 rounded-xl border ${
                  formik.touched.category && formik.errors.category
                    ? 'border-yellow-500 focus:ring-yellow-500/20'
                    : 'border-gray-200 focus:border-lightBlue-500 focus:ring-lightBlue-500/20'
                }`}
              ></textarea>
              {formik.touched.complaintMessage && formik.errors.complaintMessage && (
                <p className="text-sm text-red-600 mt-1">{formik.errors.complaintMessage}</p>
              )}
            </div>
            
          </div>
  
          {/* Add any additional scrollable fields here */}
        </form>
      </div>
  
      {/* Footer - fixed */}
      <div className="flex justify-end space-x-4 p-6 border-t border-gray-100">
        <button
          type="button"
          onClick={onClose}
          className="px-6 py-3 rounded-xl text-gray-700 hover:bg-gray-100"
        >
          Cancel
        </button>
        <button
          type="submit"
          onClick={formik.handleSubmit}
          className="px-6 py-3 rounded-xl bg-red-600 text-white"
          disabled={loading}
        >
          {loading
            ? "Submitting..."
            : complaintData
            ? "Update Complaint"
            : "Submit Complaint"}
        </button>
      </div>
    </div>
  
    <Toaster />
  </div>
  
  );
};

export default OrganizationComplaintModal;
