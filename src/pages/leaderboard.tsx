"use client";
import Layout from "@/components/layout/Layout";
import React from "react";

const Leaderboard: React.FC = () => {
  const data = [
    {
      rank: 1,
      xoPoints: 4654,
      user: "0xA58e.....e5C7",
      wins: 40,
      losses: 8,
      sold: "100K xoUSDC",
      markets: 15,
      pnl: "104,577",
    },
    {
      rank: 2,
      xoPoints: 3253,
      user: "0xA78e.....e2C1",
      wins: 25,
      losses: 10,
      sold: "100K xoUSDC",
      markets: 24,
      pnl: "87,451",
    },
    {
      rank: 3,
      xoPoints: 2546,
      user: "0xA78e.....e4C9",
      wins: 22,
      losses: 18,
      sold: "100K xoUSDC",
      markets: 4,
      pnl: "70,457",
    },
    {
      rank: 4,
      xoPoints: 1256,
      user: "0xA45e.....e8C3",
      wins: 10,
      losses: 20,
      sold: "100K xoUSDC",
      markets: 2,
      pnl: "65,784",
    },
  ];
  return (
    <Layout>
      <div className="p-6 bg-white rounded-lg">
        <h2 className="text-xl font-semibold text-gray-900">Leaderboard</h2>
        <p className="text-gray-500 text-sm mb-4">
          Improve your ranking by creating and winning markets.
        </p>
        <div className="flex space-x-4 border-b">
          <button className="pb-2 border-b-2 border-pink-500 text-pink-600 font-medium">
            All
          </button>
          <button className="pb-2 text-gray-500 hover:text-gray-700">
            Past Week
          </button>
          <button className="pb-2 text-gray-500 hover:text-gray-700">
            Past Month
          </button>
        </div>
        <div className="overflow-x-auto mt-4">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-700 text-sm uppercase">
                <th className="p-3 text-left">Rank</th>
                <th className="p-3 text-left">xoPoints</th>
                <th className="p-3 text-left">User</th>
                <th className="p-3 text-left">Wins</th>
                <th className="p-3 text-left">Losses</th>
                <th className="p-3 text-left">Sold</th>
                <th className="p-3 text-left">Markets</th>
                <th className="p-3 text-left">PNL</th>
              </tr>
            </thead>
            <tbody>
              {data.map((player, index) => (
                <tr
                  key={index}
                  className="border-t text-gray-900 text-sm hover:bg-gray-50"
                >
                  <td className="p-3">{player.rank}</td>
                  <td className="p-3">{player.xoPoints}</td>
                  <td className="p-3 text-blue-600">{player.user}</td>
                  <td className="p-3 font-semibold">{player.wins}</td>
                  <td className="p-3">{player.losses}</td>
                  <td className="p-3">{player.sold}</td>
                  <td className="p-3">{player.markets}</td>
                  <td className="p-3 text-red-600 font-bold">{player.pnl}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default Leaderboard;
