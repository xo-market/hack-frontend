import { useState } from "react";
interface ProvideTabProps {
  changeNextTab: () => void;
  changePreviousTab: () => void;
}
export const ProvideTab: React.FC<ProvideTabProps> = ({
  changeNextTab,
  changePreviousTab,
}) => {
  const [reward, setReward] = useState(""); // Default reward

  return (
    <>
      <div className="mt-4 w-1/2">
        <label className="text-gray-700 text-sm">Seed your market</label>
        <input
          type="text"
          defaultValue="2000 XO USDC"
          className="w-full border border-gray-300 rounded-md p-2 mt-1"
        />
      </div>

      {/* Slider */}
      <div className="mt-6 w-1/2">
        <label className="text-gray-700 text-sm">Creator Reward</label>
        <div className="flex items-center space-x-2">
          <input
            type="range"
            min="0"
            max="2"
            step="0.1"
            value={reward}
            onChange={(e) => setReward(e.target.value)}
            className="w-full"
          />
          <span className="text-gray-600 text-sm">{reward}%</span>
        </div>
        <p className="text-gray-400 text-sm">Market creator share of market</p>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-end gap-4 mt-6">
        <button
          onClick={changePreviousTab}
          className="text-gray-600 font-medium flex items-center space-x-1"
        >
          <span>← Previous</span>
        </button>
        <button
          onClick={changeNextTab}
          className="text-gray-600 font-medium flex items-center space-x-1"
        >
          <span>Next</span> →
        </button>
      </div>
    </>
  );
};
