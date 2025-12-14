import React from 'react'
import StatsSection from "../../../components/Admin/Cards/StatsSection";
import ShowBookDemobyUser from '../../../components/Admin/ProductDemoComponents/ShowBookDemobyUser'

const UserDemo = ({sidebarExpanded}) => {
  return (
    <>
      <div className="mt-12 overflow-hidden">
        <StatsSection isDashboard={false} pageType='galleryCategories'/>
        <ShowBookDemobyUser sidebarExpanded={sidebarExpanded}/>
      </div>
    </>
  )
}

export default UserDemo
