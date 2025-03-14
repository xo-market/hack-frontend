"use client";
import Layout from "@/components/layout/Layout";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

import Image from "next/image";
import { useDataContext } from "@/context/DataContext";
import Spinner from "@/components/ui/Spinner";
import LineChart from "@/components/ui/LineChart";
const SingleMarket: React.FC = () => {
  const router = useRouter();
  const id = router.query.id;
  const [marketData, setMarketData] = useState();
  const [outcome, setOutcome] = useState(0);
  const [activeTab, setActiveTab] = useState("buy");
  const [statusData, setStatusData] = useState();
  const [singleMarketResult, setSingleMarketResult] = useState();
  const {
    buyOutcome,
    formatTimestamp,
    fetchMarketChartPrices,
    fetchSingleMarketData,
    tokenBalance,
    getMarket,
    sellOutcome,
  } = useDataContext();
  const [prices, setPrices] = useState<
    { price: number[]; timestamp: string }[]
  >([]);

  useEffect(() => {
    (async () => {
      try {
        // Add console logs to see what's happening
        console.log("Fetching data for market ID:", id);
        
        // Fetch all data in parallel to improve performance
        const [chartData, singleMarketResult, marketDataResult] = await Promise.all([
          fetchMarketChartPrices(id).catch(err => {
            console.error("Error fetching chart prices:", err);
            return { prices: [] };
          }),
          fetchSingleMarketData(id).catch(err => {
            console.error("Error fetching single market data:", err);
            return null;
          }),
          getMarket(id).catch(err => {
            console.error("Error fetching market status:", err);
            return null;
          })
        ]);
        
        console.log("Chart data:", chartData);
        console.log("Market data:", marketDataResult);
        console.log("Single market data:", singleMarketResult);
        
        // Use the correct property for resolvedAt
        console.log("ResolvedAt data:", marketDataResult?.resolvedAt ? new Date(marketDataResult.resolvedAt).getTime() / 1000 : 0);
        
        // Even if some data is missing, we should still set what we have
        setStatusData(marketDataResult);
        setSingleMarketResult(singleMarketResult);
        setMarketData(marketDataResult);
        setPrices(chartData?.prices || []);
        
      } catch (error) {
        console.error("Error in market data fetch:", error);
        setMarketData({});
      }
    })();
  }, [id, fetchMarketChartPrices, fetchSingleMarketData, getMarket]);

  const [amount, setAmount] = React.useState("0");
  const handleConfirmTransaction = async (state: string) => {
    if (state === "buy") {
      await buyOutcome(id, outcome, +amount.toString(), +amount.toString());
    } else {
      await sellOutcome(id, outcome, +amount.toString(), +amount.toString());
    }

    let data = await fetchMarketChartPrices(id);
    let market = await fetchSingleMarketData(id);
    setPrices(data?.prices || []);
    setSingleMarketResult(market);
  };

  return (
    <>
      <Layout>
        {marketData ? (
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
                    src={
                      singleMarketResult?.image ||
                      "https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                    }
                    alt="Post Image"
                    className="rounded-md w-20 h-20"
                    width={80}
                    height={80}
                  />
                </div>
                <div className="mt-2 flex flex-col">
                  <h2 className="text-lg font-semibold">
                    {singleMarketResult?.description}
                  </h2>
                  <p className="text-xs -mt-2">{singleMarketResult?.name}</p>
                  <div className="flex items-center space-x-2 text-gray-600 text-xs mt-1">
                    <span>Ends: {formatTimestamp(singleMarketResult?.expires_at)}</span>
                    <span>•</span>
                    <span className="text-blue-500">
                      {singleMarketResult?.creator?.slice(0, 5) +
                        "..." +
                        singleMarketResult?.creator?.slice(-5)}
                    </span>
                    <span className="px-2 py-0.5 text-xs bg-red-200 text-red-700 rounded">
                      USDC
                    </span>
                    <span className="px-2 py-0.5 text-xs bg-blue-200 text-blue-700 rounded">
                      NEW
                    </span>
                    {singleMarketResult?.tags &&
                      singleMarketResult?.tags?.map((item, index) => (
                        <span key={index} className="px-2 py-0.5 text-xs bg-purple-200 text-purple-700 rounded">
                          {item}
                        </span>
                      ))}
                    <span className="px-2 py-0.5 text-xs bg-pink-200 text-pink-700 rounded">
                      {singleMarketResult?.category}
                    </span>
                  </div>
                </div>
              </div>

              <div className="w-full flex gap-4">
                <div className="w-2/3">
                  {/* Graph Placeholder */}
                  <div className="mt-6 h-80 rounded-lg flex items-center justify-center">
                    <div className="relative w-full h-full">
                      {prices?.length > 0 ? (
                        <LineChart prices={prices} id={id} />
                      ) : (
                        <Image
                          src="https://user-images.githubusercontent.com/5864173/109405321-51050880-7924-11eb-86ab-a4e7a3f63cdc.png"
                          alt="Post Image"
                          className="w-full h-full"
                          width={80}
                          height={80}
                        />
                      )}
                    </div>
                  </div>

                  {/* Market Rules Section */}
                  <div className="mt-6 p-4 border rounded-lg">
                    <h3 className="text-lg font-semibold">Market Rules:</h3>

                    <div className="mt-4 border p-4 rounded-md">
                      <h4 className="font-semibold">Market Summary</h4>
                      <p className="text-sm text-gray-600">
                        This market will resolve to Yes if the total amount of {singleMarketResult?.type || "likes"} on the linked post 
                        {singleMarketResult?.type === "likes" ? " are " : " is "}
                        {singleMarketResult?.value || 166} or above, by {formatTimestamp(singleMarketResult?.expires_at)}. 
                        Otherwise, this market will resolve to No.
                      </p>
                    </div>

                    <div className="mt-4 p-4 rounded-md border">
                      <h4 className="font-semibold">Resolution Rules</h4>
                      <p className="text-sm text-gray-600">
                        This market will resolve based on the live data provided
                        by the Farcaster API at the expiration time ({formatTimestamp(singleMarketResult?.expires_at)}), to
                        find the total number of {singleMarketResult?.type || "likes"} this post has received.
                        If there is an issue with the API, a manual count by an
                        XO jury is done.
                      </p>
                    </div>

                    <div className="mt-4 p-4 rounded-md border">
                      <h4 className="font-semibold">Resolution Source</h4>
        
                        Neynar API - https://api.neynar.com/v2/farcaster
                    
                    </div>
                  </div>
                </div>

                <div className="w-1/3 flex flex-col">
                  {/* Transaction Confirmation Box */}
                  <div className="w-80 border border-red-300 rounded-lg p-4 mt-4">
                    {/* Tab Selector */}
                    <div className="flex border-b border-red-300">
                      <button
                        onClick={() => setActiveTab("buy")}
                        className={`w-1/2 text-center py-2 font-semibold ${
                          activeTab === "buy"
                            ? "text-black border-b-2 border-red-400"
                            : "text-gray-400"
                        }`}
                        disabled={singleMarketResult?.expires_at && parseInt(singleMarketResult.expires_at) <= Math.floor(Date.now() / 1000)}
                      >
                        Buy
                      </button>
                      <button
                        onClick={() => setActiveTab("sell")}
                        className={`w-1/2 text-center py-2 font-semibold ${
                          activeTab === "sell"
                            ? "text-black border-b-2 border-red-400"
                            : "text-gray-400"
                        }`}
                        disabled={singleMarketResult?.expires_at && parseInt(singleMarketResult.expires_at) <= Math.floor(Date.now() / 1000)}
                      >
                        Sell
                      </button>
                    </div>

                    <div className="flex items-center justify-between py-3">
                      <span className="text-green-600 font-semibold">
                        {Number(singleMarketResult?.yesPercentage).toFixed(2)}%
                      </span>
                      <div className="flex-1 h-2 mx-2 bg-[#198788] rounded-full relative">
                        <div
                          style={{
                            width: `${Number(singleMarketResult?.yesPercentage).toFixed(
                              2,
                            )}%`,
                          }}
                          className="h-2 bg-green-600 rounded-l-full"
                        ></div>
                        <div
                          className="absolute right-0 top-0 h-2 bg-red-500 rounded-r-full"
                          style={{
                            width: `${Number(singleMarketResult?.noPercentage).toFixed(
                              2,
                            )}%`,
                          }}
                        ></div>
                      </div>
                      <span className="text-red-500 font-semibold">
                        {Number(singleMarketResult?.noPercentage).toFixed(2)}%
                      </span>
                    </div>

                    {singleMarketResult?.expires_at && parseInt(singleMarketResult.expires_at) <= Math.floor(Date.now() / 1000) ? (
                      <div className="bg-red-100 text-red-600 p-3 rounded-md text-center font-medium">
                        This market has ended and is no longer accepting trades
                      </div>
                    ) : (
                      <>
                        <div className="flex gap-3">
                          <button
                            onClick={() => setOutcome(0)}
                            className={`flex-1 py-2 rounded-lg flex items-center justify-center transition-all duration-200 ${
                              outcome === 0
                                ? "bg-[#136d6d] text-white font-bold" // Selected "Yes"
                                : "bg-green-100 text-gray-600"
                            }`}
                          >
                            Yes
                          </button>

                          <button
                            onClick={() => setOutcome(1)}
                            className={`flex-1 py-2 rounded-lg flex items-center justify-center transition-all duration-200 ${
                              outcome === 1
                                ? "bg-red-500 text-white font-bold" // Selected "No"
                                : "bg-red-100 text-gray-500"
                            }`}
                          >
                            No
                          </button>
                        </div>

                        {/* Input Field */}
                        <div className="mt-4">
                          <span className="text-gray-500 text-sm">
                            Balance:{" "}
                            <span className="font-semibold">
                              {tokenBalance} XO Token
                            </span>
                          </span>
                          <input
                            type="number"
                            name="amount"
                            max={tokenBalance.toString()}
                            onChange={(e) => setAmount(e.target.value)}
                            value={amount}
                            placeholder="Amount"
                            className="w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring focus:ring-red-300"
                          />
                        </div>

                        {activeTab === "buy" ? (
                          <>
                            {/* Share Price & Potential Return */}
                            {outcome === 0 ? (
                              <div className="mt-2 text-sm text-gray-500">
                                <p>
                                  Share Price:{" "}
                                  <span className="font-semibold">
                                    {(
                                      singleMarketResult?.yesPercentage /
                                      (singleMarketResult?.yesPercentage +
                                        singleMarketResult?.noPercentage)
                                    ).toFixed(2)}
                                    XO Token
                                  </span>
                                </p>
                                <p>
                                  Potential Return:{" "}
                                  <span className="font-semibold">
                                    {(
                                      amount *
                                      (singleMarketResult?.yesPercentage /
                                        (singleMarketResult?.yesPercentage +
                                          singleMarketResult?.noPercentage))
                                    ).toFixed(2)}
                                  </span>
                                </p>
                              </div>
                            ) : (
                              <div className="mt-2 text-sm text-gray-500">
                                <p>
                                  Share Price:{" "}
                                  <span className="font-semibold">
                                    {(
                                      singleMarketResult?.noPercentage /
                                      (singleMarketResult?.yesPercentage +
                                        singleMarketResult?.noPercentage)
                                    ).toFixed(2)}
                                    XO Token
                                  </span>
                                </p>
                                <p>
                                  Potential Return:{" "}
                                  <span className="font-semibold">
                                    {(
                                      amount *
                                      (singleMarketResult?.noPercentage /
                                        (singleMarketResult?.yesPercentage +
                                          singleMarketResult?.noPercentage))
                                    ).toFixed(2)}
                                  </span>
                                </p>
                              </div>
                            )}

                            {/* Confirm Button */}
                            <button
                              onClick={() => handleConfirmTransaction("buy")}
                              className="w-full bg-[#198788] text-white py-2 mt-4 rounded-lg"
                            >
                              Buy
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => handleConfirmTransaction("sell")}
                              className="w-full bg-[#198788] text-white py-2 mt-4 rounded-lg"
                            >
                              Sell
                            </button>
                          </>
                        )}
                      </>
                    )}
                  </div>

                  {/* Market Status */}
                  <div className="w-full mt-4 p-4 border rounded-lg">
                    <h3 className="text-lg font-semibold">Market Status</h3>
                    <ul className="mt-4 space-y-2 text-sm text-gray-600">
                      <li className="flex items-center space-x-2">
                        <span
                          className={`w-4 h-4 ${
                            parseInt(singleMarketResult?.expires_at) >= Math.floor(Date.now() / 1000)
                              ? "bg-yellow-500"
                              : "bg-gray-300"
                          } rounded-full`}
                        ></span>
                        <span>Market Start</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <span
                          className={`w-4 h-4 ${
                            parseInt(singleMarketResult?.expires_at) <= Math.floor(Date.now() / 1000) && 
                            !marketData?.resolvedAt 
                              ? "bg-gray-500"
                              : "bg-gray-300"
                          } rounded-full`}
                        ></span>
                        <span>Resolution Pending</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <span
                          className={`w-4 h-4 ${
                            marketData?.resolvedAt
                              ? "bg-green-500"
                              : "bg-gray-300"
                          } rounded-full`}
                        ></span>
                        <span>Resolution Complete</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="animate-pulse flex space-x-4 mb-4">
              <div className="h-12 w-12 bg-pink-200 rounded-full"></div>
              <div className="flex-1 space-y-4 max-w-md">
                <div className="h-4 bg-pink-200 rounded w-3/4"></div>
                <div className="h-4 bg-pink-200 rounded"></div>
                <div className="h-4 bg-pink-200 rounded w-5/6"></div>
              </div>
            </div>
            <p className="text-gray-500">Loading prediction market...</p>
          </div>
        )}
      </Layout>
    </>
  );
};

export default SingleMarket;
