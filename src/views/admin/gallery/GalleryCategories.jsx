import React from 'react'
import StatsSection from "../../../components/Admin/Cards/StatsSection";
import ShowGalleryCategories from '../../../components/Admin/GalleryComponents/ShowGalleryCategories'

const GalleryCategories = ({ sidebarExpanded }) => {
  return (
    <>
    <div className="mt-12 overflow-hidden">
    <StatsSection isDashboard={false} pageType='galleryCategories'/>

      {/* <div className="flex flex-wrap -mt-6">
        <div className="w-full mb-12 px-4 -mt-42"> */}
          <ShowGalleryCategories sidebarExpanded={sidebarExpanded}/>
        {/* </div>
      </div> */}

    </div>
    </>
  )
}

export default GalleryCategories
