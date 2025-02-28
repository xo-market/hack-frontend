"use client";
import Layout from "@/components/layout/Layout";
import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { useDataContext } from "@/context/DataContext";
import { useAccount } from "wagmi";
const Dashboard: React.FC = () => {
  const { getUserData, tokenBalance } = useDataContext();
  const [userData, setUserData] = useState();
  const { address } = useAccount();
  const [activeTab, setActiveTab] = useState("Activity");
  useEffect(() => {
    (async () => {
      let res = await getUserData();
      console.log(res, "res");
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

          {/* Claim Points Button */}
          <div className="mt-4 flex justify-end">
            <button className="px-4 py-2 bg-pink-500 text-white rounded">
              Claim Points
            </button>
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
          </div>

          {/* Tab Content */}
          <div className="mt-4 space-y-2">
            {activeTab === "Current Markets" && (
              <p className="text-gray-600">
                📈 Current markets data goes here...
              </p>
            )}
            {activeTab === "Past Markets" && (
              <p className="text-gray-600">📉 Past markets data goes here...</p>
            )}
            {activeTab === "Activity" && (
              <>
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Name
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Title
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Role
                      </th>
                      <th scope="col" className="relative px-6 py-3">
                        <span className="sr-only">Edit</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="ml-0">
                            <div className="text-sm font-medium text-gray-900">
                              004232...iuhww
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          Regional Paradigm Technician
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Active
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        Admin
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <a
                          href="#"
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Claim
                        </a>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="ml-0">
                            <div className="text-sm font-medium text-gray-900">
                              Cody Fisher
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          Product Directives Officer
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          Pending
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        Editor
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <a
                          href="#"
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Claim
                        </a>
                      </td>
                    </tr>
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
