import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { FolderOpen } from "lucide-react";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";
import { Edit, Trash2 } from "lucide-react";
import { toast } from 'react-hot-toast';

import ConfirmationModal from "../Modals/ConformationModal";
import UpdateGalleryImage from "./UpdateGalleryImage";
import axios from "axios";
import { BASE_API_URL } from "../../../utils/BaseUrl";
import CategoryImagesTable from "./CategoryImagesTable";


const Card = ({ refreshCategories, id, image, title, description, postDate, categoryName}) => {


  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const handleDeleteCategory = (id) => {
      setDeleteId(id);  
      setIsModalOpen(true); 
    };

    const handleEditCategory = () => {
      setIsUpdateModalOpen(true); // Open update modal
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
          refreshCategories();
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

    return (
      <>
      <div className="w-[365px] min-h-[447px] rounded-2xl overflow-hidden shadow-[0_4px_10px_rgba(0,0,0,0.5)] bg-white p-4 flex flex-col justify-between relative">
        {/* Image container with fallback */}
        {image ? (
          <img
            className="w-full h-48 object-cover rounded-xl"
            src={image}
            alt={title}
          />
        ) : (
          <div className="w-full h-48 bg-gray-200 flex items-center justify-center rounded-xl text-gray-400 text-sm">
            No Image
          </div>
        )}
  
        <div className="p-4 flex flex-col justify-between flex-grow">
          {title ? 
          <h2 className="text-base font-semibold text-gray-800">{title.charAt(0).toUpperCase() + title.slice(1)}</h2> 
          : <div className="text-base font-semibold text-gray-400"> No Title </div>}
  
          {description ?
          <div className="h-24 overflow-y-auto text-gray-600 mt-2 text-sm pr-1"> {description.charAt(0).toUpperCase() + title.slice(1)} </div>
          : <div className="h-24 overflow-y-auto text-gray-400 mt-2 text-base pr-1"> No description.... </div>}
  
          {postDate && (
            <p className="max-w-34 -ml-2 rounded-2xl pt-1 pb-1 pl-3 text-xs bg-gray-100 text-gray-600 mt-4">
              Posted on: {new Date(postDate).toLocaleDateString()}
            </p>
          )}
        </div>
  
        <div className="mb-1 absolute bottom-2 right-6 flex space-x-2">
          <button className="p-2 text-lightBlue-600 hover:text-blue-700 hover:bg-blue-100 rounded-lg focus:outline-none"  onClick={handleEditCategory} >
            <Edit size={18} />
          </button>
          <button className="p-2 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-lg focus:outline-none" onClick={() => handleDeleteCategory(id)}>
            <Trash2 size={18} />
          </button>
        </div>
      </div>
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmDelete}
        title="Confirm Deletion"
        message={`Are you sure you want to delete`}
      />

       {/* Update Modal */}
       {isUpdateModalOpen && (
  <UpdateGalleryImage
    closeModal={() => setIsUpdateModalOpen(false)}
    refreshCategoryImages={refreshCategories}
    updateImageId={id}
    updateImageData={{
      photo: image,
      title: title,
      desc: description,
      categoryName: categoryName, // Add this line
    }}
  />
)}
      </>
    );
};


const CategoryImagesCards = ({ categoryName }) => {

  const [galleryItems, setGalleryItems] = useState([]);

  const [err, setErr] = useState("");

  const [showModal, setShowModal] = useState(false);
  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  const fetchGalleryItems = async () => {
    try {
      const response = await axios.get(
        `${BASE_API_URL}/admin/gallery/getGalleryItems/${categoryName}`
      );
      setGalleryItems(response.data.ImageData);
      console.log("Gallery Items: ", response.data);
    } 
    catch (error) {
      if (error.response) {
        setErr(error.response?.data?.message);
      } 
      else {
        setErr("Something went wrong.");
      }
      throw error;
    }
  };

  const refreshCategories = () => {
    fetchGalleryItems(); // Re-fetch categories to get the updated list
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        fetchGalleryItems();
        setErr("");
      } 
      catch (error) {
        setErr(error.response?.data?.message || "Something went wrong.");
      }
    };
    fetchData();
  }, []);

  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 3;

  useEffect(() => {
    setCurrentIndex(0);
  }, [galleryItems]);

  const visibleFeedbacks = galleryItems.slice(
    currentIndex,
    currentIndex + itemsPerPage
  );

  const handleNext = () => {
    if (currentIndex + itemsPerPage < galleryItems.length) {
      setCurrentIndex(currentIndex + itemsPerPage);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - itemsPerPage);
    }
  };

  return (
    <>
      <div>
        <section className="mt-4 mb-7 bg-white border border-gray-200 mx-6 p-6 rounded-lg relative">
          {/* Previous Button */}
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="absolute -left-1 mr-10 top-[53%] transform -translate-y-1/2 text-3xl text-gray-500 hover:text-gray-800 disabled:opacity-30 focus:outline-none"
          >
            <BiChevronLeft />
          </button>

          {/* Flex container for headings and button */}
          <div className="flex justify-between items-center mb-6">
            {/* Left-most heading */}
            <div className="flex gap-3 items-center">
              <i className="fas fa-images text-gray-500 text-[20px] mt-[5px]"></i>
              <h3 className="text-lg font-bold text-gray-700">
                {/* {galleryItems.map((data) => (data.categoryName))} */}
                {categoryName.split(" ").map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(" ")}
              </h3>
            </div>
            {/* Right side container */}
            <div className="flex items-center gap-4">
              {/* Second heading before the button */}
              <h6 className="text-[18] font-semibold text-gray-500">
                Total Images: {galleryItems.length}
              </h6>

              {/* View More Button */}
              <button
                className="flex items-center gap-2 px-4 py-1 font-semibold text-sm text-[#1a2c47] border border-[#1a2c47] rounded-lg transition-all duration-300 hover:bg-[#1a2c47] hover:text-white"
                onClick={openModal}
              >
                View More
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 5l7 7m0 0l-7 7m7-7H4"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* {err && <p className="text-red-500">{err}</p>} */}

          <div className="flex justify-center gap-6">
            {err && (
              <div className="flex justify-center items-center min-h-[200px]">
                <div className="flex flex-col items-center justify-center w-96 bg-gray-100 rounded-lg shadow-lg border border-gray-200 p-6">
                  <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full">
                    <i className="fas fa-exclamation-triangle text-red-500 text-3xl"></i>
                  </div>
                  <b className="text-lg text-gray-800 mt-4">
                    Oops! Something went wrong.
                  </b>
                  <p className="text-gray-600 text-sm text-center mt-2">
                    We couldn’t load the content. Please try again later.
                  </p>
                  <p className="text-red-600 font-medium mt-2">{err}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="mt-4 px-4 py-2 bg-red-500 text-white text-sm font-semibold rounded-md shadow-md hover:bg-red-600 transition"
                  >
                    Retry
                  </button>
                </div>
              </div>
            )}

            {galleryItems.length > 0 ? (
              <>
{visibleFeedbacks.map((card) => (
  <Card
    key={card._id}
    refreshCategories={refreshCategories}
    id={card._id}
    image={card.photo}
    title={card.title}
    description={card.desc}
    categoryName={categoryName} // Add this line
    postDate={
      card.updatedDate == null
        ? card.createdDate
        : card.updatedDate
    }
  />
))}
              </>
            ) : (
              !err && (
                <div className="pt-6 pb-6 flex flex-col items-center space-y-2">
                  <span>
                    <FolderOpen className="w-10 h-10 text-gray-400" />
                  </span>
                  <h4 className="text-gray-500 text-sm">
                    No Images available.
                  </h4>
                </div>
              )
            )}
          </div>

          {/* Next Button */}
          <button
            onClick={handleNext}
            disabled={currentIndex + itemsPerPage >= galleryItems.length}
            className="absolute -right-1 ml-10 top-[53%] transform -translate-y-1/2 text-3xl text-gray-500 hover:text-gray-800 disabled:opacity-30 focus:outline-none"
          >
            <BiChevronRight />
          </button>
        </section>
        {showModal && (
          <CategoryImagesTable
            closeModal={closeModal}
            tableCategoryName={categoryName}
          />
        )}
      </div>
    </>
  );
};

Card.propTypes = {
  refreshCategories: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  title: PropTypes.string,
  description: PropTypes.string,
  categoryName: PropTypes.string.isRequired, // Add this line
  postDate: PropTypes.string.isRequired,
}

CategoryImagesCards.propTypes = {
    categoryName: PropTypes.string.isRequired,
};

export default CategoryImagesCards;