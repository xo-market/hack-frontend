"use client";
import Layout from "@/components/layout/Layout";
import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
const Dashboard: React.FC = () => {
  return (
    <>
      <Layout>
        <div className="p-6 bg-white rounded-lg w-full max-w-4xl mx-auto">
          {/* Profile Section */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-24 h-24 bg-pink-400 rounded-full"></div>
              <div className="absolute bottom-1 right-1 bg-black p-1 rounded-full">
                <Image src="https://avatars.githubusercontent.com/u/82640789?v=4" alt="Edit" className="w-4 h-4" width={10} height={10} />
              </div>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                0xA58e.....e5C7
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
              <p className="font-semibold text-black">0xA58e..e5C</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Rank</p>
              <p className="font-semibold text-black">1,548</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Balance</p>
              <p className="font-semibold text-black">0 xoUSDC</p>
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
          <div className="mt-6 flex space-x-4">
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
            <button className="pb-2 px-4 border-b-2 border-transparent text-gray-600 hover:text-gray-900">
              Current Markets
            </button>
            <button className="pb-2 px-4 border-b-2 border-transparent text-gray-600 hover:text-gray-900">
              Past Markets
            </button>
            <button className="pb-2 px-4 border-b-2 border-pink-500 text-pink-600 font-medium">
              Activity
            </button>
          </div>

          {/* Activity List */}
          <div className="mt-4 space-y-2">
            <p className="text-gray-600 space-x-8">
              You purchased{" "}
              <span className="text-green-600 font-semibold">2000 0:Yes</span>{" "}
              shares of{" "}
              <span className="text-blue-600 font-medium">
                1K Likes or above by end of Feb.
              </span>{" "}
              <span className="text-gray-500 text-sm">Now</span>
            </p>
            <p className="text-gray-600 space-x-8">
              You won{" "}
              <span className="text-green-600 font-semibold">10 xoUSDC</span>{" "}
              from{" "}
              <span className="text-blue-600 font-medium">
                1K Likes or above by end of Jan.
              </span>{" "}
              <span className="text-pink-600 font-medium cursor-pointer">
                Claim Wins
              </span>{" "}
              <span className="text-gray-500 text-sm">10 days ago</span>
            </p>
            <p className="text-gray-600 space-x-8">
              You lost{" "}
              <span className="text-red-600 font-semibold">10 xoUSDC</span> from{" "}
              <span className="text-blue-600 font-medium">
                1K Likes or above by end of Dec.
              </span>{" "}
              <span className="text-pink-600 font-medium cursor-pointer">
                Declare Losses
              </span>{" "}
              <span className="text-gray-500 text-sm">12 days ago</span>
            </p>
            <p className="text-gray-600 space-x-8">
              You created a market:{" "}
              <span className="text-blue-600 font-medium">
                1K Likes or above by end of Dec.
              </span>{" "}
              <span className="text-gray-500 text-sm">20 days ago</span>
            </p>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Dashboard;
