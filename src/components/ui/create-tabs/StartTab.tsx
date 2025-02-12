import React from "react";

interface StartTabProps {
    changeNextTab: () => void;
}
const StartTab: React.FC<StartTabProps> = ({ changeNextTab }) => {
  return (
    <>
       <div className="mt-4  rounded-md flex items-center justify-between">
            <input
              type="text"
              placeholder="https://linkedin.com/xodotmarket/status/1839006163440119910"
              className="w-full px-4 py-2 bg-gray-100 rounded-md"
            />
          </div>

          <div className="flex justify-end mt-4">
            <button onClick={changeNextTab} className="text-gray-700 font-medium flex items-center space-x-1">
              <span>Next</span>
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5l7 7-7 7"
                ></path>
              </svg>
            </button>
          </div>
    </>
  );
};

export default StartTab;
