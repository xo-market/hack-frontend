"use client";
import Layout from "@/components/layout/Layout";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import {
  Chart,
  ChartConfiguration,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
} from "chart.js";
import Image from "next/image";
import { useDataContext } from "@/context/DataContext";
const SingleMarket: React.FC = () => {
  const router = useRouter();
  const id = router.query.id;
  const chartRef = useRef<Chart | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [prices, setPrices] = useState<{ price: number[]; timestamp: string }[]>(
    []
  );

  useEffect(() => {
    // Register necessary components
    Chart.register(LineController, LineElement, PointElement, LinearScale, CategoryScale);
  }, []);

  useEffect(() => {
    (async () => {
      let data = await fetchMarketChartPrices(id);
      setPrices(data?.prices || []);
    })();
  }, [id]);

  useEffect(() => {
    if (!prices.length) return;

    // Transform backend data
    const labels = prices.map((item) =>
      new Date(Number(item.timestamp)).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    );    
    const dataset1 = prices.map((item) => Number(item.price[0]) / 1e14);
    const dataset2 = prices.map((item) => Number(item.price[1]) / 1e14);    

    const config: ChartConfiguration = {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label: `${new Date().getFullYear()}`,
            backgroundColor: "#FE69B3",
            borderColor: "#FE69B3",
            data: dataset1,
            fill: false,
          },
          {
            label: `${new Date().getFullYear() - 1}`,
            backgroundColor: "#3FDEC9",
            borderColor: "#3FDEC9",
            data: dataset2,
            fill: false,
          },
        ],
      },
      options: {
        maintainAspectRatio: false,
        responsive: true,
        hover: {
          mode: "nearest",
          intersect: true,
        },
      },
    };

    // Destroy previous instance if exists
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    // Initialize new chart instance
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      if (ctx) {
        chartRef.current = new Chart(ctx, config);
      }
    }
  }, [prices,id]);
  const {buyOutcome,fetchMarketChartPrices} = useDataContext();
  const [amount, setAmount] = React.useState("0");
  const handleConfirmTransaction = async () => {
    await buyOutcome(
      10,
      1,
      +amount.toString(),
      +amount.toString()
    );
  } 


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
                <Image
                  src="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                  alt="Post Image"
                  className="rounded-md w-20 h-20"
                  width={80}
                  height={80}
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
                      This market will resolve to Yes if the total amount of
                      likes on the linked post are 1K or above, by Feb 28, 2025,
                      11:59 PM EST. Otherwise, this market will resolve to No.
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
                <div className="w-80 border border-red-300 rounded-lg p-4 mt-4">
                  {/* Tab Selector */}
                  <div className="flex border-b border-red-300">
                    <button className="w-1/2 text-center py-2 font-semibold text-black border-b-2 border-red-400">
                      Buy
                    </button>
                    <button className="w-1/2 text-center py-2 text-gray-400">
                      Sell
                    </button>
                  </div>

                  {/* Prediction Bar */}
                  <div className="flex items-center justify-between py-3">
                    <span className="text-green-600 font-semibold">64%</span>
                    <div className="flex-1 h-2 mx-2 bg-[#198788] rounded-full relative">
                      <div
                        style={{ width: "64%" }}
                      ></div>
                      <div
                        className="absolute right-0 top-0 h-2 bg-red-500 rounded-r-full"
                        style={{ width: "35%" }}
                      ></div>
                    </div>
                    <span className="text-red-500 font-semibold">35%</span>
                  </div>

                  {/* Yes / No Buttons */}
                  <div className="flex gap-3">
                    <button className="flex-1 bg-[#198788] text-white py-2 rounded-lg flex items-center justify-center">
                      Yes
                    </button>
                    <button className="flex-1 bg-red-100 text-red-500 py-2 rounded-lg flex items-center justify-center">
                      No
                    </button>
                  </div>

                  {/* Input Field */}
                  <div className="mt-4">
                    <span className="text-gray-500 text-sm">
                      Balance:{" "}
                      <span className="font-semibold">5230 xoUSDC</span>
                    </span>
                    <input
                      type="number"
                      name="amount"
                      onChange={(e) => setAmount(e.target.value)}
                      value={amount}
                      placeholder="Amount"
                      className="w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring focus:ring-red-300"
                    />
                  </div>

                  {/* Share Price & Potential Return */}
                  <div className="mt-2 text-sm text-gray-500">
                    <p>
                      Share Price:{" "}
                      <span className="font-semibold">0.5 xoUSDC</span>
                    </p>
                    <p>
                      Potential Return:{" "}
                      <span className="font-semibold">400 xoUSDC</span>
                    </p>
                  </div>

                  {/* Confirm Button */}
                  <button onClick={handleConfirmTransaction} className="w-full bg-[#198788] text-white py-2 mt-4 rounded-lg">
                    Confirm Transaction
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

export default SingleMarket;
