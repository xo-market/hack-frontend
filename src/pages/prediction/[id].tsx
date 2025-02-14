import Layout from "@/components/layout/Layout";
import React, { useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Chart from "chart.js";
const page = () => {
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    var config = {
      type: "line",
      data: {
        labels: [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
        ],
        datasets: [
          {
            label: new Date().getFullYear(),
            backgroundColor: "#FE69B3",
            borderColor: "#FE69B3",
            data: [65, 78, 66, 44, 56, 67, 75],
            fill: false,
            
          },
          {
            label: new Date().getFullYear() - 1,
            fill: false,
            backgroundColor: "#3FDEC9",
            borderColor: "#3FDEC9",
            data: [40, 68, 86, 74, 56, 60, 87],
          },
        ],
      },
      options: {
        maintainAspectRatio: false,
        responsive: true,
        tooltips: {
          mode: "index",
          intersect: false,
        },
        hover: {
          mode: "nearest",
          intersect: true,
        },
       
      },
    };
    var ctx = document.getElementById("line-chart").getContext("2d");
    window.myLine = new Chart(ctx, config);
  }, []);
  return (
    <>
      <Layout>
        <div className="container mx-auto text-black px-20 flex flex-col">
          <div className="max-w-5xl mx-auto p-6">
            {/* Header Section */}
            <div className="flex items-center justify-between">
              <h1 className="text-sm text-blue-500 mt-4">
                <Link href="/">← Markets</Link>
              </h1>
              <button className="flex items-center space-x-2 text-gray-500 hover:text-black">
                <span>Share</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path d="M4 12v7a2 2 0 002 2h12a2 2 0 002-2v-7"></path>
                  <path d="M16 6l-4-4-4 4"></path>
                  <path d="M12 2v14"></path>
                </svg>
              </button>
            </div>
            <h1>Market Details</h1>
            {/* Market Title */}
            <div className="mt-4 p-4 border rounded-lg flex gap-x-8">
              <div className="flex items-center space-x-4">
                <img
                  src="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                  alt="Post Image"
                  className="rounded-md w-20 h-20"
                />
              </div>
              <div className="mt-2 flex flex-col">
                <h2 className="text-lg font-semibold">
                  1K Likes or above by end of Feb.
                </h2>
                <div className="flex items-center space-x-2 text-gray-600 text-xs">
                  <span>2000 Vol.</span>
                  <span>•</span>
                  <span>Feb 28, 23:59</span>
                  <span>•</span>
                  <span className="text-blue-500">@0Xwalid.eth</span>
                  <span className="px-2 py-0.5 text-xs bg-red-200 text-red-700 rounded">
                    USDC
                  </span>
                  <span className="px-2 py-0.5 text-xs bg-blue-200 text-blue-700 rounded">
                    NEW
                  </span>
                  <span className="px-2 py-0.5 text-xs bg-purple-200 text-purple-700 rounded">
                    Tech
                  </span>
                  <span className="px-2 py-0.5 text-xs bg-pink-200 text-pink-700 rounded">
                    Multi tags
                  </span>
                </div>
              </div>
            </div>

            <div className="w-full flex gap-4">
              <div className="w-2/3">
                {/* Graph Placeholder */}
                <div className="mt-6 h-80 rounded-lg flex items-center justify-center">
                  <div className="relative w-full h-full">
                    <canvas id="line-chart"></canvas>
                  </div>
                </div>

                {/* Market Rules Section */}
                <div className="mt-6 p-4 border rounded-lg">
                  <h3 className="text-lg font-semibold">Market Rules:</h3>

                  <div className="mt-4 border p-4 rounded-md">
                    <h4 className="font-semibold">Market Summary</h4>
                    <p className="text-sm text-gray-600">
                      This market will resolve to "Yes" if the total amount of
                      likes on the linked post are 1K or above, by Feb 28, 2025,
                      11:59 PM EST. Otherwise, this market will resolve to "No".
                    </p>
                  </div>

                  <div className="mt-4 p-4 rounded-md border">
                    <h4 className="font-semibold">Resolution Rules</h4>
                    <p className="text-sm text-gray-600">
                      This market will resolve based on the live data provided
                      by the social media API at 23:59 EST on Feb 28, 2025, to
                      find the total number of likes this post has received. If
                      there is an issue with the API, a manual count by an XO
                      jury is done.
                    </p>
                  </div>

                  <div className="mt-4 p-4 rounded-md border">
                    <h4 className="font-semibold">Resolution Source</h4>
                    <a href="#" className="text-blue-500 text-sm underline">
                      Post Link on social media website X.
                    </a>
                  </div>
                </div>
              </div>

              <div className="w-1/3 flex flex-col">
                {/* Transaction Confirmation Box */}

                <div className="p-4 border rounded-lg mt-4">
                  <h3 className="text-lg font-semibold">
                    Confirming Transaction
                  </h3>
                  <div className="mt-4 flex items-center justify-center">
                    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                  <p className="text-center mt-2 text-sm text-gray-600">
                    Transaction is in progress
                  </p>
                  <div className="mt-4 text-sm text-gray-600">
                    <p>
                      You Pay: <strong>1000 USDC</strong>
                    </p>
                    <p>
                      You Receive: <strong>500 Shares of Yes 1K</strong>
                    </p>
                    <p>
                      Avg Price Per Share: <strong>2 USDC</strong>
                    </p>
                  </div>
                  <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md">
                    Confirming ...
                  </button>
                </div>

                {/* Market Status */}
                <div className="w-full mt-4 p-4 border rounded-lg">
                  <h3 className="text-lg font-semibold">Market Status</h3>
                  <ul className="mt-4 space-y-2 text-sm text-gray-600">
                    <li className="flex items-center space-x-2">
                      <span className="w-4 h-4 bg-red-500 rounded-full"></span>
                      <span>Market Start - Feb 05, 2025 | 12:43 EST</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="w-4 h-4 bg-gray-300 rounded-full"></span>
                      <span>Predictions Close</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="w-4 h-4 bg-gray-300 rounded-full"></span>
                      <span>Resolution Start</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="w-4 h-4 bg-gray-300 rounded-full"></span>
                      <span>Resolution Close</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default page;
