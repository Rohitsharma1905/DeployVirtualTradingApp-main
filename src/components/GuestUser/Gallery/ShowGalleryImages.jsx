import React, { useState, useEffect } from "react";
import { FolderOpen, Images, Search } from "lucide-react";
import axios from "axios";
import { Listbox } from "@headlessui/react";
import { ChevronDown } from "lucide-react";
import { BASE_API_URL } from "../../../utils/BaseUrl";
import CategoryImagesCards from "./CategoryImagesCards";
import { motion } from "framer-motion";

const capitalizeWords = (str) => {
  return str.split(" ").map(word => 
    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  ).join(" ");
};


const ShowGalleryImages = () => {
  const [galleryCategories, setGalleryCategories] = useState([]);
  const [err, setErr] = useState("");
  const [search, setSearch] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const categories = [
    { name: 'All Categories', value: 'all' },
    ...galleryCategories.map(c => ({ name: capitalizeWords(c.name), value: c.name }))
  ]
  const selectedCategory = categories.find(cat => cat.value === search)
  

  const fetchGalleryCategories = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${BASE_API_URL}/admin/galleryCategory/getGalleryCategories/name/increasing`
      );
      setGalleryCategories(response.data.categoryData);
      setErr("");
    } catch (error) {
      setErr(error.response?.data?.message || "Failed to load gallery categories");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGalleryCategories();
  }, []);

  

  return (
    <div className="space-y-10 relative z-30">
{/* Enhanced Gallery Controls */}
<motion.div 
  initial={{ opacity: 0, y: -20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
  className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 border border-gray-100 relative z-30 "
>
  <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">

    {/* Left: Title & Description */}
    <div className="flex items-center space-x-4">
      <div className="p-3 bg-lightBlue-600 rounded-xl shadow-md">
        <Images className="text-white" size={24} />
      </div>
      <div>
        <h2 className="text-xl md:text-2xl font-bold text-gray-800">Gallery Collections</h2>
        <p className="text-gray-500 text-sm">Browse through our visual archives</p>
      </div>
    </div>

    {/* Right: Filter Dropdown */}
    <div className="relative w-full md:w-64">
  {/* <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
    <Search className="text-gray-400" size={18} />
  </div> */}
   <Listbox value={search} onChange={setSearch}>
      <div className="relative w-full md:w-64">
        <Listbox.Button className="w-full pl-6 pr-10 py-2.5 border border-gray-200 rounded-lg bg-white text-gray-700 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-lightBlue-600 focus:border-lightBlue-600 transition-all relative text-left">
          {selectedCategory?.name || 'Select'}
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </span>
        </Listbox.Button>

        <Listbox.Options className="absolute z-50 mt-1 w-full max-h-60 overflow-auto bg-white py-1 text-sm  border-gray-200 rounded-xl  overflow-y-auto shadow-lg focus:outline-none">
          {categories.map((cat, index) => (
            <Listbox.Option
              key={index}
              value={cat.value}
              className={({ active }) =>
                `cursor-pointer select-none px-4 py-1  ${
                  active ? 'bg-lightBlue-600 text-white' : 'text-gray-700'
                }`
              }
            >
              {cat.name}
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </div>
    </Listbox>
</div>


  </div>
</motion.div>



      {/* Enhanced Content Area */}
      {isLoading ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-center items-center h-96"
        >
          <div className="flex flex-col items-center space-y-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              className="w-14 h-14 border-4 border-lightBlue-500 border-t-transparent rounded-full"
            />
            <p className="text-gray-500 font-medium">Loading visual treasures...</p>
          </div>
        </motion.div>
      ) : err ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-3xl shadow-lg p-10 text-center border border-gray-100"
        >
          <div className="mx-auto w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-6">
            <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <h3 className="text-2xl font-semibold text-gray-900 mb-3">Visual Journey Interrupted</h3>
          <p className="text-gray-500 mb-8 text-lg">{err}</p>
          <motion.button
            onClick={fetchGalleryCategories}
            className="px-8 py-3 bg-lightBlue-600 text-white rounded-xl hover:shadow-lg transition-all text-lg font-medium"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            Reload Gallery
          </motion.button>
        </motion.div>
      ) : galleryCategories.length > 0 ? (
        search === "all" ? (
          <motion.div 
            className="space-y-14"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {galleryCategories.map((data, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <CategoryImagesCards 
                  categoryName={data.name} 
                />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <CategoryImagesCards 
              categoryName={search} 
            />
          </motion.div>
        )
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-3xl shadow-lg p-10 text-center border border-gray-100"
        >
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
            <FolderOpen className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-2xl font-semibold text-gray-900 mb-3">Gallery Awaits Your Moments</h3>
          <p className="text-gray-500 text-lg">No visual stories have been captured yet.</p>
        </motion.div>
      )}
    </div>
  );
};

export default ShowGalleryImages;