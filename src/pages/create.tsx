"use client";
import React, { useState, useEffect, useMemo } from "react";
import StartTab from "@/components/ui/create-tabs/StartTab";
import { DefineTab } from "@/components/ui/create-tabs/DefineTab";
import { ProvideTab } from "@/components/ui/create-tabs/ProvideTab";
import { ReviewTab } from "@/components/ui/create-tabs/ReviewTab";
import { CreateProvider, useCreateContext } from "@/context/CreateContext";

const CreateComponent: React.FC = () => {
  const { tab, changeTab } = useCreateContext();
  return (
    <div className="container mx-auto flex justify-center items-center h-[100vh]">
      <div className="border border-red-300 rounded-lg p-4 w-1/2 mx-auto">
        <div className="flex space-x-8 border-b border-red-300 pb-2">
          {["start", "define", "provide", "review"].map((t) => (
            <button
              key={t}
              onClick={() => changeTab(t)}
              className={`${
                tab === t
                  ? "text-red-500 border-b-2 border-red-500"
                  : "text-gray-400"
              } font-medium px-2`}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {tab === "start" && <StartTab />}
        {tab === "define" && <DefineTab />}
        {tab === "provide" && <ProvideTab />}
        {tab === "review" && <ReviewTab />}
      </div>
    </div>
  );
};
const Create: React.FC = () => {
  return (
    <>
      <CreateProvider>
        <CreateComponent />
      </CreateProvider>
      {/* <div className="container mx-auto flex justify-center items-center h-[100vh]">
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

          {tab === "start" && (
            <StartTab
              handleOnChange={handleOnChange}
              changeNextTab={changeNextTab}
              createData={createData}
            />
          )}
          {tab === "define" && (
            <DefineTab
              changeNextTab={changeNextTab}
              changePreviousTab={changePreviousTab}
              handleOnChange={handleOnChange}
              setImage={setImage}
              image={image}
              createData={createData}
            />
          )}
          {tab === "provide" && (
            <ProvideTab
              changeNextTab={changeNextTab}
              changePreviousTab={changePreviousTab}
              handleOnChange={handleOnChange}
              createData={createData}
            />
          )}
          {tab === "review" && <ReviewTab createMarket={createMarket}  image={image} createData={createData} />}
        </div>
      </div> */}
    </>
  );
};

export default Create;
