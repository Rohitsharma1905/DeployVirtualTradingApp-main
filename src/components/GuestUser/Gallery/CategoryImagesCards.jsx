// import React, { useState, useEffect } from "react";
// import PropTypes from "prop-types";
// import { 
//   FolderOpen, 
//   ChevronLeft, 
//   ChevronRight, 
//   Image as ImageIcon,
//   Clock,
//   Expand,
//   X
// } from "lucide-react";
// import axios from "axios";
// import { BASE_API_URL } from "../../../utils/BaseUrl";
// import { motion } from "framer-motion";
// import Modal from 'react-modal';

// Modal.setAppElement('#root');

// const ImageModal = ({ isOpen, onClose, image, title }) => {
//   return (
//     <Modal
//       isOpen={isOpen}
//       onRequestClose={onClose}
//       className="modal"
//       overlayClassName="fixed inset-0 bg-black/90 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
//       contentLabel="Image Modal"
//     >
//       <motion.div 
//         initial={{ opacity: 0, scale: 0.95 }}
//         animate={{ opacity: 1, scale: 1 }}
//         className="relative w-full max-w-4xl"
//       >
//         <button
//           onClick={onClose}
//           className="absolute -top-12 right-0 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-all duration-200 z-50"
//           aria-label="Close modal"
//         >
//           <X size={24} />
//         </button>
//         <div className="bg-white rounded-lg overflow-hidden shadow-2xl">
//           <img
//             src={image}
//             alt={title}
//             className="w-full max-h-[80vh] object-cover"
//           />
//           {title && (
//             <div className="p-4 bg-white border-t border-gray-100">
//               <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
//             </div>
//           )}
//         </div>
//       </motion.div>
//     </Modal>
//   );
// };

// const Card = ({ image, title, postDate, onClick }) => {
//   return (
//     <motion.div 
//       initial={{ opacity: 0, y: 10 }}
//       animate={{ opacity: 1, y: 0 }}
//       whileHover={{ 
//         y: -5,
//         transition: { duration: 0.2 }
//       }}
//       whileTap={{ scale: 0.98 }}
//       className="relative group cursor-pointer rounded-xl overflow-hidden shadow-md bg-white transition-all duration-300 hover:shadow-lg"
//       onClick={onClick}
//     >
//       <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
//         {image ? (
//           <motion.img
//             className="w-full h-full object-cover"
//             src={image}
//             alt={title}
//             loading="lazy"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ duration: 0.5 }}
//             whileHover={{ scale: 1.05 }}
//           />
//         ) : (
//           <div className="w-full h-full flex items-center justify-center text-gray-300">
//             <ImageIcon size={48} />
//           </div>
//         )}
        
//         <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
//           <motion.div 
//             className="translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//           >
//             <h3 className="font-semibold text-white text-lg line-clamp-2">
//               {title || "Untitled"}
//             </h3>
//             {postDate && (
//               <div className="flex items-center text-white/80 text-sm mt-2">
//                 <Clock className="mr-1.5" size={16} />
//                 <span>{new Date(postDate).toLocaleDateString()}</span>
//               </div>
//             )}
//           </motion.div>
//         </div>
        
//         <motion.div 
//           className="absolute top-3 right-3 p-2 bg-black/50 rounded-full text-white opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-black/60"
//           whileHover={{ scale: 1.1 }}
//         >
//           <Expand size={18} />
//         </motion.div>
//       </div>
//     </motion.div>
//   );
// };

// const CategoryImagesCards = ({ categoryName }) => {
//   const [galleryItems, setGalleryItems] = useState([]);
//   const [err, setErr] = useState("");
//   const [isLoading, setIsLoading] = useState(true);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [modalOpen, setModalOpen] = useState(false);
//   const [selectedImage, setSelectedImage] = useState(null);
  
//   const itemsPerPage = 3;

//   const fetchGalleryItems = async () => {
//     try {
//       setIsLoading(true);
//       const response = await axios.get(
//         `${BASE_API_URL}/admin/gallery/getGalleryItems/${categoryName}`
//       );
//       setGalleryItems(response.data.ImageData || []);
//       setErr("");
//     } catch (error) {
//       setErr(error.response?.data?.message || "Failed to load gallery items");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchGalleryItems();
//     setCurrentIndex(0);
//   }, [categoryName]);

//   const visibleItems = galleryItems.slice(currentIndex, currentIndex + itemsPerPage);
//   const totalPages = Math.ceil(galleryItems.length / itemsPerPage);
//   const currentPage = Math.floor(currentIndex / itemsPerPage) + 1;

//   const handleNext = () => {
//     if (currentIndex + itemsPerPage < galleryItems.length) {
//       setCurrentIndex(currentIndex + itemsPerPage);
//     }
//   };

//   const handlePrev = () => {
//     if (currentIndex > 0) {
//       setCurrentIndex(currentIndex - itemsPerPage);
//     }
//   };

//   const openModal = (image, title) => {
//     setSelectedImage({ image, title });
//     setModalOpen(true);
//   };

//   const closeModal = () => {
//     setModalOpen(false);
//     setSelectedImage(null);
//   };

//   const capitalizeWords = (str) => {
//     return str.split(" ").map(word => 
//       word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
//     ).join(" ");
//   };

//   return (
//     <motion.div 
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       className="bg-white -mt-10 rounded-2xl shadow-lg p-6 border border-gray-100 relative z-20"
//     >
//       <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
//         <div className="flex items-center space-x-4">
//           <div className="p-3 bg-lightBlue-100 rounded-lg">
//             <FolderOpen className="text-lightBlue-600" size={22} />
//           </div>
//           <div>
//             <h3 className="text-xl font-bold text-gray-800">
//               {capitalizeWords(categoryName)}
//             </h3>
//             <p className="text-gray-500 text-sm">
//               {galleryItems.length} {galleryItems.length === 1 ? 'memory' : 'memories'}
//             </p>
//           </div>
//         </div>
        
//         {galleryItems.length > 0 && (
//           <div className="flex items-center space-x-4">
//             <div className="text-sm text-gray-500 font-medium">
//               Page {currentPage} of {totalPages}
//             </div>
//             <div className="flex space-x-2">
//               <motion.button
//                 onClick={handlePrev}
//                 disabled={currentIndex === 0}
//                 className={`p-2 rounded-lg ${currentIndex === 0 ? 'bg-gray-100 text-gray-400' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
//                 whileTap={{ scale: 0.95 }}
//               >
//                 <ChevronLeft size={18} />
//               </motion.button>
//               <motion.button
//                 onClick={handleNext}
//                 disabled={currentIndex + itemsPerPage >= galleryItems.length}
//                 className={`p-2 rounded-lg ${currentIndex + itemsPerPage >= galleryItems.length ? 'bg-gray-100 text-gray-400' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
//                 whileTap={{ scale: 0.95 }}
//               >
//                 <ChevronRight size={18} />
//               </motion.button>
//             </div>
//           </div>
//         )}
//       </div>

//       {isLoading ? (
//         <div className="flex justify-center items-center h-64">
//           <motion.div
//             animate={{ rotate: 360 }}
//             transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
//             className="w-12 h-12 border-4 border-lightBlue-500 border-t-transparent rounded-full"
//           />
//         </div>
//       ) : err ? (
//         <div className="bg-red-50 rounded-xl p-6 text-center">
//           <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
//             <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
//             </svg>
//           </div>
//           <h3 className="text-lg font-medium text-gray-900 mb-2">Visual Story Unavailable</h3>
//           <p className="text-gray-500 mb-4">{err}</p>
//           <motion.button
//             onClick={fetchGalleryItems}
//             className="px-4 py-2 bg-lightBlue-600 text-white rounded-lg hover:shadow-md transition-all"
//             whileHover={{ y: -2 }}
//             whileTap={{ scale: 0.98 }}
//           >
//             Try Again
//           </motion.button>
//         </div>
//       ) : galleryItems.length > 0 ? (
//         <>
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//             {visibleItems.map((item, index) => (
//               <Card
//                 key={item._id || index}
//                 image={item.photo}
//                 title={item.title}
//                 postDate={item.updatedDate || item.createdDate}
//                 onClick={() => openModal(item.photo, item.title)}
//               />
//             ))}
//           </div>

//           <ImageModal
//             isOpen={modalOpen}
//             onClose={closeModal}
//             image={selectedImage?.image}
//             title={selectedImage?.title}
//           />
//         </>
//       ) : (
//         <div className="bg-gray-50 rounded-xl p-8 text-center">
//           <div className="mx-auto w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
//             <FolderOpen className="w-10 h-10 text-gray-400" />
//           </div>
//           <h3 className="text-lg font-medium text-gray-900 mb-2">No Visual Stories Yet</h3>
//           <p className="text-gray-500">This collection is waiting to be filled with memorable moments.</p>
//         </div>
//       )}
//     </motion.div>
//   );
// };

// CategoryImagesCards.propTypes = {
//   categoryName: PropTypes.string.isRequired,
// };

// export default CategoryImagesCards;



import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { 
  FolderOpen, 
  ChevronLeft, 
  ChevronRight, 
  Image as ImageIcon,
  Clock,
  Expand,
  X
} from "lucide-react";
import axios from "axios";
import { BASE_API_URL } from "../../../utils/BaseUrl";
import { motion } from "framer-motion";
import Modal from 'react-modal';

Modal.setAppElement('#root');

const ImageModal = ({ 
  isOpen, 
  onClose, 
  images, 
  currentIndex, 
  onNext, 
  onPrev 
}) => {
  const currentImage = images[currentIndex];
  
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="modal"
      overlayClassName="fixed inset-0 bg-black/90 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
      contentLabel="Image Modal"
    >
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative w-full max-w-4xl"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-all duration-200 z-50"
          aria-label="Close modal"
        >
          <X size={24} />
        </button>
        
        {/* Main Content */}
        <div className="bg-white rounded-lg overflow-hidden shadow-2xl flex flex-col">
          {/* Image */}
          <div className="relative bg-black">
            <img
              src={currentImage?.photo}
              alt={currentImage?.title}
              className="w-full max-h-[70vh] object-contain mx-auto"
            />
            
            {/* Navigation Arrows */}
            {images.length > 1 && (
              <>
                <motion.button
                  onClick={onPrev}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 rounded-full text-white hover:bg-black/70 transition-all z-10"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  disabled={currentIndex === 0}
                >
                  <ChevronLeft size={24} />
                </motion.button>
                
                <motion.button
                  onClick={onNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 rounded-full text-white hover:bg-black/70 transition-all z-10"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  disabled={currentIndex === images.length - 1}
                >
                  <ChevronRight size={24} />
                </motion.button>
              </>
            )}
          </div>
          
          {/* Image Info */}
          <div className="p-6 bg-white border-t border-gray-100">
            {currentImage?.title && (
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {currentImage.title}
              </h3>
            )}
            
            {currentImage?.desc && (
              <p className="text-gray-600 mb-4">
                {currentImage.desc}
              </p>
            )}
            
            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center">
                <Clock className="mr-1.5" size={16} />
                <span>
                  {new Date(currentImage?.updatedDate || currentImage?.createdDate).toLocaleDateString()}
                </span>
              </div>
              
              {images.length > 1 && (
                <div>
                  {currentIndex + 1} / {images.length}
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </Modal>
  );
};

const Card = ({ image, title, postDate, onClick }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ 
        y: -5,
        transition: { duration: 0.2 }
      }}
      whileTap={{ scale: 0.98 }}
      className="relative group cursor-pointer rounded-xl overflow-hidden shadow-md bg-white transition-all duration-300 hover:shadow-lg"
      onClick={onClick}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
        {image ? (
          <motion.img
            className="w-full h-full object-cover"
            src={image}
            alt={title}
            loading="lazy"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            whileHover={{ scale: 1.05 }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">
            <ImageIcon size={48} />
          </div>
        )}
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
          <motion.div 
            className="translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <h3 className="font-semibold text-white text-lg line-clamp-2">
              {title || "Untitled"}
            </h3>
            {postDate && (
              <div className="flex items-center text-white/80 text-sm mt-2">
                <Clock className="mr-1.5" size={16} />
                <span>{new Date(postDate).toLocaleDateString()}</span>
              </div>
            )}
          </motion.div>
        </div>
        
        <motion.div 
          className="absolute top-3 right-3 p-2 bg-black/50 rounded-full text-white opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-black/60"
          whileHover={{ scale: 1.1 }}
        >
          <Expand size={18} />
        </motion.div>
      </div>
    </motion.div>
  );
};

const CategoryImagesCards = ({ categoryName }) => {
  const [galleryItems, setGalleryItems] = useState([]);
  const [err, setErr] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalImageIndex, setModalImageIndex] = useState(0);
  
  const itemsPerPage = 3;

  const fetchGalleryItems = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${BASE_API_URL}/admin/gallery/getGalleryItems/${categoryName}`
      );
      setGalleryItems(response.data.ImageData || []);
      setErr("");
    } catch (error) {
      setErr(error.response?.data?.message || "Failed to load gallery items");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGalleryItems();
    setCurrentIndex(0);
  }, [categoryName]);

  const visibleItems = galleryItems.slice(currentIndex, currentIndex + itemsPerPage);
  const totalPages = Math.ceil(galleryItems.length / itemsPerPage);
  const currentPage = Math.floor(currentIndex / itemsPerPage) + 1;

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

  const openModal = (index) => {
    setModalImageIndex(index);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const handleNextImage = () => {
    if (modalImageIndex < galleryItems.length - 1) {
      setModalImageIndex(modalImageIndex + 1);
    }
  };

  const handlePrevImage = () => {
    if (modalImageIndex > 0) {
      setModalImageIndex(modalImageIndex - 1);
    }
  };

  const capitalizeWords = (str) => {
    return str.split(" ").map(word => 
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(" ");
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white -mt-10 rounded-2xl shadow-lg p-6 border border-gray-100 relative z-20"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-lightBlue-100 rounded-lg">
            <FolderOpen className="text-lightBlue-600" size={22} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">
              {capitalizeWords(categoryName)}
            </h3>
            <p className="text-gray-500 text-sm">
              {galleryItems.length} {galleryItems.length === 1 ? 'memory' : 'memories'}
            </p>
          </div>
        </div>
        
        {galleryItems.length > 0 && (
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-500 font-medium">
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex space-x-2">
              <motion.button
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className={`p-2 rounded-lg ${currentIndex === 0 ? 'bg-gray-100 text-gray-400' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                whileTap={{ scale: 0.95 }}
              >
                <ChevronLeft size={18} />
              </motion.button>
              <motion.button
                onClick={handleNext}
                disabled={currentIndex + itemsPerPage >= galleryItems.length}
                className={`p-2 rounded-lg ${currentIndex + itemsPerPage >= galleryItems.length ? 'bg-gray-100 text-gray-400' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                whileTap={{ scale: 0.95 }}
              >
                <ChevronRight size={18} />
              </motion.button>
            </div>
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-lightBlue-500 border-t-transparent rounded-full"
          />
        </div>
      ) : err ? (
        <div className="bg-red-50 rounded-xl p-6 text-center">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Visual Story Unavailable</h3>
          <p className="text-gray-500 mb-4">{err}</p>
          <motion.button
            onClick={fetchGalleryItems}
            className="px-4 py-2 bg-lightBlue-600 text-white rounded-lg hover:shadow-md transition-all"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            Try Again
          </motion.button>
        </div>
      ) : galleryItems.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleItems.map((item, index) => (
              <Card
                key={item._id || index}
                image={item.photo}
                title={item.title}
                postDate={item.updatedDate || item.createdDate}
                onClick={() => openModal(currentIndex + index)}
              />
            ))}
          </div>

          <ImageModal
            isOpen={modalOpen}
            onClose={closeModal}
            images={galleryItems}
            currentIndex={modalImageIndex}
            onNext={handleNextImage}
            onPrev={handlePrevImage}
          />
        </>
      ) : (
        <div className="bg-gray-50 rounded-xl p-8 text-center">
          <div className="mx-auto w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <FolderOpen className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Visual Stories Yet</h3>
          <p className="text-gray-500">This collection is waiting to be filled with memorable moments.</p>
        </div>
      )}
    </motion.div>
  );
};

CategoryImagesCards.propTypes = {
  categoryName: PropTypes.string.isRequired,
};

export default CategoryImagesCards;