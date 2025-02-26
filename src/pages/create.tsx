"use client";
import React from "react";
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
    </>
  );
};

export default Create;
