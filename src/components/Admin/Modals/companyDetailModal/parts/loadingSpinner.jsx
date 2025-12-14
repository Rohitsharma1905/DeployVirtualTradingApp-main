const LoadingSpinner = ({ message = "Loading data..." }) => (
    <div className="flex items-center justify-center h-[400px]">
      <div className="flex flex-col items-center gap-6">
        <div className="border-lightBlue-600 inline-block h-16 w-16 animate-spin rounded-full border-8 border-solid border-r-transparent align-[-0.125em]" role="status"></div>
        <div className="text-center">
          <p className="text-gray-800 text-lg font-medium">{message}</p>
          <p className="text-gray-500 text-sm mt-2">Please wait while we fetch the latest information</p>
        </div>
      </div>
    </div>
  );
  
  export default LoadingSpinner;