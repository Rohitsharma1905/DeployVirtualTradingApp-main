import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import axios from "axios";
import { BASE_API_URL } from "../../../utils/BaseUrl";

import { Filter, Edit, Trash2, Info, ChevronLeft, ChevronRight} from "lucide-react";
import { FaTimes } from "react-icons/fa";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolderOpen } from '@fortawesome/free-solid-svg-icons';
import { FolderOpen, PlusCircle } from "lucide-react";
import { IoIosArrowUp } from "react-icons/io";
import { toast } from 'react-hot-toast';
// import { confirmAlert } from "react-confirm-alert";
// import "react-confirm-alert/src/react-confirm-alert.css";
import ConfirmationModal from "../Modals/ConformationModal";

import AddGalleryCategory from './AddGalleryCategory';
import UpdateGalleryCategory from "./UpdateGalleryCategory";
import CategoryImagesTable from "./CategoryImagesTable";

//Update and Delete Cards should Open by this, but...
// const Tooltip = ({ children, text }) => (
//   <div className="relative group">
//     {children}
//     <div className="absolute z-10 invisible group-hover:visible bg-gray-800 text-white text-xs rounded py-1 px-2 -top-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
//       {text}
//     </div>
//   </div>
// );

const ShowGalleryCategories = ({ sidebarExpanded }) => {

  const [isOpenCategoryForm, setIsOpenCategoryForm] = useState(false);
  const openAddCategoryModal = () => setIsOpenCategoryForm(true);
  const closeAddCategoryModal = () => setIsOpenCategoryForm(false);

  const [isOpenImageTable, setIsOpenImageTable] = useState(false);
  const [imgTableCategoryName, setImgTableCategoryName] = useState("")
  const openImageTable = (name) => {setImgTableCategoryName(name); setIsOpenImageTable(true);}
  const closeImageTable = () => setIsOpenImageTable(false);

  const [showFilters, setShowFilters] = useState(false);
  const [filterCount, setFilterCount] = useState(0);
  const [appliedFilters, setAppliedFilters] = useState({});

  const [galleryCategories, setGalleryCategories] = useState([]);

  const [err, setErr] = useState("");

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("createdDate");
  const [order, setOrder] = useState("decreasing");

  // useEffect(() => {
  //   if (currentPage > totalPages) {
  //     setCurrentPage(totalPages || 1); // Reset to page 1 when total pages decrease
  //   }
  // }, [totalPages]);

  useEffect(() => {
  if (err) {
    setShowFilters(false);
    setFilterCount(0);
  }
  }, [err]);

  useEffect(() => {
    let count = 0;
    let filters = {};

    if (search.trim() !== "") {
      count++;
      filters["Search"] = search;
    }
    if (sortBy !== "createdDate") {
      count++;
      if(sortBy==="name")
        filters["Sort By"] = "Name"
      else if (sortBy==="createdDate")
        filters["Sort By"] = "Date Created"
      else if (sortBy==="updatedDate")
        filters["Sort By"] = "Date Modified"
      else if (sortBy==="noOfItems")
        filters["Sort By"] = "Number of Images"
    }
    if (order !== "decreasing") {
      count++;
      filters["Order"] = order==="increasing" ? "Ascending" : "Descending";
    }
    setFilterCount(count);
    setAppliedFilters(filters);
  }, [search, sortBy, order]);

  const removeFilter = (key) => {
    setAppliedFilters((prev) => {
      const updatedFilters = { ...prev };
      delete updatedFilters[key]; 
      return updatedFilters; 
    });
    setFilterCount((prev) => Math.max(prev - 1, 0)); 

    // Reset the corresponding state variable
    switch (key) {
      case "SortBy":
        setSortBy("createdDate");
        break;
      case "Order":
        setOrder("decreasing");
        break;
      case "Search":
        setSearch("")
        break;
      default:
        break;
    }
  };

  const clearAllFilters = () => {
    setAppliedFilters({});  // Reset all filters
    setSearch("")
    setSortBy("createdDate")
    setOrder("decreasing")
    setFilterCount(0);  // Reset filter count
  };

  const fetchGalleryCategories = async () => {
    try {
      const searchQuery = search.trim() === "" ? "all" : search;
      const response = await axios.get(
        `${BASE_API_URL}/admin/galleryCategory/getGalleryCategories/${searchQuery}/${sortBy}/${order}`
      );
      console.log("Gallery Categories: ", response.data);

      // if(response?.status === 201||response?.status === 200)
        setGalleryCategories(response.data.categoryData);
      
    } 
    catch (error) {
      if (error.response) {
        setErr(error.response?.data?.message);
      }
      else{
        setErr("Something went wrong. Please try again.")
      }
      throw error; 
    }
  };

  const refreshCategories = () => {
    fetchGalleryCategories(); // Re-fetch categories to get the updated list
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        fetchGalleryCategories()
        setErr("");
      } 
      catch (error) {
        setErr(error.response?.data?.message || "Something went wrong.");
      }
    };
    fetchData();
  }, [sortBy, order, search]);

  // const handleDeleteCategory = async (id) => {
  //   confirmAlert({
  //     title: "Confirm Deletion",
  //     message: "Are you sure you want to delete this category?",
  //     buttons: [
  //       {
  //         label: "Confirm",
  //         onClick: async () => {
  //           try {
  //             const response = await axios.patch(
  //               `${BASE_API_URL}/admin/galleryCategory/deleteGalleryCategory/${id}`
  //             );
  
  //             console.log("Delete Gallery Category Response: ", response);
  
  //             if (response.status === 201) {
  //               toast.success("Category deleted successfully!");
  //               refreshCategories();
  //             } 
  //             else {
  //               toast.warning("Unsuccessful. Please try again.");
  //             }
  //           } 
  //           catch (error) {
  //             console.error("Error deleting category:", error);
  //             toast.error("Error deleting category. Please try again.");
  //           }
  //         },
  //       },
  //       {
  //         label: "Cancel",
  //         onClick: () => {
  //           toast.info("Deletion cancelled.");
  //         },
  //       },
  //     ],
  //   });
  // };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteName, setDeleteName] = useState("")

  const handleDeleteCategory = (id, name) => {
    setDeleteId(id);  
    setDeleteName(name)
    setIsModalOpen(true); 
  };
  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      const response = await axios.patch(
        `${BASE_API_URL}/admin/galleryCategory/deleteGalleryCategory/${deleteId}`
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

  const [isOpenCategoryUpdate, setIsOpenCategoryUpdate] = useState(false);
  const openUpdateCategoryModal = () => setIsOpenCategoryUpdate(true);
  const closeUpdateCategoryModal = () => setIsOpenCategoryUpdate(false);
  const [updateId, setUpdateId] = useState(null)
  const [updateName, setUpdateName] = useState("")

  const handleUpdateCategory = (id,name) => {
    setUpdateId(id)
    setUpdateName(name)
    openUpdateCategoryModal()
  }

  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  // Calculate total pages
  const totalPages = Math.ceil(galleryCategories.length / rowsPerPage);

  // Get current page data
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = galleryCategories.slice(indexOfFirstRow, indexOfLastRow);

  return (
    <>
    {/* ${sidebarExpanded ? 'mt-138' : 'mt-98'}  */}
    <div className={`
      relative z-20 flex items-center justify-center bg-transparent pb-0 pointer-events-none
    `}>
      <div className={`
        ${sidebarExpanded ? 'left-1 w-[94%]' : 'left-0 w-[95%]'}
        -mt-12 relative bg-white pl-1 pr-1 pt-0 rounded-lg h-[72vh] flex flex-col shadow-lg pointer-events-auto
      `}>
        <div className="sticky top-0 bg-white left-0 w-full border-b border-gray-100 p-4 mt-1">
          {/* Top Header */}
{/* Top Header */}
<div className="flex sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
  {/* Left Side (Icon + Heading) */}
  <div className="flex items-center gap-3">
    <FontAwesomeIcon icon={faFolderOpen} className="text-gray-500 text-[21px]" />
    <h2 className="text-xl font-bold text-gray-800">Gallery Categories</h2>
  </div>
{/* Right Side - All in one row */}
<div className="flex items-center gap-4 w-full lg:w-auto">
  {/* Total Categories */}
  <h6 className="text-base font-semibold text-gray-400 whitespace-nowrap">
    Total Categories: {galleryCategories.length}
  </h6>

  {/* Filter Button */}
  <button
    onClick={() => setShowFilters(!showFilters)}
    className={`relative flex items-center justify-between gap-2 px-3 py-2 h-[40px] border rounded-lg focus:outline-none transition-all
      ${showFilters ? "shadow-[0_0_7px_1px_rgba(59,130,246,0.5)] border-blue-300" : "shadow-md border-gray-300"}
      hover:shadow-[0_0_7px_1px_rgba(59,130,246,0.7)] hover:border-blue-400
    `}
  >
    <div className="relative">
      <Filter className="text-gray-500 text-xl hover:text-gray-700" />
      {filterCount > 0 && (
        <span className="absolute -top-1 -right-3 bg-lightBlue-600 text-white px-2 py-[2px] rounded-full text-xs">
          {filterCount}
        </span>
      )}
    </div>
    <IoIosArrowUp
      className={`text-gray-500 text-lg transition-transform duration-200 ${
        showFilters ? "rotate-0" : "rotate-180"
      }`}
    />
  </button>

  {/* Search Bar */}
  <div className="relative w-[230px]">
    <img
      src="https://cdn-icons-png.flaticon.com/512/622/622669.png"
      alt="search"
      className="absolute left-3 top-1/4 transform -translate-y-1/2 w-4 h-4"
    />
    <input
      type="text"
      placeholder="Search..."
      value={search}
      onChange={(e) => setSearch(e.target.value || "")}
      className="border border-gray-400 pl-10 pr-4 py-2 rounded-lg w-full h-[36px] focus:outline-none focus:shadow-md focus:border-black"
    />
  </div>

  {/* Add Category Button */}
  <button
    onClick={openAddCategoryModal}
    className="h-[2.35rem] px-5 bg-lightBlue-600 text-white rounded-lg hover:bg-lightBlue-700 transition-colors flex items-center justify-center whitespace-nowrap"
  >
    <PlusCircle size={18} className="mr-2" />
    <span className="font-medium">Add Category</span>
  </button>
</div>



</div>



          {/* Filters Section (Visible only when showFilters is true) */}
          {!err && showFilters && (
            <div className="flex justify-end items-center mt-5">
              <div className="flex gap-4 mr-auto">

                {/* Sort By Select */}
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-600 mb-1">
                    SortBy
                  </label>
                  <div className="relative">
                    <select
                      name="sortBy"
                      className="border rounded-lg px-5 py-[6px] text-sm appearance-none w-38 pr-8"
                      value={sortBy}
                      onChange={(e) =>
                        setSortBy(e.target.value || "createdDate")
                      }
                    >
                      <option disabled>SortBy</option>
                      <option value="name">Name</option>
                      <option value="updatedDate">Date Modified</option>
                      <option value="createdDate">Date Created</option>
                      <option value="noOfItems">Number of Images</option>
                    </select>
                  </div>
                </div>

                {/* Order Select */}
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-600 mb-1">
                    Order
                  </label>
                  <div className="relative">
                    <select
                      name="Order"
                      className="border rounded-lg px-5 py-[6px] text-sm appearance-none w-38 pr-8"
                      value={order}
                      onChange={(e) => setOrder(e.target.value || "decreasing")}
                    >
                      <option disabled>Order</option>
                      <option value="increasing">Ascending</option>
                      <option value="decreasing">Descending</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {filterCount > 0 && (
            <div className="mt-2 -mb-1 -ml-1 -mr-1 p-2 bg-gray-100 rounded-lg shadow-md flex justify-between items-center">
              <div className="flex flex-wrap gap-2 flex items-center">
                {Object.entries(appliedFilters).map(([key, value]) => (
                  <span
                    key={key}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold"
                  >
                    {key}: {value}
                    <button
                      onClick={() => removeFilter(key)}
                      className="ml-6 mr-1 mt-1 focus:outline-none bg-transparent"
                    >
                      <FaTimes className="text-blue-300 hover:text-blue-800 text-sm" />
                    </button>
                  </span>
                ))}
              </div>
              <button
                onClick={clearAllFilters}
                className="flex items-center gap-2 px-4 py-[6px] bg-gray-200 text-gray-700 text-sm font-semibold rounded-full transition-all duration-200 hover:bg-gray-500 hover:text-white shadow-sm"
              >
              Clear All &nbsp;&nbsp;&nbsp;<FaTimes className="text-gray-500 hover:text-gray-700 text-base" />
              </button>
            </div>
          )}
        </div>

        {/* {err && <p className="text-red-500">{err}</p>} */}

        {/* List of Categories */}
        <div  className={`flex 
        ${
          showFilters
          ? filterCount > 0 ? "h-[39vh]" : "h-[47vh]"
          : filterCount > 0 ? "h-[50vh]" : "h-[59vh]"
        }`}>
          <div className={`inset-0 ${galleryCategories.length > 0 ? 'overflow-y-auto': ''} w-full max-h-[500px] rounded-lg`}>
            <table className={`inset-0 min-w-full table-fixed ${galleryCategories.length > 0 ? 'divide-y' : ''} divide-gray-200 border-collapse bg-white`}>
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Categories Name
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Number of Images
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Create Date
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Update Date
                  </th>
                  {/* <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created By
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Updated By
                  </th> */}
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    &nbsp;Actions
                  </th>
                </tr>
              </thead>

              {err && (
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                <td colSpan="5">
                  <div className="mt-9 ml-15 flex justify-center items-center min-h-[180px]">
                  <div className="flex flex-col items-center justify-center w-96 bg-gray-100 rounded-lg shadow-lg p-6">
                    <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full">
                      <i className="fas fa-exclamation-triangle text-red-500 text-3xl"></i>
                    </div>
                    <b className="text-lg text-gray-800 mt-4">Oops! Something went wrong.</b>
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
                </td>
                </tr>
              </tbody>
              )}

              <tbody className={`bg-white ${galleryCategories.length > 0 ? 'divide-y' : ''} divide-gray-200`}>
                {galleryCategories.length > 0 ? (
                  currentRows.map((data, index) => {
                    return (
                      <tr
                        key={index}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="cursor-pointer px-5 py-4 whitespace-nowrap min-w-[100px] text-sm font-medium text-gray-900"
                        onClick={() => openImageTable(data.name)}>
                          {
                            data.name.split(" ")
                              .map(
                                (word) =>
                                  word.charAt(0).toUpperCase() +
                                  word.slice(1).toLowerCase()
                              )
                              .join(" ")
                          }
                        </td>

                        <td className="pl-18 px-5 py-4 whitespace-nowrap text-sm text-gray-500 min-w-[90px]">
                          N/A
                        </td>

                        <td className="px-5 py-4 whitespace-nowrap min-w-[100px] text-sm text-gray-500">
                        &nbsp;&nbsp;
                          {new Date(
                            data.createdDate
                          ).toLocaleDateString()}
                        </td>

                        <td className="pl-10 px-5 py-4 whitespace-nowrap min-w-[100px] text-sm text-gray-500">
                        {/* &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; */}
                          {data.updatedDate
                            ? <span className="ml-2">{new Date(data.updatedDate).toLocaleDateString()}</span>
                            : <span className="ml-6 text-gray-400">N/A</span>
                          }
                        </td>

                        <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-500">
                     {/* <Tooltip text="Edit organization"> */}
                            <button
                              onClick={() => handleUpdateCategory(data._id, data.name)}
                              className="mr-4 text-yellow-600 mx-2 hover:text-yellow-900 transition-colors focus:outline-none"
                            >
                              <Edit size={18} />
                            </button>
                      {/* </Tooltip> */}

                      {/* <Tooltip text="Edit organization"> */}
                            {/* <button
                              onClick={() => openImageTable(data.name)}
                              className="mr-3 text-lightBlue-600 mx-2 hover:text-blue-900 transition-colors focus:outline-none"
                            >
                              <Info size={18} />
                            </button> */}
                      {/* </Tooltip> */}
                          
                      {/* <Tooltip text="Delete organization"> */}
                            <button
                              onClick={() => handleDeleteCategory(data._id, data.name)}
                              className="text-red-600 hover:text-red-900 transition-colors focus:outline-none"
                            >
                              <Trash2 size={18} />
                            </button>
                      {/* </Tooltip> */}
                        </td>

                      </tr>
                    );
                  })
                ) : (!err &&
                  <tr>
                  <td colSpan="5"
                  className="p-6 text-center text-gray-500 text-base font-medium bg-gray-50 rounded-md mt-4"
                  >
                    <div className={`${showFilters
                                        ? filterCount > 0 ? "pt-11 pb-12" : "pt-18 pb-19"
                                        : filterCount > 0 ? "pt-18 pb-24" : "pt-25 pb-30"
                                      }
                                    flex flex-col items-center space-y-2`}
                    >
                    <FolderOpen className="w-10 h-10 text-gray-400" /> 
                    <span>No feedbacks available.</span>
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

    {/* <div>
      <button
        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        disabled={currentPage === 1}
      > Prev </button>
      <span> Page {currentPage} of {totalPages} </span>
      <button
        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
        disabled={currentPage === totalPages}
      > Next </button>
    </div> */}

    <div className="flex justify-between items-center mt-1 -mb-1 px-4 py-3">
      <div className="flex items-center space-x-4">
        <label className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-700 pl-7">Rows per page:</span>
          <select
            value={rowsPerPage}
            onChange={(e) => setRowsPerPage(Number(e.target.value))}
            className="form-select px-5 py-1 rounded-md border-gray-300 shadow-sm 
                    focus:border-lightBlue-500 focus:ring focus:ring-lightBlue-200 
                    focus:ring-opacity-50 text-sm "
          >
            {[ 10, 50, 100, 200].map((num) => (
              <option key={num} value={num} className="text-gray-700">
                {num}
              </option>
            ))}
          </select>
        </label>

        <div className="hidden sm:block text-sm text-gray-700">
          <span className="font-semibold">{indexOfFirstRow + 1}</span> -{" "}
          <span className="font-semibold">
            {Math.min(indexOfLastRow, galleryCategories.length)}
          </span>{" "}
          of <span className="font-semibold">{galleryCategories.length}</span>
        </div>
      </div>

      <div className="flex items-center space-x-1 mr-2">
        <button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 rounded-md bg-gray-100 text-gray-700 
                  disabled:opacity-50 disabled:cursor-not-allowed
                  hover:bg-gray-200 transition-colors duration-150"
        >
          <ChevronLeft size={16} />
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1)
          .filter((page) => {
            if (totalPages <= 5) return true;
            if (page === 1 || page === totalPages) return true;
            return Math.abs(page - currentPage) <= 1;
          })
          .map((page, i, arr) => (
            <React.Fragment key={page}>
              {i > 0 && arr[i - 1] !== page - 1 && (
                <span className="px-2 text-gray-500">...</span>
              )}
              
              <button
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 rounded-md transition-colors duration-150
                  ${
                    currentPage === page
                      ? "bg-lightBlue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
              >
                {page}
              </button>
            </React.Fragment>
          ))}

        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 rounded-md bg-gray-100 text-gray-700 
                  disabled:opacity-50 disabled:cursor-not-allowed
                  hover:bg-gray-200 transition-colors duration-150"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>

    {isOpenCategoryForm && <AddGalleryCategory closeModal={closeAddCategoryModal} refreshCategories={refreshCategories}/>}

    {isOpenCategoryUpdate && <UpdateGalleryCategory closeModal={closeUpdateCategoryModal} refreshCategories={refreshCategories} updateId={updateId} updateName={updateName}/>}

    {isOpenImageTable && <CategoryImagesTable closeModal={closeImageTable} tableCategoryName={imgTableCategoryName}/>}

    {/* Confirmation Modal */}
    <ConfirmationModal
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      onConfirm={confirmDelete}
      title="Confirm Deletion"
      message={`Are you sure you want to delete category - ${deleteName}?`}
    />

    </>
  );
};

ShowGalleryCategories.propTypes = {
  sidebarExpanded: PropTypes.bool.isRequired,
}

export default ShowGalleryCategories;