import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import { FolderOpen, Images, PlusCircle, Search } from "lucide-react";
import axios from "axios";
import { BASE_API_URL } from "../../../utils/BaseUrl";
import { Listbox, Transition } from '@headlessui/react';
import { ChevronsUpDown } from 'lucide-react';

import AddGalleryImage from './AddGalleryImage';
import CategoryImagesCards from "./CategoryImagesCards";

const ShowGalleryImages = ({ sidebarExpanded }) => {
  const [isOpenItemForm, setIsOpenItemForm] = useState(false);
  const openAddItemModal = () => setIsOpenItemForm(true);
  const closeAddItemModal = () => setIsOpenItemForm(false);

  const [galleryCategories, setGalleryCategories] = useState([]);
  const [err, setErr] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  const fetchGalleryCategories = async () => {
    try {
      const response = await axios.get(
        `${BASE_API_URL}/admin/galleryCategory/getGalleryCategories/name/increasing`
      );
      setGalleryCategories(response.data.categoryData);
    } catch (error) {
      if (error.response) {
        setErr(error.response?.data?.message);
      } else {
        setErr("Something went wrong. Please try again.");
      }
      throw error;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchGalleryCategories();
        setErr("");
      } catch (error) {
        setErr(error.response?.data?.message || "Something went wrong.");
      }
    };
    fetchData();
  }, []);

  return (
    <>
      {/* Desktop Header */}
      <nav className={`-mt-10 z-10 border border-gray-100 hidden md:flex items-center justify-between p-4 bg-white shadow-lg rounded-lg
                        ${sidebarExpanded ? 'ml-[22px] -mr-2' : 'ml-[22px] -mr-2'}
                    `} style={{ width: sidebarExpanded ? "95%" : "96%" }}>
        {/* Left Side (1 Column) */}
        <div className="w-1/5 flex items-center space-x-2">
          <Images className="w-7 h-[1.625rem] font-medium text-gray-600 pr-[3px]" />
          <h2 className="text-xl font-bold text-gray-800">Gallery Images</h2>
        </div>

        {/* Right Side (4 Columns) */}
        <div className="w-4/5 flex justify-end space-x-8">
          <div className="flex space-x-4">
            <div className="relative w-[270px]">
              <Listbox value={selectedCategory} onChange={setSelectedCategory}>
                <div className="relative">
                  <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left border border-gray-400 focus:outline-none focus:border-black focus:shadow-md sm:text-sm h-[39px]">
                    <span className="block truncate">
                      {selectedCategory === "all" ? "All Categories" : selectedCategory}
                    </span>
                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                      <ChevronsUpDown className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </span>
                  </Listbox.Button>
                  <Transition
                    as={React.Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <Listbox.Options className="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                      <Listbox.Option
                        key="all"
                        className={({ active }) =>
                          `relative cursor-default select-none py-2 pl-10 pr-4 ${
                            active ? 'bg-lightBlue-100 text-lightBlue-900' : 'text-gray-900'
                          }`
                        }
                        value="all"
                      >
                        All Categories
                      </Listbox.Option>
                      {galleryCategories.map((category) => (
                        <Listbox.Option
                          key={category._id}
                          className={({ active }) =>
                            `relative cursor-default select-none py-2 pl-10 pr-4 ${
                              active ? 'bg-lightBlue-100 text-lightBlue-900' : 'text-gray-900'
                            }`
                          }
                          value={category.name}
                        >
                          {category.name}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </Transition>
                </div>
              </Listbox>
            </div>
            
            <div className="relative w-[270px]">
              <img
                src="https://cdn-icons-png.flaticon.com/512/622/622669.png"
                alt="search"
                className="absolute left-3 top-1/4 transform -translate-y-1/2 w-4 h-4"
              />
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value||"")}
                className="border border-gray-400 pl-10 pr-0 py-2 rounded-lg w-full h-[39px] focus:outline-none focus:shadow-md focus:border-black"
              />
            </div>
          </div>

          <button
            onClick={openAddItemModal}
            className="mr-3 h-[2.35rem] px-4 bg-lightBlue-600 text-white rounded-lg 
            hover:bg-lightBlue-700 transition-colors flex items-center"
          >
            <PlusCircle size={18} className="mr-2" />
            <span className="font-medium">Add Image</span>
          </button>
        </div>
      </nav>

      {/* Mobile Header */}
      <nav className={`-mt-10 z-10 border border-gray-100 flex md:hidden flex-col items-stretch p-4 bg-white shadow-lg rounded-lg
                        ${sidebarExpanded ? 'ml-[22px] -mr-2' : 'ml-[22px] -mr-2'}
                    `} style={{ width: sidebarExpanded ? "95%" : "96%" }}>
        {/* Title and Search Toggle */}
        <div className="flex items-center justify-between w-full mb-4">
          <div className="flex items-center space-x-2">
            <Images className="w-7 h-[1.625rem] font-medium text-gray-600 pr-[3px]" />
            <h2 className="text-xl font-bold text-gray-800">Gallery Images</h2>
          </div>
          <button 
            className="p-2 text-gray-500 hover:text-gray-700"
            onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
          >
            <Search className="w-5 h-5" />
          </button>
        </div>

        {/* Search and Filter Section */}
        <div className={`${isMobileSearchOpen ? 'block' : 'hidden'} w-full`}>
          <div className="flex flex-col space-y-4">
            <div className="relative w-full">
              <Listbox value={selectedCategory} onChange={setSelectedCategory}>
                <div className="relative">
                  <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left border border-gray-400 focus:outline-none focus:border-black focus:shadow-md sm:text-sm h-[39px]">
                    <span className="block truncate">
                      {selectedCategory === "all" ? "All Categories" : selectedCategory}
                    </span>
                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                      <ChevronsUpDown className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </span>
                  </Listbox.Button>
                  <Transition
                    as={React.Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <Listbox.Options className="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                      <Listbox.Option
                        key="all"
                        className={({ active }) =>
                          `relative cursor-default select-none py-2 pl-10 pr-4 ${
                            active ? 'bg-lightBlue-100 text-lightBlue-900' : 'text-gray-900'
                          }`
                        }
                        value="all"
                      >
                        All Categories
                      </Listbox.Option>
                      {galleryCategories.map((category) => (
                        <Listbox.Option
                          key={category._id}
                          className={({ active }) =>
                            `relative cursor-default select-none py-2 pl-10 pr-4 ${
                              active ? 'bg-lightBlue-100 text-lightBlue-900' : 'text-gray-900'
                            }`
                          }
                          value={category.name}
                        >
                          {category.name}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </Transition>
                </div>
              </Listbox>
            </div>
            
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value||"")}
                className="block w-full pl-10 pr-3 py-2 border border-gray-400 rounded-lg focus:outline-none focus:shadow-md focus:border-black h-[39px]"
              />
            </div>

            <button
              onClick={openAddItemModal}
              className="w-full h-[2.35rem] px-4 bg-lightBlue-600 text-white rounded-lg 
              hover:bg-lightBlue-700 transition-colors flex items-center justify-center"
            >
              <PlusCircle size={18} className="mr-2" />
              <span className="font-medium">Add Image</span>
            </button>
          </div>
        </div>
      </nav>

      {err ? (
        <div className="flex items-center justify-center h-[80vh] w-full">
          <div className="flex flex-col items-center justify-center bg-gray-100 rounded-lg shadow-md p-6 max-w-md">
            <span className="text-red-500 text-4xl mb-2">
              <i className="fas fa-exclamation-circle"></i>
            </span>
            <b className="text-lg text-gray-700 mb-1">Error Loading Content</b>
            <h4 className="text-gray-500 text-sm mb-1">No content available</h4>
            <p className="text-red-500 text-sm text-center">{err}</p>
          </div>
        </div>
      ) : galleryCategories.length > 0 ? (
            selectedCategory === "all" ? (
              galleryCategories.map((data, index) => (
                <div key={index}>
                  <CategoryImagesCards categoryName={data.name}/>
                </div>
              ))
            ) : (
                  <CategoryImagesCards categoryName={selectedCategory}/>
                )
          ) : (
              <div className="flex items-center justify-center h-[80vh] w-full">
                <div className="flex flex-col items-center space-y-2 text-center">
                  <FolderOpen className="w-16 h-16 text-gray-400" />
                  <h4 className="text-gray-500 text-sm">
                    No Categories available in Gallery.
                  </h4>
                </div>
              </div>
              )
        }

      {isOpenItemForm && <AddGalleryImage closeModal={closeAddItemModal}/>}
    </>
  );
};

ShowGalleryImages.propTypes = {
  sidebarExpanded: PropTypes.bool.isRequired,
};

export default ShowGalleryImages;