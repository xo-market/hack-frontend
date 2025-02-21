"use client";
import React, { useState, useEffect, ReactNode } from "react";
import { useAccount,useChainId } from "wagmi";
import { useEthersSigner } from "@/utils/signer";
import { ethers, BigNumber, Contract } from "ethers";
import { Addresses, tokenAbi } from "@/constant";
// Context types
interface DataContextProps {
  getTokenBalance: () => Promise<BigNumber>;
  formatTimestamp: (timestamp: number) => string;
  tokenBalance: BigNumber | number;
}

interface DataContextProviderProps {
  children: ReactNode;
}

// Context initialization
const DataContext = React.createContext<DataContextProps | undefined>(
  undefined
);

const DataContextProvider: React.FC<DataContextProviderProps> = ({
  children,
}) => {
  const [tokenBalance, setTokenBalance] = useState<BigNumber | number>(0);
  const { address, chain } = useAccount();
  const [activeChain, setActiveChainId] = useState<number | undefined>(
      chain?.id
    );
  useEffect(() => {
    setActiveChainId(chain?.id);
  }, [chain?.id]);

  const signer = useEthersSigner({ chainId: activeChain });

  const getContractInstance = async (
    contractAddress: string,
    contractAbi: any
  ): Promise<Contract | undefined> => {
    try {
      const contractInstance = new ethers.Contract(
        contractAddress,
        contractAbi,
        signer
      );
      return contractInstance;
    } catch (error) {
      console.log("Error in deploying contract");
      return undefined;
    }
  };

  const getTokenBalance = async () => {
    
    try {
      if(!activeChain) return BigNumber.from(0);
      const tokenContract = await getContractInstance(
        Addresses[activeChain]?.tokenAddress,
        tokenAbi
      );
      if (tokenContract) {
        let balance = await tokenContract.balanceOf(address);
        setTokenBalance(balance.div(BigNumber.from(10).pow(18)).toString());
        console.log("Token balance", balance);
        return balance;
      }
    } catch (error) {
      console.log("Error in getting token balance",error);
      return BigNumber.from(0);
    }
  };

  useEffect(() => {
    if (!signer) return;
    getTokenBalance();
  }, [signer,address,activeChain]);

  function formatTimestamp(timestamp: number) {
    const date = new Date(timestamp * 1000); // Convert to milliseconds
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
  }

  return (
    <DataContext.Provider
      value={{
        getTokenBalance,
        formatTimestamp,
        tokenBalance,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useDataContext = () => {
  const context = React.useContext(DataContext);
  if (context === undefined) {
    throw new Error("useDataContext must be used within a DataContextProvider");
  }
  return context;
};

export default DataContextProvider;
