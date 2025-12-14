import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { BASE_API_URL } from "../../../utils/BaseUrl";

import { Edit, Trash2 } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhotoVideo } from "@fortawesome/free-solid-svg-icons";
import { FaTimes } from "react-icons/fa";
import { FolderOpen } from "lucide-react";
import { toast } from 'react-hot-toast';

import ConfirmationModal from "../Modals/ConformationModal";
import UpdateGalleryImage from "./UpdateGalleryImage";

const TitleCell = ({ title }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const shouldTruncate = title.length > 50;
  const displayText = isExpanded
    ? title
    : title.slice(0, 50) + (shouldTruncate ? "..." : "");

  return (
    <div className="flex flex-col">
      <span>{displayText}</span>
      {shouldTruncate && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-lightBlue-600 text-xs hover:underline mt-1 self-start focus:outline-none"
        >
          {isExpanded ? "Show less" : "Show more"}
        </button>
      )}
    </div>
  );
};

const CategoryImagesTable = ({ closeModal, tableCategoryName }) => {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const handleDeleteCategory = (id) => {
      setDeleteId(id);  
      setIsModalOpen(true); 
    };
    const confirmDelete = async () => {
      if (!deleteId) return;
      try {
        const response = await axios.patch(
          `${BASE_API_URL}/admin/gallery/deleteGalleryItem/${deleteId}`
        );
    
        console.log("Delete Gallery Category Response: ", response);
    
        if (response?.status === 201) {
          toast.success(response?.data?.message);
          refreshCategoryImages();
        } 
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
        console.error("Error deleting category:", error);
        if (error.response) {
          const { status, data } = error.response;
          if (status === 409) {
            // toast.warning(data?.message);
            toast(data?.message, {
              icon: '⚠️',
            });
          } 
          else if (status === 500) {
            // toast.error(data?.message);
            toast(data?.message, {
              icon: '🛑',
            })
          } 
          else {
            toast.error(data?.message || "Unknown error, please try again.");
          }
        } 
        else {
          toast.error("An internal server error occurred!");
        }  
        throw error; 
      }
      setIsModalOpen(false);
      setDeleteId(null); 
    };

  const [categoryImages, setCategoryImages] = useState([]);

  const [previewData, setPreviewData] = useState(null);

  const [err, setErr] = useState("");
  const [search, setSearch] = useState("");

  const fetchCategoryImages = async () => {
    try {
      const searchQuery = search.trim() === "" ? "all" : search;

      const response = await axios.get(
        `${BASE_API_URL}/admin/gallery/getGalleryItems/${tableCategoryName}`
      );
      console.log("Gallery Images of Particular Category: ", response.data);

      // if(response?.status === 201||response?.status === 200)
      setCategoryImages(response.data.ImageData);
    } 
    catch (error) {
      if (error.response) {
        setErr(error.response?.data?.message);
      } else {
        setErr("Something went wrong. Please try again.");
      }
      throw error;
    }
  };

  const refreshCategoryImages = () => {
    fetchCategoryImages(); // Re-fetch categories to get the updated list
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        fetchCategoryImages();
        setErr("");
      } catch (error) {
        setErr(error.response?.data?.message || "Something went wrong.");
      }
    };
    fetchData();
  }, [search]);

  const [isOpenImageUpdate, setIsOpenImageUpdate] = useState(false);
  const openUpdateImageModal = () => setIsOpenImageUpdate(true);
  const closeUpdateImageModal = () => setIsOpenImageUpdate(false);
  const [updateImageId, setUpdateImageId] = useState(null)
  const [updateImageData, setUpdateImageData] = useState({})

  const handleImageUpdate = (id, data) => {
    setUpdateImageId(id)
    setUpdateImageData(data)
    openUpdateImageModal()
  }

  return (
    <>
      <div className="ml-14 fixed inset-0 z-50 flex items-center justify-center overflow-y-auto">
        <div
          className="fixed inset-0 bg-gray-900 opacity-50"
          onClick={closeModal}
        />
        <div
          style={{ width: "100%", maxWidth: "90%" }}
          className="relative w-full max-w-4xl mx-auto my-8 bg-white rounded-2xl shadow-2xl border border-gray-100"
        >
          <div className="sticky top-0 bg-white left-0 w-full rounded-2xl border-b border-gray-100 p-4 mt-1">
            {/* Top Header */}
            <div className="flex justify-between items-center">
              {/* Left Side (Icon + Heading) */}
              <div className="flex items-center gap-3">
                <FontAwesomeIcon
                  icon={faPhotoVideo}
                  className="text-gray-500 text-[21px]"
                />
                <h2 className="text-lg font-bold text-gray-800">
                  {`${tableCategoryName
                    .split(" ")
                    .map(
                      (word) =>
                        word.charAt(0).toUpperCase() +
                        word.slice(1).toLowerCase()
                    )
                    .join(" ")} - Images`}
                </h2>
              </div>

              <div className="flex items-center gap-4">
                <h6 className="text-base font-semibold text-gray-400">
                  Total Images: {categoryImages.length}
                </h6>

                {/* Search bar */}
                <div className="relative shadow-sm rounded-lg">
                  <div className="relative w-[280px]">
                    {/* Search Icon */}
                    <img
                      src="https://cdn-icons-png.flaticon.com/512/622/622669.png"
                      alt="search"
                      className="absolute left-3 top-1/4 transform -translate-y-1/2 w-4 h-4"
                    />
                    {/* Search Input */}
                    <input
                      type="text"
                      placeholder="Search..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value || "")}
                      className="border border-gray-400 pl-10 pr-4 py-2 rounded-lg w-full h-[36px] focus:outline-none focus:shadow-md focus:border-black"
                    />
                  </div>
                </div>

                {/* Close Button */}
                <button
                  onClick={closeModal}
                  className="p-2 hover:bg-gray-100 rounded-md transition-colors focus:outline-none"
                >
                  <FaTimes className="text-gray-500 hover:text-gray-700 text-lg" />
                </button>
              </div>
            </div>
          </div>

          <div className="flex h-[63vh]">
            <div
              className={`inset-0 ${
                categoryImages.length > 0 ? "overflow-y-auto" : ""
              } w-full max-h-[398px] rounded-lg`}
            >
              <table
                className={`inset-0 min-w-full table-fixed ${
                  categoryImages.length > 0 ? "divide-y" : ""
                } divide-gray-200 border-collapse bg-white`}
              >
                <thead className="bg-gray-50 sticky top-0 z-10">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Event Images
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Event Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Event Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-center">
                      Image Posted
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-center">
                      Post Last Updated
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-center">
                      Actions
                    </th>
                  </tr>
                </thead>

                {err && (
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td colSpan="6">
                        <div className="mt-10 ml-15 flex justify-center items-center min-h-[180px]">
                          <div className="flex flex-col items-center justify-center w-96 bg-gray-100 rounded-lg shadow-lg p-6">
                            <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full">
                              <i className="fas fa-exclamation-triangle text-red-500 text-3xl"></i>
                            </div>
                            <b className="text-lg text-gray-800 mt-4">
                              Oops! Something went wrong.
                            </b>
                            <p className="text-gray-600 text-sm text-center mt-2">
                              We couldn’t load the content. Please try again
                              later.
                            </p>
                            <p className="text-red-600 font-medium mt-2">
                              {err}
                            </p>
                            <button
                              onClick={() => window.location.reload()}
                              className="mt-4 px-4 py-2 bg-red-500 text-white text-sm font-semibold rounded-md shadow-md hover:bg-red-600 transition"
                            >
                              Retry
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                )}

                <tbody
                  className={`bg-white ${
                    categoryImages.length > 0 ? "divide-y" : ""
                  } divide-gray-200`}
                >
                  {categoryImages.length > 0
                    ? categoryImages.map((data, index) => {
                        return (
                          <tr
                            key={index}
                            className="hover:bg-gray-50 transition-colors"
                          >
                            <td className="px-6 py-4">
                              <div
                                className="w-22 h-18 overflow-hidden rounded-md cursor-pointer"
                                onClick={ () => setPreviewData({ type: "image", content: data.photo}) }
                              >
                                <img
                                  src={data.photo}
                                  alt="Image"
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            </td>

                            <td className="px-6 py-4 text-sm text-gray-500 min-w-[195px] max-w-[195px]">
                              { data.title ? (<TitleCell title={data.title} />) : (<span className="text-gray-400 pl-4">No Title</span>) }
                            </td>

                            <td className="px-6 py-4 text-sm text-gray-500 min-w-[195px] max-w-[195px]">
                            { data.desc ? (
                              data.desc && data.desc.length > 50 ? (
                                <>
                                {data.desc.slice(0, 50)}...
                                <button
                                className="text-lightBlue-600 ml-1 hover:underline focus:outline-none"
                                onClick={() => setPreviewData({ type: "text", content: data.desc })}
                                >
                                  Show more
                                </button>
                                </>
                              ) : (
                                <>
                                {data.desc}
                                </>
                              )
                            ) : (<span className="text-gray-400 pl-4">No Description</span>) }
                            </td>

                            <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                              {new Date(data.createdDate).toLocaleDateString()}
                            </td>

                            <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                              {data.updatedDate ? (
                                <span className="">
                                  {new Date(
                                    data.updatedDate
                                  ).toLocaleDateString()}
                                </span>
                              ) : (
                                <span className="text-gray-400">N/A</span>
                              )}
                            </td>

                            <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                              <button className="mr-4 text-yellow-600 mx-2 hover:text-yellow-900 transition-colors focus:outline-none"
                              onClick={()=>handleImageUpdate(data._id, data)}>
                                <Edit size={18} />
                              </button>

                              <button className="text-red-600 hover:text-red-900 transition-colors focus:outline-none" onClick={() => handleDeleteCategory(data._id)}>
                                <Trash2 size={18} />
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    : !err && (
                        <tr>
                          <td
                            colSpan="6"
                            className="p-6 text-center text-gray-500 text-base font-medium bg-gray-50 rounded-md mt-4"
                          >
                            <div className="pt-28 pb-30 flex flex-col items-center space-y-2">
                              <FolderOpen className="w-10 h-10 text-gray-400" />
                              <span>No Images available.</span>
                            </div>
                          </td>
                        </tr>
                      )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {previewData && (
        <div className="fixed inset-0 bg-transparent flex items-center justify-center z-80" onClick={() => setPreviewData(null)}>
          <div className="border border-gray-200 bg-white rounded-lg shadow-xl p-4 max-w-md w-full relative" onClick={(e) => e.stopPropagation()}>
          <div className={`${previewData.type === "text" ? 'bg-gray-400 -mt-4 -ml-4 -mr-4 mb-2' : ''} flex justify-end`}>
            <button
                className={`${previewData.type === "text" ? 'p-1 hover:bg-red-200' : '-mt-2 mb-1 p-1 hover:bg-gray-200'} rounded-md focus:outline-none`}
                onClick={() => setPreviewData(null)}
            >
              <FaTimes className={`${previewData.type === "text" ? 'text-red-800 hover:text-red-700' : 'text-gray-400 hover:text-gray-700'} text-lg focus:outline-none`} />
            </button>
            </div>
            {previewData.type === "image" ? (
              <img
              src={previewData.content}
              alt="Preview"
              className="w-full h-85 overflow-hidden rounded-md"
              />
            ) : (
              <p className="text-gray-700 text-base">{previewData.content}</p>
            )}
            <div className="flex justify-end">
            <button
                className="-mb-2 mt-1 p-2 hover:bg-yellow-100 rounded-md focus:outline-none"
                onClick={() => setPreviewData(null)}
            >
              <Edit size={20} className="text-yellow-600 hover:text-yellow-800"/>
            </button>
            </div>
          </div>
        </div>
      )}

{/* Confirmation Modal */}
    <ConfirmationModal
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      onConfirm={confirmDelete}
      title="Confirm Deletion"
      message={`Are you sure you want to delete`}
    />

    {isOpenImageUpdate && <UpdateGalleryImage closeModal={closeUpdateImageModal} refreshCategoryImages={refreshCategoryImages} updateImageId={updateImageId} updateImageData={updateImageData}/>}

    </>
  );
};

TitleCell.propTypes = {
  title: PropTypes.string.isRequired,
};

CategoryImagesTable.propTypes = {
  closeModal: PropTypes.func.isRequired,
  tableCategoryName: PropTypes.string.isRequired, // or PropTypes.string (if optional)
};

export default CategoryImagesTable;
