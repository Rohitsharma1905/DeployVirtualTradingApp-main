import React from "react";
import PropTypes from 'prop-types';
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { BASE_API_URL } from "../../../utils/BaseUrl";
import { toast } from 'react-hot-toast';



const AddGalleryCategory = ({ closeModal, refreshCategories }) => {

  //Set Initial Values to NULL
  const initialValues = {
    name: "",
  }

  // Validation schema using Yup
  const validationSchema = Yup.object({
    name: Yup.string().trim().required("Category name is required").min(3,"Category must not be of more than 3 characters").max(50, "Category must not be of more than 50 characters"),
  });

  const addCategoryName = async (values, {resetForm}) => {
    try {
      const response = await axios.post(
        `${BASE_API_URL}/admin/galleryCategory/addGalleryCategory`, values
      );
      console.log("Add Gallery Category Response:", response);

      // --- SUCCESS BLOCK ---
      if(response?.status === 201){
        console.log("Form submitted successfully", response.data);
        toast.success(response?.data?.message);
        refreshCategories(); // Refresh the list in the parent component
        resetForm();         // Reset the form fields
        closeModal();        // <-- **** ADD THIS LINE **** Close the modal
      }
      // --- Other status checks ---
      else if (response?.status === 409) {
        toast(response?.data?.message, {
          icon: '⚠️',
        })
      }
      else if (response?.status === 500) {
        toast(response?.data?.message, {
          icon: '🛑',
        })
      }
    }
    catch (error) {
      console.error("Error submitting data:", error);
      // --- Keep your existing error handling ---
      if (error.response) {
        const { status, data } = error.response;
        if (status === 409) {
          toast(data?.message, { icon: '⚠️' });
        }
        else if (status === 500) {
          toast(data?.message, { icon: '🛑' });
        }
        else {
          toast.error(data?.message || "Unknown error, please try again.");
        }
      }
      else {
        toast.error("An internal server error occurred!");
      }
      // Do NOT close the modal on error, user might need to fix input
      throw error; // Re-throw if needed by Formik/calling context
    }
    // No finally block needed here
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto">
      <div
        className="fixed inset-0 bg-gray-900 opacity-50"
        onClick={closeModal}
      />

      {/* Modal Box */}
      <div
        style={{ width: "100%", maxWidth: "60%" }}
        className="relative w-full max-w-4xl mx-auto my-8 bg-white rounded-2xl shadow-2xl border border-gray-100"
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-lightBlue-600 rounded-xl flex items-center justify-center shadow-lg">
              <i className="fas fa-folder-open text-white fa-lg" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800">
              Register New Category
            </h2>
          </div>
          <button
            onClick={closeModal}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors duration-200"
          >
            <i className="fas fa-times text-gray-400 hover:text-gray-600" />
          </button>
        </div>

        {/* Form */}
        <div className="p-6">
          <Formik
            // initialValues={{name:""}}
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={addCategoryName}
          >
          {({ isSubmitting, isValid }) => (
              <Form className="space-y-6">
                <div className="flex flex-col md:flex-row gap-5 max-h-[300px]  overflow-y-auto  ">
                  <div className="p-2 pt-3 pb-3 rounded-xl flex-1">
                    <div className="space-y-6">
                      <FormField
                        required
                        label="Category Name"
                        type="text"
                        name="name"
                        placeholder="Enter category name"
                      />
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="sticky flex justify-end items-center space-x-4 pt-6 border-t border-gray-100">
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={closeModal}
                    className="mr-3 px-6 py-3 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors duration-200 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || !isValid}
                    className="px-6 py-3 rounded-xl bg-lightBlue-600 text-white hover:bg-lightBlue-700 focus:ring-2 focus:ring-lightBlue-600/20 transition-all duration-200 disabled:opacity-50 flex items-center"
                  >
                  {isSubmitting ? "Saving...." : "Register Category"}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

const FormField = ({ name, label, required = false, type = "text", placeholder, className = "" }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <Field
      type={type}
      name={name}
      className="w-full px-4 py-3 !rounded-xl border !border-gray-200 bg-white text-gray-900 focus:!border-lightBlue-600 focus:ring-2 focus:!ring-lightBlue-600/20 focus:outline-none transition-all duration-200"
      placeholder={placeholder}
    />
    <ErrorMessage
      name={name}
      component="div"
      className="text-red-500 text-sm mt-1"
    />
  </div>
);

AddGalleryCategory.propTypes = {
  closeModal: PropTypes.func.isRequired,
  refreshCategories: PropTypes.func.isRequired,
}

export default AddGalleryCategory;

