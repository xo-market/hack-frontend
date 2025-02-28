"use client";
import Layout from "@/components/layout/Layout";
import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { useDataContext } from "@/context/DataContext";
import { useAccount } from "wagmi";
const Dashboard: React.FC = () => {
  const { getUserData, tokenBalance, redeemWinnings } = useDataContext();

  const handleRedeem = async (marketId: number) => {
    await redeemWinnings(marketId);
  };
  const [userData, setUserData] = useState();
  const { address } = useAccount();
  const [activeTab, setActiveTab] = useState("Activity");
  useEffect(() => {
    (async () => {
      let res = await getUserData();
      setUserData(res);
    })();
  }, []);

  return (
    <>
      <Layout>
        <div className="p-6 bg-white rounded-lg w-full max-w-4xl mx-auto">
          {/* Profile Section */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-24 h-24 bg-pink-400 rounded-full flex overflow-hidden justify-center items-center">
                <Image
                  src={`https://effigy.im/a/${address}.svg`}
                  alt="Edit"
                  className="w-full h-full object-cover"
                  width={10}
                  height={10}
                />
              </div>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {address?.slice(0, 5) + "..." + address?.slice(-5)}
              </h2>
              <button className="mt-2 px-4 py-2 bg-pink-500 text-white text-sm rounded">
                Edit Profile
              </button>
            </div>
          </div>

          {/* Account Info */}
          <div className="grid grid-cols-4 gap-4 mt-6 p-4 border rounded-lg">
            <div>
              <p className="text-gray-500 text-sm">Account</p>
              <p className="font-semibold text-black">
                {address?.slice(0, 5) + "..." + address?.slice(-5)}
              </p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Rank</p>
              <p className="font-semibold text-black">1,548</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Balance</p>
              <p className="font-semibold text-black">{tokenBalance} xoUSDC</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Points to Claim</p>
              <p className="font-semibold text-black">0 xoPoints</p>
            </div>
          </div>

          {/* Search & Filters */}
          <div className="mt-6 flex space-x-4 text-black">
            <input
              type="text"
              placeholder="Search your portfolio"
              className="flex-1 p-2 border rounded-md"
            />
            <select className="p-2 border rounded-md">
              <option>All</option>
            </select>
            <select className="p-2 border rounded-md">
              <option>Newest</option>
            </select>
          </div>

          {/* Tabs */}
          <div className="mt-6 flex border-b">
            <button
              className={`pb-2 px-4 border-b-2 ${
                activeTab === "Activity"
                  ? "border-pink-500 text-pink-600 font-medium"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
              onClick={() => setActiveTab("Activity")}
            >
              Activity
            </button>
            <button
              className={`pb-2 px-4 border-b-2 ${
                activeTab === "Current Markets"
                  ? "border-pink-500 text-pink-600 font-medium"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
              onClick={() => setActiveTab("Current Markets")}
            >
              Current Markets
            </button>
            <button
              className={`pb-2 px-4 border-b-2 ${
                activeTab === "Past Markets"
                  ? "border-pink-500 text-pink-600 font-medium"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
              onClick={() => setActiveTab("Past Markets")}
            >
              Past Markets
            </button>
          </div>

          {/* Tab Content */}
          <div className="mt-4 space-y-2">
            {activeTab === "Current Markets" && (
              <>
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-100 text-gray-700 text-sm uppercase">
                      <th className="p-3 border border-gray-300 text-left">
                        Market ID
                      </th>
                      <th className="p-3 border border-gray-300 text-left">
                        Outcome
                      </th>
                      <th className="p-3 border border-gray-300 text-left">
                        Quantity (XO)
                      </th>
                      <th className="p-3 border border-gray-300 text-left">
                        Market Name
                      </th>
                      <th className="p-3 border border-gray-300 text-left">
                        Description
                      </th>

                      <th className="p-3 border border-gray-300 text-left">
                        Expires At
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {userData?.currentMarket?.length > 0 ? (
                      userData?.currentMarket?.map((curr: any, index: any) => (
                        <tr
                          key={index}
                          className="border-t text-gray-900 text-sm hover:bg-gray-50"
                        >
                          <td className="p-3 border border-gray-300">
                            {curr.market_id}
                          </td>
                          <td className="p-3 border border-gray-300">
                            {curr.outcome === 0 ? "Yes" : "No"}
                          </td>
                          <td className="p-3 border border-gray-300">
                            {parseFloat(curr.quantity) / 1e18} XO
                          </td>
                          <td className="p-3 border border-gray-300 font-semibold">
                            {curr.market_name}
                          </td>
                          <td className="p-3 border border-gray-300">
                            {curr.market_description}
                          </td>

                          <td className="p-3 border border-gray-300">
                            {new Date(
                              parseInt(curr.expires_at) * 1000
                            ).toLocaleString()}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <p className="text-black">No Data Available</p>
                    )}
                  </tbody>
                </table>
              </>
            )}
            {activeTab === "Past Markets" && (
              <>
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-100 text-gray-700 text-sm uppercase">
                      <th className="p-3 border border-gray-300 text-left">
                        Market ID
                      </th>
                      <th className="p-3 border border-gray-300 text-left">
                        User Outcome
                      </th>

                      <th className="p-3 border border-gray-300 text-left">
                        Quantity (XO)
                      </th>

                      <th className="p-3 border border-gray-300 text-left">
                        Market Name
                      </th>
                      <th className="p-3 border border-gray-300 text-left">
                        Description
                      </th>

                      <th className="p-3 border border-gray-300 text-left">
                        Expired At
                      </th>
                      <th className="p-3 border border-gray-300 text-left">
                        Status
                      </th>
                    
                    </tr>
                  </thead>
                  <tbody>
                    {userData?.pastMarket?.length > 0 ? (
                      userData?.pastMarket?.map((past: any, index: any) => (
                        <tr
                          key={index}
                          className="border-t text-gray-900 text-sm hover:bg-gray-50"
                        >
                          <td className="p-3 border border-gray-300">
                            {past?.market_id}
                          </td>
                          <td className="p-3 border border-gray-300">
                            {past?.user_outcome === 0 ? "Yes" : "No"}
                          </td>

                          <td className="p-3 border border-gray-300">
                            {parseFloat(past?.quantity) / 1e18} Shares
                          </td>

                          <td className="p-3 border border-gray-300 font-semibold">
                            {past?.market_name}
                          </td>
                          <td className="p-3 border border-gray-300">
                            {past?.market_description}
                          </td>

                          <td className="p-3 border border-gray-300">
                            {new Date(
                              parseInt(past?.expired_at) * 1000
                            ).toLocaleString()}
                          </td>
                         
                          <td className="p-3 border border-gray-300">
                            {past?.is_claimable && !past?.is_redeemed ? (
                              <button
                                onClick={() => handleRedeem(past?.market_id)}
                                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
                              >
                                Claim
                              </button>
                            ) : !past?.is_claimable && !past?.is_redeemed ? (
                              <span className="text-red-500">Lost</span>
                            ) : (
                              <span className="text-green-500">Won</span>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <p className="text-black">No Data Available</p>
                    )}
                  </tbody>
                </table>
              </>
            )}
            {activeTab === "Activity" && (
              <>
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-100 text-gray-700 text-sm uppercase">
                      <th className="p-3 border border-gray-300 text-left">
                        Action
                      </th>

                      <th className="p-3 border border-gray-300 text-left">
                        Market ID
                      </th>
                      <th className="p-3 border border-gray-300 text-left">
                        Quantity
                      </th>
                      <th className="p-3 border border-gray-300 text-left">
                        Timestamp
                      </th>
                      <th className="p-3 border border-gray-300 text-left">
                        Transaction Hash
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {userData?.activity?.length > 0 ? (
                      userData?.activity?.map((act: any, index: any) => (
                        <tr
                          key={index}
                          className="border-t text-gray-900 text-sm hover:bg-gray-50"
                        >
                          <td className="p-3 border border-gray-300">
                            {act.action}
                          </td>

                          <td className="p-3 border border-gray-300">
                            {act.market_id}
                          </td>
                          <td className="p-3 border border-gray-300">
                            {parseFloat(act.quantity) / 1e18} Shares
                          </td>
                          <td className="p-3 border border-gray-300">
                            {new Date(parseInt(act.timestamp)).toLocaleString()}
                          </td>
                          <td className="p-3 border border-gray-300 text-blue-600">
                            <a
                              href={`https://etherscan.io/tx/${act.txn_hash}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="underline"
                            >
                              {act.txn_hash.slice(0, 10)}...
                            </a>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <p className="text-black">No Data Available</p>
                    )}
                  </tbody>
                </table>
              </>
            )}
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Dashboard;
