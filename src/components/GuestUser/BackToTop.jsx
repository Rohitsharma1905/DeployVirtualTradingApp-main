import { useEffect } from "react";

const BackToTop = () => {
  useEffect(() => {
    console.log("BackToTop component mounted");
  }, []);

  return (
    <button className="fixed bottom-4 right-4 bg-lightBlue-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-700 transition-all">
      Click Me
    </button>
  );
};

export default BackToTop;
