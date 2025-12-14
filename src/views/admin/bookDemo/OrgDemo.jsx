import React from 'react'
import StatsSection from "../../../components/Admin/Cards/StatsSection";
import ShowBookDemobyOrg from '../../../components/Admin/ProductDemoComponents/ShowBookDemobyOrg'

const OrgDemo = ({sidebarExpanded}) => {
  return (
    <>
      <div className="mt-12 overflow-hidden">
        <StatsSection isDashboard={false} pageType='galleryCategories'/>
        <ShowBookDemobyOrg sidebarExpanded={sidebarExpanded}/>
      </div>
    </>
  )
}

export default OrgDemo
