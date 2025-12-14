import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserData, updateUserProfile, deleteUserProfile } from "../../../redux/User/userprofileSlice";
import UpdateProfileForm from "./UpdateProfileForm";
import ConfirmationModal from "./ConfirmationModal";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-hot-toast';

export default function CardSettings({ isOpen, onClose }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userData, deleteMessage, error } = useSelector((state) => state.user.profile);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      dispatch(fetchUserData());
    }
  }, [isOpen, dispatch]);

  const handleUpdate = async (updatedData) => {
    await dispatch(updateUserProfile(updatedData));
    setIsEditModalOpen(false);
  };

  const handleDelete = async () => {
    await dispatch(deleteUserProfile());
    setIsDeleteModalOpen(false);
    localStorage.removeItem("token");
    navigate("/login");
    toast.success('Account deleted successfully!');
  };

  return (
    isOpen && (
      <>
<div className="fixed inset-0 bg-gray-900/50 z-40"></div> 
<div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto">
          <div
            style={{ width: "100%", maxWidth: "80%" }}
            className="relative w-full sm:mx-auto my-8 bg-white rounded-2xl shadow-2xl border border-gray-100"
          >
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-lightBlue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <i className="fas fa-user-edit text-white"></i>
                </div>
                <h2 className="text-2xl font-semibold text-gray-800">My Profile</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors duration-200"
              >
                <i className="fas fa-times text-gray-400 hover:text-gray-600"></i>
              </button>
            </div>
            <div className="p-6">
              <h6 className="text-gray-600 font-bold uppercase mb-3">User Information</h6>
              <div className="grid grid-cols-2 gap-4 text-gray-700">
                <p><strong>Name:</strong> {userData?.name}</p>
                <p><strong>Email:</strong> {userData?.email}</p>
                <p><strong>Date of Birth:</strong> {userData?.dob}</p>
                <p><strong>Mobile:</strong> {userData?.mobile}</p>
                <p><strong>Gender:</strong> {userData?.gender}</p>
                <img src={userData?.userPhoto} className="w-30 h-30 rounded-full" alt="user-image" />
              </div>
              <div className="mt-6 flex justify-end space-x-4">
                <button
                  onClick={() => setIsEditModalOpen(true)}
                  className="px-6 py-3 rounded-xl bg-lightBlue-600 text-white hover:from-lightBlue-600 hover:to-indigo-700 focus:ring-2 focus:ring-lightBlue-600/20 transition-all duration-200"
                >
                  Edit Profile
                </button>
                <button
                  onClick={() => setIsDeleteModalOpen(true)}
                  className="px-6 py-3 rounded-xl bg-red-600 text-white hover:bg-red-700 focus:ring-2 focus:ring-red-500/20 transition-all duration-200 ml-4"
                >
                  Delete Profile
                </button>
              </div>
            </div>
          </div>
        </div>
        <UpdateProfileForm 
          isOpen={isEditModalOpen} 
          onClose={() => setIsEditModalOpen(false)} 
          userData={userData} 
          onUpdate={handleUpdate} 
        />
        <ConfirmationModal 
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)} 
          onConfirm={handleDelete}
          message="Are you sure you want to delete your profile?" 
        />
      </>
    )
  );
}