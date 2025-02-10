import React from "react";

const PredictionCard = () => {
  return (
    <>
      <div className="border border-red-300 rounded-xl p-4 w-100 shadow-lg">
        <div className="flex gap-2 mb-2">
          <span className="bg-red-200 text-red-600 text-xs px-3 py-1 rounded-full font-semibold">
            USDC
          </span>
          <span className="bg-red-200 text-red-600 text-xs px-3 py-1 rounded-full font-semibold">
            NEW
          </span>
          <span className="bg-red-200 text-red-600 text-xs px-3 py-1 rounded-full font-semibold">
            Tech
          </span>
          <span className="bg-red-200 text-red-600 text-xs px-3 py-1 rounded-full font-semibold">
            Multi tags
          </span>
          <svg
            className="ml-auto text-red-500 cursor-pointer w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 6l7-3 7 3v12a2 2 0 01-2 2H7a2 2 0 01-2-2V6z"
            ></path>
          </svg>
        </div>

        <div className="border border-red-300 rounded-lg overflow-hidden">
          <div className="p-2 flex items-center gap-2">
            <img
              src="https://avatars.githubusercontent.com/u/82640789?v=4"
              alt="Profile"
              className="w-8 h-8 rounded-full"
            />
            <div>
              <p className="text-xs font-semibold">Elizabeth Kukka, MBA</p>
              <p className="text-xs text-gray-500">
                Chief Executive Officer at Purpose for Profit
              </p>
            </div>
          </div>
          <p className="text-xs p-2 text-gray-600">
            Over the years, I’ve had countless conversations with friends,
            family, investors...
          </p>
          <div className="h-20 bg-gray-300 flex items-center justify-center text-gray-500">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 2c5.5 0 10 4.5 10 10s-4.5 10-10 10S2 17.5 2 12 6.5 2 12 2z"
              ></path>
            </svg>
          </div>
        </div>

        <p className="font-bold text-lg text-center mt-3">
          1K Likes or above by end of Feb.
        </p>

        <div className="flex items-center gap-2 mt-3">
          <span className="text-green-500 text-xs">50%</span>
          <div className="flex-1 h-2 bg-gray-200 rounded-full relative">
            <div className="absolute top-0 left-0 h-full bg-green-500 w-1/2 rounded-full rounded-r-none"></div>
            <div className="absolute top-0 right-0 h-full bg-red-500 w-1/2 rounded-full rounded-l-none"></div>
          </div>
          <span className="text-red-500 text-xs">50%</span>
        </div>

        <div className="flex justify-center mt-3 gap-4">
          <button className="bg-green-100 text-green-600 px-2 py-2 rounded-lg font-semibold w-1/3">
            Yes
          </button>
          <button className="bg-red-100 text-red-600 px-2 py-2 rounded-lg font-semibold w-1/3">
            No
          </button>
        </div>

        <div className="flex items-center text-xs text-gray-600 mt-4">
          <span className="flex items-center gap-1">
            <svg
              className="w-3 h-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 2c5.5 0 10 4.5 10 10s-4.5 10-10 10S2 17.5 2 12 6.5 2 12 2z"
              ></path>
            </svg>
            2000 Vol.
          </span>
          <span className="flex items-center gap-1 ml-4">
            <svg
              className="w-3 h-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v4l3 3"
              ></path>
            </svg>
            Feb 28, 23:59
          </span>
          <span className="ml-auto text-red-500 font-semibold">
            0Xwalid.eth
          </span>
        </div>
      </div>
    </>
  );
};

export default PredictionCard;
