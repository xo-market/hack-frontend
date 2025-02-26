import React, { createContext, useState, useContext } from "react";
import { toast } from "react-toastify";
import { useDataContext } from "./DataContext";
const CreateContext = createContext<any>(null);

export const CreateProvider = ({ children }: { children: React.ReactNode }) => {
const {createFarcasterMarket} = useDataContext();
  const [tab, setTab] = useState("start");
  const [image, setImage] = useState(null);
  const [formData, setFormData] = useState(null);
  const [createData, setCreateData] = useState({
    url: "",
    param: "",
    value: "",
    endDate: "",
    startDate:"",
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

  const createMarket = async () => {
    if(!createData.url || !createData.param || !createData.value || !createData.endDate || !createData.category || !createData.seed || !createData.reward || !image) {
        toast.error("Please fill all the fields");
        return;
    }

    await createFarcasterMarket(createData,image,formData);
    
   
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
        setFormData
      }}
    >
      {children}
    </CreateContext.Provider>
  );
};

export const useCreateContext = () => useContext(CreateContext);
