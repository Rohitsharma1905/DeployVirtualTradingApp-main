import React, { useState, useEffect, useCallback } from "react";
import PropTypes from 'prop-types';
import { Listbox, Transition } from '@headlessui/react';
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { BASE_API_URL } from "../../../utils/BaseUrl";
import { toast } from 'react-hot-toast';
import { Camera, Check, ChevronsUpDown, X } from 'lucide-react';

const AddGalleryImage = ({ closeModal, refreshData }) => {
  const [categories, setCategories] = useState([]);
  const [fetchError, setFetchError] = useState("");
  const [imagePreview, setImagePreview] = useState(null);

  const fetchGalleryCategories = useCallback(async () => {
    setFetchError("");
    try {
      const response = await axios.get(
        `${BASE_API_URL}/admin/galleryCategory/getGalleryCategories/all/name/increasing`
      );
      const categoryData = response.data?.categoryData || [];
      setCategories(categoryData);

      if (categoryData.length === 0) {
        setFetchError("No categories found. Please add a category first.");
        toast.error("No categories found to select from.");
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Failed to fetch categories. Cannot add image.";
      console.error("Error fetching categories:", error);
      setFetchError(errorMsg);
      toast.error(errorMsg);
      setCategories([]);
    }
  }, []);

  useEffect(() => {
    fetchGalleryCategories();
  }, [fetchGalleryCategories]);

  const initialValues = {
    categoryName: "",
    title: "",
    desc: "",
    photo: null,
  };

  const validationSchema = Yup.object({
    categoryName: Yup.string()
      .required("Category Name is required"),
    title: Yup.string()
      .nullable()
      .transform((value) => (value === "" ? null : value))
      .min(5, "Title must be at least 5 characters")
      .max(50, "Title must be at most 50 characters"),
    desc: Yup.string()
      .nullable()
      .transform((value) => (value === "" ? null : value))
      .min(5, "Description must be at least 5 characters")
      .max(200, "Description must be at most 200 characters"),
    photo: Yup.mixed()
      .required("An image file is required")
  });

  const handleImageUpload = useCallback((event, setFieldValue, setFieldError) => {
    const file = event.target.files?.[0];
    event.target.value = null;

    if (!file) {
      setFieldValue("photo", null);
      setFieldError("photo", undefined);
      setImagePreview(null);
      return;
    }

    const acceptedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!acceptedTypes.includes(file.type)) {
      const errorMsg = "Invalid file type (JPG, PNG, GIF, WEBP only).";
      toast.error(errorMsg);
      setFieldError("photo", errorMsg);
      setFieldValue("photo", null);
      setImagePreview(null);
      return;
    }

    const maxSizeMB = 5;
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      const errorMsg = `Image size exceeds ${maxSizeMB}MB limit.`;
      toast.error(errorMsg);
      setFieldError("photo", errorMsg);
      setFieldValue("photo", null);
      setImagePreview(null);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      try {
        setImagePreview(reader.result);
        setFieldValue("photo", reader.result);
        setFieldError("photo", undefined);
        toast.success("Image ready!");
      } catch (readError) {
        console.error("Error processing file:", readError);
        toast.error("Failed to process image.");
        setFieldError("photo", "Failed to process image.");
        setFieldValue("photo", null);
        setImagePreview(null);
      }
    };
    reader.onerror = () => {
      toast.error("Error reading file.");
      setFieldError("photo", "Error reading file.");
      setFieldValue("photo", null);
      setImagePreview(null);
    };
    reader.readAsDataURL(file);
  }, []);

  const addGalleryImage = async (values, { resetForm, setSubmitting }) => {
    try {
      const base64Data = values.photo.split(',')[1];
      
      const payload = {
        photo: base64Data,
        categoryName: values.categoryName,
        title: values.title || null,
        desc: values.desc || null,
      };

      const response = await axios.post(
        `${BASE_API_URL}/admin/gallery/addGalleryItem`,
        payload,
        { headers: { 'Content-Type': 'application/json' } }
      );

      if (response?.status === 201) {
        toast.success(response.data?.message || "Image added successfully!");
        resetForm();
        setImagePreview(null);
        refreshData?.();
        closeModal();
      } else {
        toast.error(response.data?.message || 'Failed to add image');
      }
    } catch (error) {
      console.error("Error submitting gallery item:", error);
      toast.error(error.response?.data?.message || "Submission failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4">
      <div className="fixed inset-0 bg-gray-900 opacity-50" onClick={closeModal} />

      <div className="relative w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-xl border border-gray-100 overflow-y-auto max-h-[90vh]">
        <div className="flex justify-between items-center p-4 md:p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-lightBlue-600 rounded-lg flex items-center justify-center">
              <Camera className="h-4 w-4 md:h-5 md:w-5 text-white" />
            </div>
            <h2 className="text-lg md:text-xl font-semibold text-gray-800">Register New Image</h2>
          </div>
          <button 
            onClick={closeModal} 
            className="p-1 md:p-2 text-gray-400 hover:text-gray-600 rounded-lg"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4 md:p-6">
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={addGalleryImage}
          >
            {({ isSubmitting, isValid, setFieldValue, setFieldError, values }) => (
              <Form className="space-y-4 md:space-y-6">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
                  <div className="space-y-3 md:space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Category Name <span className="text-red-500">*</span>
                      </label>
                      <Listbox
                        value={values.categoryName}
                        onChange={(value) => setFieldValue("categoryName", value)}
                        disabled={categories.length === 0}
                      >
                        <div className="relative">
                          <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left border border-gray-300 focus:outline-none focus:ring-1 focus:ring-lightBlue-600 focus:border-lightBlue-600 sm:text-sm h-[42px]">
                            <span className="block truncate">
                              {values.categoryName || "Select Category"}
                            </span>
                            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                              <ChevronsUpDown className="h-5 w-5 text-gray-400" />
                            </span>
                          </Listbox.Button>
                          <Transition
                            as={React.Fragment}
                            leave="transition ease-in duration-100"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                          >
                            <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                              {categories.map((category) => (
                                <Listbox.Option
                                  key={category._id}
                                  className={({ active }) =>
                                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                      active ? 'bg-blue-100 text-blue-900' : 'text-gray-900'
                                    }`
                                  }
                                  value={category.name}
                                >
                                  {({ selected }) => (
                                    <>
                                      <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                                        {category.name}
                                      </span>
                                      {selected && (
                                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-lightBlue-600">
                                          <Check className="h-5 w-5" />
                                        </span>
                                      )}
                                    </>
                                  )}
                                </Listbox.Option>
                              ))}
                            </Listbox.Options>
                          </Transition>
                        </div>
                      </Listbox>
                      <ErrorMessage name="categoryName" component="div" className="text-red-500 text-xs mt-1" />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Event Image <span className="text-red-500">*</span>
                      </label>
                      <div className="mt-1 flex justify-center rounded-lg border border-dashed border-gray-300 px-4 py-8 md:px-6 md:py-10">
                        {imagePreview ? (
                          <div className="relative">
                            <img
                              src={imagePreview}
                              alt="Preview"
                              className="max-h-32 md:max-h-40 rounded-lg object-contain"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                setImagePreview(null);
                                setFieldValue("photo", null);
                              }}
                              className="absolute top-0 right-0 p-1 bg-red-500 rounded-full text-white"
                            >
                              <X className="w-3 h-3 md:w-4 md:h-4" />
                            </button>
                          </div>
                        ) : (
                          <div className="text-center">
                            <Camera className="mx-auto h-10 w-10 md:h-12 md:w-12 text-gray-400" />
                            <div className="mt-3 md:mt-4 flex flex-col md:flex-row text-sm text-gray-600 items-center justify-center">
                              <label
                                htmlFor="photo-upload"
                                className="relative cursor-pointer rounded-md bg-white font-medium text-lightBlue-600 hover:text-lightBlue-600 focus-within:outline-none"
                              >
                                <span>Upload a file</span>
                                <input
                                  id="photo-upload"
                                  name="photo"
                                  type="file"
                                  accept="image/*"
                                  className="sr-only"
                                  onChange={(e) => handleImageUpload(e, setFieldValue, setFieldError)}
                                />
                              </label>
                              <p className="md:pl-1">or drag and drop</p>
                            </div>
                            <p className="text-xs text-gray-500 mt-1 md:mt-2">PNG, JPG, GIF up to 5MB</p>
                          </div>
                        )}
                      </div>
                      <ErrorMessage name="photo" component="div" className="text-red-500 text-xs mt-1" />
                    </div>
                  </div>

                  <div className="space-y-3 md:space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Title
                      </label>
                      <Field
                        type="text"
                        name="title"
                       className="block w-full rounded-lg border !border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring-1 focus:ring-lightBlue-600 focus:border-lightBlue-600 sm:text-sm"
                        placeholder="Enter Title"
                      />
                      <ErrorMessage name="title" component="div" className="text-red-500 text-xs mt-1" />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <Field
                        as="textarea"
                        name="desc"
                        rows={3}
                        className="block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring-1 focus:ring-lightBlue-600 focus:border-lightBlue-600 sm:text-sm"
                        placeholder="Enter description"
                      />
                      <ErrorMessage name="desc" component="div" className="text-red-500 text-xs mt-1" />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end items-center space-x-3 pt-4 md:pt-6 border-t border-gray-200 sticky bottom-0 bg-white py-3">
                  <button
                    type="button"
                    onClick={closeModal}
                    disabled={isSubmitting}
                    className="px-3 py-1 md:px-4 md:py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lightBlue-600 disabled:opacity-50 text-sm md:text-base"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || !isValid}
                    className="px-3 py-1 md:px-4 md:py-2 border border-transparent rounded-lg shadow-sm text-white bg-lightBlue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lightBlue-600 disabled:opacity-50 text-sm md:text-base"
                  >
                    {isSubmitting ? "Saving..." : "Register Image"}
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

AddGalleryImage.propTypes = {
  closeModal: PropTypes.func.isRequired,
  refreshData: PropTypes.func,
};

export default AddGalleryImage;