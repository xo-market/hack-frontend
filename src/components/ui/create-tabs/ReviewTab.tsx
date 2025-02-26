import Image from "next/image";
import { useCreateContext } from "@/context/CreateContext";
export const ReviewTab: React.FC = () => {
  const { createData, image, createMarket } = useCreateContext();
  return (
    <>
      <div className="grid grid-cols-2 gap-4 mt-6">
        {/* Post Preview */}
        <div className="rounded-lg p-2 flex justify-center items-center border">
          <Image
            src={image ? image : "/images/placeholder.png"}
            alt="Post Preview"
            className="w-full h-auto rounded"
            width={150}
            height={150}
          />
        </div>

        {/* Market Info */}
        <div className="space-y-8">
          <div>
            <label className="text-gray-700 text-md mb-2">Url</label>
            <input
              type="text"
              value={createData?.url ? createData?.url : "N/A"}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-md"
              disabled
            />
          </div>
          <div>
            <label className="text-gray-700 text-md mb-2">Start Date</label>
            <input
              type="text"
              value={createData?.startDate ? createData?.startDate : "N/A"}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-md"
              disabled
            />
          </div>
          <div>
            <label className="text-gray-700 text-md mb-2">End Date</label>
            <input
              type="text"
              value={createData?.endDate ? createData?.endDate : "N/A"}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-md"
              disabled
            />
          </div>

          <div>
            <label className="text-gray-700 text-md mb-2">Category</label>
            <input
              type="text"
              value={createData?.category ? createData?.category : "N/A"}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-md"
              disabled
            />
          </div>
        </div>
      </div>

      {/* Dropdowns & Inputs */}
      <div className="grid grid-cols-2 gap-8 mt-6">
        <div>
          <label className="text-gray-700 text-md mb-2">Parameter</label>
          <input
            type="text"
            value={createData?.param ? createData?.param : "N/A"}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-md"
            disabled
          />
        </div>
        <div>
          <label className="text-gray-700 text-md mb-2">Parameter Value</label>
          <input
            type="text"
            value={createData?.value ? createData?.value : "N/A"}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-md"
            disabled
          />
        </div>

        <div>
          <label className="text-gray-700 text-md mb-2">Rewards Set</label>
          <input
            type="text"
            value={createData?.reward ? createData?.reward : "N/A"}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-md"
            disabled
          />
        </div>
        <div>
          <label className="text-gray-700 text-md mb-2">Seed Value</label>
          <input
            type="text"
            value={createData?.seed ? createData?.seed : "N/A"}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-md"
            disabled
          />
        </div>
        {/* <div>
          <label className="text-gray-700 text-md mb-2">Write a value</label>
          <input
            type="text"
            value="100"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-md"
            disabled
          />
        </div> */}
      </div>

      {/* Confirm Button */}
      <div className="mt-6">
        <button
          onClick={createMarket}
          className="bg-pink-500 text-white py-2 w-full rounded-md font-medium"
        >
          Confirm
        </button>
      </div>
    </>
  );
};
