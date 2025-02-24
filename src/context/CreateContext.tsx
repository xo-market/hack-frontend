import React, { createContext, useState, useContext } from "react";
const CreateContext = createContext<any>(null);

export const CreateProvider = ({ children }: { children: React.ReactNode }) => {
  const [tab, setTab] = useState("start");
  const [image, setImage] = useState(null);
  const [createData, setCreateData] = useState({
    url: "",
    param: "",
    value: "",
    endDate: "",
    category: "",
    seed: "",
    reward: "",
  });

  const handleOnChange = (e: any) => {
    e.preventDefault();
    let name = e.target.name;
    let value = e.target.value;
    setCreateData((prev) => ({ ...prev, [name]: value }));
  };

  const createMarket = () => {
    console.log(createData);
    console.log(image);
  };

  const changeTab = (newTab: string) => setTab(newTab);
  const changeNextTab = () => {
    const tabs = ["start", "define", "provide", "review"];
    const index = tabs.indexOf(tab);
    if (index < tabs.length - 1) setTab(tabs[index + 1]);
  };
  const changePreviousTab = () => {
    const tabs = ["start", "define", "provide", "review"];
    const index = tabs.indexOf(tab);
    if (index > 0) setTab(tabs[index - 1]);
  };

  return (
    <CreateContext.Provider
      value={{
        tab,
        createData,
        image,
        setImage,
        handleOnChange,
        createMarket,
        changeTab,
        changeNextTab,
        changePreviousTab,
      }}
    >
      {children}
    </CreateContext.Provider>
  );
};

export const useCreateContext = () => useContext(CreateContext);
