import { useState } from "react";
interface ReviewTabProps {
}
export const ReviewTab: React.FC<ReviewTabProps> = ({
}) => {
  const [marketFactor, setMarketFactor] = useState("Likes");
  const [category, setCategory] = useState("Tech");
  const [seedLiquidity, setSeedLiquidity] = useState("2000 USDC");
  const [value, setValue] = useState(1000);
  const [tags, setTags] = useState("Eth, Web3, Future");
  const [creatorReward, setCreatorReward] = useState("2%");

  return (
    <>
      <div className="grid grid-cols-2 gap-4 mt-6">
        {/* Post Preview */}
        <div className="border rounded-lg p-2">
          <img
            src="https://via.placeholder.com/150"
            alt="Post Preview"
            className="w-full h-auto rounded"
          />
          <p className="text-md text-gray-700 mt-2">
            Over the years, I’ve had countless conversations with friends,
            family, investors...
          </p>
        </div>

        {/* Market Info */}
        <div className="space-y-8">
          <input
            type="text"
            value="https://linkedin.com/elzabithkok/post4943948489"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-md"
            disabled
          />
          <input
            type="text"
            value="28/02/2025 23:59 GMT"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-md"
            disabled
          />
          <input
            type="text"
            value="XO USDC"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-md"
            disabled
          />
        </div>
      </div>

      {/* Dropdowns & Inputs */}
      <div className="grid grid-cols-2 gap-8 mt-6">
        <select
          value={marketFactor}
          onChange={(e) => setMarketFactor(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-md"
        >
          <option>Likes</option>
          <option>Shares</option>
          <option>Comments</option>
        </select>

        <input
          type="text"
          value={value}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-md"
          disabled
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-md"
        >
          <option>Tech</option>
          <option>Finance</option>
          <option>Gaming</option>
        </select>

        <input
          type="text"
          value={tags}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-md"
          disabled
        />

        <select
          value={seedLiquidity}
          onChange={(e) => setSeedLiquidity(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-md"
        >
          <option>2000 USDC</option>
          <option>5000 USDC</option>
          <option>10000 USDC</option>
        </select>

        <input
          type="text"
          value={creatorReward}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-md"
          disabled
        />
      </div>

      {/* Confirm Button */}
      <div className="mt-6">
        <button className="bg-pink-500 text-white py-2 w-full rounded-md font-medium">
          Confirm
        </button>
      </div>
    </>
  );
};
