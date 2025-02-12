interface DefineTabProps {
  changeNextTab: () => void;
  changePreviousTab: () => void;
}
export const DefineTab: React.FC<DefineTabProps> = ({
  changeNextTab,
  changePreviousTab,
}) => {
  return (
    <>
      <div className="grid grid-cols-2 gap-8 mt-4">
        <div>
          <label className="text-gray-700 text-md">
            What are you betting on?
          </label>
          <select className="w-full border border-gray-300 rounded-md px-2 py-3 mt-2">
            <option>Likes</option>
            <option>Shares</option>
            <option>Comments</option>
          </select>
        </div>
        <div>
          <label className="text-gray-700 text-md">Write a value</label>
          <input
            type="number"
            className="w-full border border-gray-300 rounded-md px-2 py-3 mt-2"
            defaultValue="1000"
          />
        </div>
        <div>
          <label className="text-gray-700 text-md">Bet End Date</label>
          <input
            type="date"
            className="w-full border border-gray-300 rounded-md px-2 py-3 mt-2"
            defaultValue="28/02/2025 23:59 GMT"
            readOnly
          />
        </div>
        <div>
          <label className="text-gray-700 text-md">Market categories</label>
          <select className="w-full border border-gray-300 rounded-md px-2 py-3 mt-2">
            <option>Tech</option>
          </select>
        </div>
        <div className="col-span-2">
          <label className="text-gray-700 text-md">Market Tags</label>
          <div className="flex space-x-2 mt-1">
            <div className="bg-green-100 text-green-600 text-xs px-3 py-1 rounded-md">
              XO
            </div>
            <div className="bg-purple-100 text-purple-600 text-xs px-3 py-1 rounded-md">
              Forecaster
            </div>
          </div>
        </div>
      </div>

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
