"use client";
import Layout from "@/components/layout/Layout";
import { useDataContext } from "@/context/DataContext";
import React, { useEffect, useState } from "react";
import numeral from "numeral"
const Leaderboard: React.FC = () => {
  const {getLeaderBoardData} = useDataContext();
  const [leaderBoardData,setLeaderBoardData] = useState();
  useEffect(()=>{
    (async()=>{
      let res = await getLeaderBoardData();
      setLeaderBoardData(res?.data);
    })()
  },[])

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
          
                <th className="p-3 text-left">User</th>
                <th className="p-3 text-left">Wins</th>
                <th className="p-3 text-left">Losses</th>
                <th className="p-3 text-left">Markets</th>
                <th className="p-3 text-left">Volume</th>
                <th className="p-3 text-left">Pts</th>
              </tr>
            </thead>
            <tbody>
              {leaderBoardData && leaderBoardData?.map((player:any, index:any) => (
                <tr
                  key={index}
                  className="border-t text-gray-900 text-sm hover:bg-gray-50"
                >
                  <td className="p-3">{index + 1}</td>
        
                  <td className="p-3 text-blue-600">{player?.user_address}</td>
                  <td className="p-3 font-semibold">{numeral(player?.wins).format('0.0a')}</td>
                  <td className="p-3">{numeral(player?.losses).format('0.0a')}</td>
                  <td className="p-3">{numeral(player?.markets).format('0.0a')}</td>
                  <td className="p-3">{numeral(player?.total_volume).format('0.0a')}</td>
                  <td className="p-3 text-red-600 font-bold">{numeral(player?.points).format('0.0a')}</td>
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
