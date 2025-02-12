import Layout from "@/components/layout/Layout";
import React, { useState, useEffect, useMemo } from "react";
import StartTab from "@/components/ui/create-tabs/StartTab";
import {DefineTab} from "@/components/ui/create-tabs/DefineTab";
import { ProvideTab } from "@/components/ui/create-tabs/ProvideTab";
import { ReviewTab } from "@/components/ui/create-tabs/ReviewTab";
const Create: React.FC = () => {
  const [tab, setTab] = useState("start");
  const changeTab = (tab: string) => {
    setTab(tab);
  };

  const changeNextTab = () => {
    if (tab === "start") {
      setTab("define");
    } else if (tab === "define") {
      setTab("provide");
    } else if (tab === "provide") {
      setTab("review");
    }
  };

  const changePreviousTab = () => {
    if (tab === "define") {
      setTab("start");
    } else if (tab === "provide") {
      setTab("define");
    } else if (tab === "review") {
      setTab("provide");
    }
  };

  return (
    <>
      <div className="container mx-auto flex justify-center items-center h-[100vh]">
        <div className="border border-red-300 rounded-lg p-4 w-1/2 mx-auto">
          <div className="flex space-x-8 border-b border-red-300 pb-2">
            <button
              onClick={() => changeTab("start")}
              className="text-red-500 font-medium border-b-2 border-red-500 px-2"
            >
              Start
            </button>
            <button
              onClick={() => changeTab("define")}
              className="text-gray-400 font-medium"
            >
              Define
            </button>
            <button
              onClick={() => changeTab("provide")}
              className="text-gray-400 font-medium"
            >
              Provide
            </button>
            <button
              onClick={() => changeTab("review")}
              className="text-gray-400 font-medium"
            >
              Review
            </button>
          </div>

          {tab === "start" && <StartTab changeNextTab={changeNextTab} />}
          {tab === "define" && (
            <DefineTab
              changeNextTab={changeNextTab}
              changePreviousTab={changePreviousTab}
            />
          )}
          {tab === "provide" && (
            <ProvideTab
              changeNextTab={changeNextTab}
              changePreviousTab={changePreviousTab}
            />
          )}
          {tab === "review" && (
            <ReviewTab
        
            />
          )}
        </div>
      </div>
    </>
  );
};

export default Create;
