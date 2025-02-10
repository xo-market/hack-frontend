import Layout from "@/components/layout/Layout";
import React, { useState, useEffect, useMemo } from "react";

const Create: React.FC = () => {
  const [tab, setTab] = useState("start");
  const changeTab = (tab: string) => {
    setTab(tab);
  };

  return (
    <>
      <Layout>
        <div className="mx-auto max-w-screen-xl bg-white flex justify-center mt-4">
          <div className="bg-white py-2 px-3">
            <nav className="flex flex-wrap gap-4">
              <button
                onClick={() => changeTab("start")}
                className="inline-flex whitespace-nowrap border-b-2 border-transparent py-2 px-3 text-sm font-medium text-[#E84871] focus:border-b-[#E84871] focus:text-[#E84871] transition-all duration-200 ease-in-out hover:border-b-[#E84871] hover:text-[#E84871]"
              >
                Start
              </button>

              <button
                onClick={() => changeTab("define")}
                className="inline-flex whitespace-nowrap border-b-2 border-transparent py-2 px-3 text-sm font-medium text-gray-600 focus:text-[#E84871] focus:border-b-[#E84871] transition-all duration-200 ease-in-out hover:border-b-[#E84871] hover:text-[#E84871]"
              >
                Define
              </button>

              <button
                onClick={() => changeTab("resolve")}
                className="inline-flex whitespace-nowrap border-b-2 border-transparent text-gray-600 py-2 px-3 text-sm font-semibold focus:text-[#E84871] focus:border-b-[#E84871] transition-all duration-200 ease-in-out"
              >
                Resolve
              </button>

              <button
                onClick={() => changeTab("provide")}
                className="inline-flex whitespace-nowrap border-b-2 border-transparent py-2 px-3 text-sm font-medium text-gray-600 focus:text-[#E84871] focus:border-b-[#E84871] transition-all duration-200 ease-in-out hover:border-b-[#E84871] hover:text-[#E84871]"
              >
                Provide
              </button>

              <button
                onClick={() => changeTab("review")}
                className="inline-flex whitespace-nowrap border-b-2 border-transparent py-2 px-3 text-sm font-medium text-gray-600 focus:text-[#E84871] focus:border-b-[#E84871] transition-all duration-200 ease-in-out hover:border-b-[#E84871] hover:text-[#E84871]"
              >
                Review
              </button>
            </nav>
          </div>
        </div>
        <div className="w-screen">
          <div className="max-w-screen-xl px-2 py-10 border text-black">
            {tab==="start" && <p>Start</p>}
            {tab==="define" && <p>Define</p>}
            {tab==="resolve" && <p>Resolve</p>}
            {tab==="provide" && <p>Provide</p>}
            {tab==="review" && <p>Review</p>}
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Create;
