import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import { submitComplaint, updateComplaint } from "../../../redux/User/complaintSlice";
import toast from "react-hot-toast";

const ComplaintModal = ({ onClose, onComplaintSubmit, complaintData }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.user.complaint);

  const today = new Date().toISOString().split("T")[0];
  const user = JSON.parse(localStorage.getItem("user"));

  const formik = useFormik({
    initialValues: {
      userId: user?._id || "",
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
    onSubmit: async (values) => {
      if (!values.userId) {
        toast.error("User not found. Please log in.");
        return;
      }

      const formData = {
        ...values,
        complaintDate: today,
      };

      if (complaintData) {
        dispatch(updateComplaint({ complaintId: complaintData._id, formData }))
          .unwrap()
          .then(() => {
            toast.success("Complaint updated successfully!");
            onComplaintSubmit?.();
            onClose();
          })
          .catch((err) => toast.error(err || "Failed to update complaint"));
      } else {
        dispatch(submitComplaint(formData))
          .unwrap()
          .then(() => {
            toast.success("Complaint submitted successfully!");
            onComplaintSubmit?.();
            onClose();
          })
          .catch((err) => toast.error(err || "Failed to submit complaint"));
      }
    },
  });

  useEffect(() => {
    if (complaintData) {
      formik.setValues({
        userId: complaintData.userId || user?._id || "",
        category: complaintData.category || "",
        complaintMessage: complaintData.complaintMessage || "",
        complaintDate: complaintData.complaintDate || today,
      });
    }
  }, [complaintData]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-gray">
      <div className="fixed inset-0 bg-gray-900 opacity-50"></div>
      <div className="relative w-full sm:mx-auto my-8 bg-white rounded-2xl shadow-2xl border border-gray-100" style={{ width: "80%", maxWidth: "80%", maxHeight: "90vh" }}>
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
            <i className="fas fa-exclamation-circle text-red-600 mr-2"></i> {complaintData ? "Edit Complaint" : "Submit Complaint"}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-colors duration-200">
            <i className="fas fa-times text-gray-400 hover:text-gray-600"></i>
          </button>
        </div>
        <div className="p-6">
          <form className="space-y-6" onSubmit={formik.handleSubmit}>
            <div className="max-h-[300px] overflow-y-auto grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Complaint Type</label>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Complaint Message</label>
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

            <div className="sticky flex justify-end space-x-4 pt-6 border-t border-gray-100">
              <button type="button" onClick={onClose} className="px-6 py-3 rounded-xl text-gray-700 hover:bg-gray-100">
                Cancel
              </button>
              <button type="submit" className="px-6 py-3 rounded-xl bg-red-600 text-white" disabled={loading}>
                {loading ? "Submitting..." : complaintData ? "Update Complaint" : "Submit Complaint"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ComplaintModal;
