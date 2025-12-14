import React from 'react'

const Loader = () => {
  return (
      <div className="flex items-center justify-center w-full h-64">
        <div className="flex flex-col items-center gap-4">
          <div
            className="border-lightBlue-600 inline-block h-12 w-12 animate-spin rounded-full border-8 border-solid border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
            role="status"
          ></div>
          <p className="text-lightBlue-600 text-3xl text-center">Loading data...</p>
        </div>
      </div>

    //   <div className="flex justify-center items-center h-screen">
    //   <div className="w-16 h-16 border-4 border-lightBlue-600 border-dashed rounded-full animate-spin"></div>
    // </div>
  )
}

export default Loader;


