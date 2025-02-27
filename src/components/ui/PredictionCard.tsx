import Link from "next/link";
import React from "react";
import Image from "next/image";
import { useDataContext } from "@/context/DataContext";
interface PredictionCardProps {
  data: any;
  onClick: () => void;
}

const PredictionCard: React.FC<PredictionCardProps> = ({ data, onClick }) => {
  const { formatTimestamp } = useDataContext();
  const checkExpiration = (expirationTimestamp: number) => {
    const currentTime = Math.floor(Date.now() / 1000); // Convert to seconds
    return currentTime >= expirationTimestamp;
  };
  return (
    <>
      <Link href={`/prediction/${data?.market_id}`}>
        <div className="border border-pink-300 rounded-xl p-4  shadow-lg">
          <div className="flex gap-2 mb-2 border-b border-red-300 py-2">
            {data?.tags.map((tag: string, index: number) => (
              <span
                key={index}
                className="bg-pink-200 text-pink-600 text-xs px-3 py-1 rounded-full font-semibold"
              >
                {tag}
              </span>
            ))}
            <span className="bg-pink-200 uppercase text-[#198778] text-xs px-3 py-1 rounded-full font-semibold">
              {data?.category}
            </span>
            <div className="flex justify-content-end">
              {checkExpiration(data?.expires_at) ? <p>🟢</p> : <p>🔴</p>}
            </div>
          </div>

          <div className="border border-pink-300 object-cover rounded-lg justify-center items-center flex overflow-hidden mt-4">
            <Image
              src={
                data?.image
                  ? data?.image
                  : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTdWbSawA3GEvIqk54-RJTyKllWJPfh4RjrDQ&s"
              }
              alt="Market Image"
              className="w-[100%] h-[30vh]  "
              width={200} // Fixed width
              height={128} // Fixed height
            />
          </div>

          <p className="font-bold text-black text-lg text-center mt-3">
            {data?.description}
          </p>

          <div className="flex items-center gap-2 mt-3">
            <span className="text-green-500 text-xs">
              {Number(data?.yesPercentage).toFixed(2)}%
            </span>
            <div className="flex-1 h-2 bg-gray-200 rounded-full relative">
              <div
                className="absolute top-0 left-0 h-full bg-green-500 rounded-full rounded-r-none"
                style={{ width: `${Number(data?.yesPercentage).toFixed(2)}%` }}
              ></div>
              <div
                className="absolute top-0 right-0 h-full bg-red-500 rounded-full rounded-l-none"
                style={{ width: `${Number(data?.noPercentage).toFixed(2)}%` }}
              ></div>
            </div>
            <span className="text-pink-500 text-xs">
              {Number(data?.noPercentage).toFixed(2)}%
            </span>
          </div>

          <div className="flex justify-center mt-3 gap-4">
            <button
              className={`bg-green-100 text-green-600 px-2 py-2 rounded-lg font-semibold w-1/3`}
            >
              Yes
            </button>
            <button
              className={`bg-pink-100 text-pink-600 px-2 py-2 rounded-lg font-semibold w-1/3`}
            >
              No
            </button>
          </div>

          <div className="flex items-center text-xs text-gray-600 mt-6">
            <span className="flex items-center">
              Starts : <br /> {formatTimestamp(data?.starts_at)}
            </span>
            <span className="flex items-center ml-6">
              End : <br /> {formatTimestamp(data?.expires_at)}
            </span>
            <span className="ml-auto text-pink-500 font-semibold">
              {data?.creator.slice(0, 5) + "..." + data?.creator.slice(-5)}
            </span>
          </div>
        </div>
      </Link>
    </>
  );
};

export default PredictionCard;
