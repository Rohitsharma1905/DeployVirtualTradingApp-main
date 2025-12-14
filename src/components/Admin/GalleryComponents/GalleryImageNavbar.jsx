import React, {useState} from 'react'
import PropTypes from 'prop-types';
import { Images, PlusCircle } from "lucide-react";
// import { Menu } from "lucide-react";
import AddGalleryImage from './AddGalleryImage';
// import { FaTimes } from "react-icons/fa";

const GalleryImageNavbar = ({ sidebarExpanded }) => {

  // const [isOpen, setIsOpen] = useState(false);
  const [isOpenItemForm, setIsOpenItemForm] = useState(false);

  const openAddItemModal = () => setIsOpenItemForm(true);
  const closeAddItemModal = () => setIsOpenItemForm(false);

  return (
    <>
    <nav className={`-mt-10 z-10 flex items-center justify-between p-4 bg-white shadow-lg rounded-lg
                      ${sidebarExpanded ? 'ml-[22px] -mr-2' : 'ml-[22px] -mr-2'}
                  `} style={{ width: sidebarExpanded ? "95%" : "96%"}}> 
                  {/* backgroundColor:"#eceef0" */}
      {/* Left Side (1 Column) */}
      <div className="w-1/5 flex items-center space-x-2">
        <Images className="w-7 h-[1.625rem] font-medium text-gray-600 pr-[3px]" />
        <h2 className="text-xl font-bold text-gray-800">Gallery Images</h2>
      </div>

      {/* Right Side (4 Columns) */}
      <div className="w-4/5 flex justify-end space-x-8">
        <div className="relative w-[270px]">
          <img
          src="https://cdn-icons-png.flaticon.com/512/622/622669.png"
          alt="search"
          className="absolute left-3 top-1/4 transform -translate-y-1/2 w-4 h-4"
          />
          <input
            type="text"
            placeholder="Search..."
            className="border border-gray-400 pl-10 pr-2 py-2 rounded-lg w-full h-[39px] focus:outline-none focus:shadow-md focus:border-black"
          />
        </div>

        <button
          onClick={openAddItemModal}
          className="mr-3 h-[2.35rem] px-4 bg-lightBlue-600 text-white rounded-lg 
          hover:bg-lightBlue-700 transition-colors flex items-center"
        >
        <PlusCircle size={18} className="mr-2" />
        <span className="font-medium">Add Image</span>
        </button>

        {/* <button onClick={() => setIsOpen(!isOpen)} className="p-2">
          <Menu className="w-5 h-5 text-gray-800" />
        </button>
        {isOpen && (
          <div className="absolute right-4 mt-8 w-46 bg-white shadow-md rounded-lg overflow-hidden" onClick={() => setIsOpen(false)}>
            <div className='bg-gray-400'>
            <button onClick={() => setIsOpen(false)} className="ml-38 mt-2 mb-1 mr-0 bg-gray-400 rounded-md focus:outline-none">
              <FaTimes className="text-gray-100 hover:text-gray-900 text-lg scale-x-123" />
            </button>
            </div>
            <ul className="text-gray-800">
              <li className="px-2 py-2 hover:bg-gray-300 cursor-pointer">
                <button className='focus:outline-none'>Show Categories</button>
              </li>
              <li className="px-2 py-2 hover:bg-gray-300 cursor-pointer">Select Items</li>
              <li className="px-2 py-2 hover:bg-gray-300 cursor-pointer">Delete Items</li>
              <li className="px-2 py-2 hover:bg-gray-300 cursor-pointer">Recycle Bin</li>
            </ul>
          </div>
        )} */}

      </div>
    </nav>
    {isOpenItemForm && <AddGalleryImage closeModal={closeAddItemModal}/>}
    </>
  )
}

GalleryImageNavbar.propTypes = {
  sidebarExpanded: PropTypes.bool.isRequired,
}

export default GalleryImageNavbar
