import React, { useState, useEffect } from "react";
import { BASE_API_URL } from "../../../../utils/BaseUrl";
import axios from "axios";
import { FaBuilding, FaTimes, FaSearch } from "react-icons/fa";
import { FolderOpen } from "lucide-react";
import { useMediaQuery } from 'react-responsive';

const ShowAllClientsModal = ({ closeModal, clients }) => {
    const [orgData, setOrgData] = useState(clients);
    const [err, setErr] = useState("");
    const [search, setSearch] = useState("");
    const [isRecent, setIsRecent] = useState(true);
    const isMobile = useMediaQuery({ maxWidth: 767 });
    const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 1023 });

    const fetchOrganizationsData = async () => {
        try {
            const searchQuery = search.trim() === "" ? "all" : search;
            const response = await axios.get(
                `${BASE_API_URL}/guestUser/getAllOrganizations/${searchQuery}`
            );
            setOrgData(response.data.data);
            setErr("");
        } catch (error) {
            setErr(error.message);
        }
    };

    useEffect(() => {
        try {
            fetchOrganizationsData();
            setErr("");
        } catch (error) {
            setErr(error.message);
        }
    }, [search]);

    // Mobile view component
    const MobileView = () => (
        <div className="p-4">
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                    <FaBuilding className="text-[#2474ff] text-xl" />
                    <h2 className="text-base font-bold text-gray-600">
                        Organizations
                    </h2>
                </div>
                <button
                    onClick={closeModal}
                    className="p-2 hover:bg-gray-100 rounded-md transition-colors duration-200 focus:outline-none"
                >
                    <FaTimes className="text-gray-400 hover:text-gray-600 text-lg" />
                </button>
            </div>

            <div className="mb-4 flex justify-between items-center">
                <div className="relative w-full">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                        <FaSearch className="text-gray-400 text-sm" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value || "")}
                        className="border border-gray-400 pl-10 pr-4 py-2 rounded-lg w-full h-10 focus:outline-none focus:shadow-md focus:border-black"
                    />
                </div>
            </div>

            <div className="mb-4 flex justify-between items-center">
                <span className="text-sm text-gray-600">
                    Total: {orgData.length}
                </span>
                <button
                    onClick={() => setIsRecent(!isRecent)}
                    className="px-3 py-1 bg-lightBlue-600 text-white text-xs shadow-md rounded-md focus:outline-none hover:bg-blue-700"
                >
                    {isRecent ? "Recent" : "Older"}
                </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto">
                {err ? (
                    <div className="flex flex-col items-center justify-center p-4 bg-red-50 rounded-lg">
                        <div className="text-red-500 mb-2">
                            <FaTimes className="text-xl" />
                        </div>
                        <p className="text-red-600 text-sm text-center">{err}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="mt-2 px-3 py-1 bg-red-500 text-white text-xs rounded-md"
                        >
                            Retry
                        </button>
                    </div>
                ) : orgData.length > 0 ? (
                    (isRecent ? [...orgData].reverse() : orgData).map((org, index) => (
                        <div key={index} className="bg-white p-3 mb-3 rounded-lg border border-gray-200 shadow-sm">
                            <h3 className="font-medium text-gray-900 mb-1">
                                {org.name || 'Organization Name'}
                            </h3>
                            {org.website && (
                                <p className="text-xs text-lightBlue-600 mb-1 truncate">
                                    <a href={org.website} target="_blank" rel="noopener noreferrer">
                                        {org.website}
                                    </a>
                                </p>
                            )}
                            <p className="text-xs text-gray-600 mb-1">
                                {org.address || 'No address'}
                            </p>
                            <p className="text-xs text-gray-500">
                                {new Date(org.createDate).toISOString().split("T")[0]}
                            </p>
                        </div>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center p-6">
                        <FolderOpen className="w-8 h-8 text-gray-400 mb-2" />
                        <span className="text-sm text-gray-500">No Organizations available</span>
                    </div>
                )}
            </div>
        </div>
    );

    // Tablet view component
    const TabletView = () => (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    <FaBuilding className="text-[#2474ff] text-2xl" />
                    <h2 className="text-xl font-bold text-gray-600">
                        Associated Organizations
                    </h2>
                </div>
                <button
                    onClick={closeModal}
                    className="p-2 hover:bg-gray-100 rounded-md transition-colors duration-200 focus:outline-none"
                >
                    <FaTimes className="text-gray-400 hover:text-gray-600 text-xl" />
                </button>
            </div>

            <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="relative w-full md:w-96">
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value || "")}
                        className="border border-gray-400 pl-10 pr-4 py-2 rounded-lg w-full focus:outline-none focus:shadow-md focus:border-black"
                    />
                </div>

                <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-gray-600">
                        Total: {orgData.length}
                    </span>
                    <button
                        onClick={() => setIsRecent(!isRecent)}
                        className="px-4 py-2 bg-lightBlue-600 text-white text-sm shadow-md rounded-md hover:bg-blue-700"
                    >
                        {isRecent ? "Recently Associated" : "Previously Associated"}
                    </button>
                </div>
            </div>

            <div className="max-h-[60vh] overflow-y-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50 sticky top-0">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Organization
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Website
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Date
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {err ? (
                            <tr>
                                <td colSpan="3" className="p-4">
                                    <div className="flex flex-col items-center justify-center p-4 bg-red-50 rounded-lg">
                                        <div className="text-red-500 mb-2">
                                            <FaTimes className="text-xl" />
                                        </div>
                                        <p className="text-red-600 text-sm text-center">{err}</p>
                                        <button
                                            onClick={() => window.location.reload()}
                                            className="mt-2 px-3 py-1 bg-red-500 text-white text-xs rounded-md"
                                        >
                                            Retry
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ) : orgData.length > 0 ? (
                            (isRecent ? [...orgData].reverse() : orgData).map((org, index) => (
                                <tr key={index} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {org.name || 'Organization Name'}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-lightBlue-600 truncate max-w-[200px]">
                                        {org.website ? (
                                            <a href={org.website} target="_blank" rel="noopener noreferrer">
                                                {org.website}
                                            </a>
                                        ) : 'N/A'}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-500">
                                        {new Date(org.createDate).toISOString().split("T")[0]}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3" className="p-6">
                                    <div className="flex flex-col items-center justify-center">
                                        <FolderOpen className="w-10 h-10 text-gray-400 mb-2" />
                                        <span className="text-sm text-gray-500">No Organizations available</span>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(17,24,38,0.4)] pt-16"
            onClick={closeModal}
        >
            <div
                className={`relative bg-white rounded-xl shadow-lg ${isMobile ? 'w-full h-full' : isTablet ? 'w-[90%] h-[80vh]' : 'w-[85%] h-[83vh]'} flex flex-col`}
                onClick={(e) => e.stopPropagation()}
            >
                {isMobile ? (
                    <MobileView />
                ) : isTablet ? (
                    <TabletView />
                ) : (
                    <>
                        <div className="sticky top-0 bg-white left-0 w-full border-b border-gray-100 p-4 mt-1">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <FaBuilding className="text-[#2474ff] text-[27px]" />
                                    <h2 className="text-[18px] font-bold text-gray-600">
                                        Associated Organizations
                                    </h2>
                                </div>

                                <div className="flex items-center gap-3">
                                    <h6 className="text-base font-semibold text-gray-400">
                                        Total Organizations: {orgData.length}
                                    </h6>

                                    <button
                                        onClick={() => setIsRecent(!isRecent)}
                                        className="px-2 py-[6px] bg-lightBlue-600 text-white text-sm text-semibold shadow-md rounded-md focus:outline-none hover:bg-blue-700"
                                    >
                                        {isRecent ? "Recently Associated" : "Previously Associated"}
                                    </button>

                                    <div className="relative">
                                        <div className="relative w-[270px]">
                                            <FaSearch className="absolute left-3 top-1/4 transform -translate-y-1/2 text-gray-400 text-sm" />
                                            <input
                                                type="text"
                                                placeholder="Search..."
                                                value={search}
                                                onChange={(e) => setSearch(e.target.value || "")}
                                                className="border border-gray-400 pl-10 pr-4 py-2 rounded-lg w-full h-[36px] focus:outline-none focus:shadow-md focus:border-black"
                                            />
                                        </div>
                                    </div>

                                    <button
                                        onClick={closeModal}
                                        className="ml-2 p-2 hover:bg-gray-100 rounded-md transition-colors duration-200 focus:outline-none"
                                    >
                                        <FaTimes className="text-gray-400 hover:text-gray-600 text-lg" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="flex h-[64vh]">
                            <div className="inset-0 overflow-y-auto w-full max-h-[500px] rounded-lg shadow-md">
                                <table className="inset-0 min-w-full table-fixed divide-y divide-gray-200 border-collapse bg-white">
                                    <thead className="bg-gray-50 sticky top-0 z-10">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Organization Name
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Website
                                            </th>
                                            <th className="ml-10 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Address
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-center">
                                                Associated Date
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {orgData.length > 0 ? (
                                            (isRecent ? [...orgData].reverse() : orgData).map((org, index) => {
                                                return (
                                                    <tr
                                                        key={index}
                                                        className="hover:bg-gray-50 transition-colors"
                                                    >
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                            {org.name || 'Organization Name'}
                                                        </td>
                                                        <td className="px-6 py-4 min-w-[270px] max-w-[300px] break-words truncate whitespace-nowrap overflow-hidden text-ellipsis text-sm">
                                                            {org.website ? (
                                                                <a
                                                                    href={org.website}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                >
                                                                    <span className="underline text-lightBlue-600">
                                                                        {org.website}
                                                                    </span>
                                                                </a>
                                                            ) : (
                                                                "No website found"
                                                            )}
                                                        </td>
                                                        <td className="ml-10 px-6 py-4 min-w-[340px] max-w-[360px] break-words text-sm">
                                                            {org.address || 'No address found'}
                                                        </td>

                                                        <td className="px-6 py-4 text-center text-sm">
                                                            {new Date(org.createDate).toISOString().split("T")[0]}
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        ) : (!err &&
                                            <tr>
                                                <td colSpan="4"
                                                className="p-6 text-center text-gray-500 text-base font-medium bg-gray-50 rounded-md mt-4"
                                                >
                                                    <div className="pt-20 pb-42 flex flex-col items-center space-y-2">
                                                    <FolderOpen className="w-10 h-10 text-gray-400" /> 
                                                    <span>No Organizations available.</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="sticky bottom-0 -pb-2 bg-white py-1 border-t border-gray-100 flex justify-end">
                            <button
                                onClick={closeModal}
                                className="px-6 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-400 hover:text-white transition mt-1 -mb-2 mr-2"
                            >
                                Close
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default ShowAllClientsModal;