"use client";
import React, { useState, useEffect, ReactNode } from "react";
import { useAccount, useChainId } from "wagmi";
import { useEthersSigner } from "@/utils/signer";
import { ethers, BigNumber, Contract } from "ethers";
import {toast} from "react-hot-toast";
import {
  Addresses,
  CollateralTokenABI,
  NFTABI,
  MultiOutcomeMarketABI,
} from "@/constant";
// Context types
interface DataContextProps {
  getTokenBalance: () => Promise<BigNumber>;
  formatTimestamp: (timestamp: number) => string;
  tokenBalance: BigNumber | number;
  createMarket: (
    _startsAt: number,
    _expiresAt: number,
    _collateralToken: string,
    _initialCollateral: number,
    _creatorFeeBps: number,
    _outcomeCount: number,
    _resolver: string,
    _metaDataURI: string
  ) => void;
  reviewMarket: (
    _marketId: number,
    _isApproved: boolean,
    _data: string
  ) => void;
  setMarketResolver: (_resolver: string, _isPublicResolver: boolean) => void;
  setMarketResolverFee: (_feeBps: number) => void;
  getMarketResolver: (_resolver: string) => void;
  resolveMarket: (_marketId: number, _winningOutcome: number) => void;
  buyOutcome: (
    _marketId: number,
    _outcome: number,
    _amount: number,
    _maxCost: number
  ) => void;  
  sellOutcome: (
    _marketId: number,
    _outcome: number,
    _amount: number,
    _minReturn: number
  ) => void;
  redeemWinnings: (_marketId: number) => void;
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
  console.log("Signer", activeChain);
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
      if (!activeChain) return BigNumber.from(0);
      const tokenContract = await getContractInstance(
        Addresses[activeChain]?.XOCollateralTokenAddress,
        CollateralTokenABI
      );
      if (tokenContract) {
        let balance = await tokenContract.balanceOf(address);
        setTokenBalance(balance.div(BigNumber.from(10).pow(18)).toString());
        console.log("Token balance", balance);
        return balance;
      }
    } catch (error) {
      console.log("Error in getting token balance", error);
      return BigNumber.from(0);
    }
  };

  const createMarket = async (
    _startsAt: number,
    _expiresAt: number,
    _collateralToken: string,
    _initialCollateral: number,
    _creatorFeeBps: number,
    _outcomeCount: number,
    _resolver: string,
    _metaDataURI: string
  ) => {
    if (!activeChain) return;
    let id = toast.loading("Creating market...");
    const marketContract = await getContractInstance(
      Addresses[activeChain]?.XOMultiOutcomeMarketAddress,
      MultiOutcomeMarketABI
    );
    try {
      if (marketContract) {
        const tx = await marketContract.createMarket(
          _startsAt,
          _expiresAt,
          _collateralToken,
          _initialCollateral,
          _creatorFeeBps,
          _outcomeCount,
          _resolver,
          _metaDataURI
        );
        await tx.wait();
        toast.success("Market created successfully", { id});
      }

    } catch (error) {
      console.log(error);
      toast.error("Error in creating market", { id });
    }
  };

  const reviewMarket = async (
    _marketId: number,
    _isApproved: boolean,
    _data: string
  ) => {
    if (!activeChain) return;
    let id = toast.loading("Reviewing market...");
  
    const marketContract = await getContractInstance(
      Addresses[activeChain]?.XOMultiOutcomeMarketAddress,
      MultiOutcomeMarketABI
    );
  
    try {
      if (marketContract) {
        const tx = await marketContract.reviewMarket(_marketId, _isApproved, _data);
        await tx.wait();
        toast.success("Market Reviewing successfully", { id });
      }
    } catch (error) {
      console.error(error);
      toast.error("Error in Reviewing market", { id });
    }
  };

  const setMarketResolver = async (_resolver: string, _isPublicResolver: boolean) => {
    if (!activeChain) return;
    let id = toast.loading("Setting market resolver...");
  
    const marketContract = await getContractInstance(
      Addresses[activeChain]?.XOMultiOutcomeMarketAddress,
      MultiOutcomeMarketABI
    );
  
    try {
      if (marketContract) {
        const tx = await marketContract.setMarketResolver(_resolver, _isPublicResolver);
        await tx.wait();
        toast.success("Market resolver set successfully", { id });
      }
    } catch (error) {
      console.error(error);
      toast.error("Error in setting market resolver", { id });
    }
  };

  const setMarketResolverFee = async (_feeBps: number) => {
    if (!activeChain) return;
    let id = toast.loading("Setting market resolver fee...");
  
    const marketContract = await getContractInstance(
      Addresses[activeChain]?.XOMultiOutcomeMarketAddress,
      MultiOutcomeMarketABI
    );
  
    try {
      if (marketContract) {
        const tx = await marketContract.setMarketResolverFee(_feeBps);
        await tx.wait();
        toast.success("Market resolver fee set successfully", { id });
      }
    } catch (error) {
      console.error(error);
      toast.error("Error in setting market resolver fee", { id });
    }
  };
  const getMarketResolver = async (_resolver: string) => {
    if (!activeChain) return;
    
    const marketContract = await getContractInstance(
      Addresses[activeChain]?.XOMultiOutcomeMarketAddress,
      MultiOutcomeMarketABI
    );
  
    try {
      if (marketContract) {
        const resolverData = await marketContract.getMarketResolver(_resolver);
        return resolverData; // Returns MarketResolver struct
      }
    } catch (error) {
      console.error("Error fetching market resolver:", error);
      return null;
    }
  };

  const resolveMarket = async (_marketId: number, _winningOutcome: number) => {
    if (!activeChain) return;
  
    let id = toast.loading("Resolving market...");
    
    const marketContract = await getContractInstance(
      Addresses[activeChain]?.XOMultiOutcomeMarketAddress,
      MultiOutcomeMarketABI
    );
  
    try {
      if (marketContract) {
        const tx = await marketContract.resolveMarket(_marketId, _winningOutcome);
        await tx.wait();
        toast.success("Market resolved successfully", { id });
      }
    } catch (error) {
      console.error("Error resolving market:", error);
      toast.error("Error resolving market", { id });
    }
  };
  
  const buyOutcome = async (
    _marketId: number,
    _outcome: number,
    _amount: number,
    _maxCost: number
  ) => {
    if (!activeChain) return;
  
    let id = toast.loading("Processing purchase...");
  
    const marketContract = await getContractInstance(
      Addresses[activeChain]?.XOMultiOutcomeMarketAddress,
      MultiOutcomeMarketABI
    );
  
    try {
      if (marketContract) {
        const tx = await marketContract.buy(_marketId, _outcome, _amount, _maxCost);
        await tx.wait();
        toast.success("Purchase successful", { id });
      }
    } catch (error) {
      console.error("Error purchasing outcome:", error);
      toast.error("Error purchasing outcome", { id });
    }
  };
  const sellOutcome = async (
    _marketId: number,
    _outcome: number,
    _amount: number,
    _minReturn: number
  ) => {
    if (!activeChain) return;
  
    let id = toast.loading("Processing sale...");
  
    const marketContract = await getContractInstance(
      Addresses[activeChain]?.XOMultiOutcomeMarketAddress,
      MultiOutcomeMarketABI
    );
  
    try {
      if (marketContract) {
        const tx = await marketContract.sell(_marketId, _outcome, _amount, _minReturn);
        await tx.wait();
        toast.success("Sale successful", { id });
      }
    } catch (error) {
      console.error("Error selling outcome:", error);
      toast.error("Error selling outcome", { id });
    }
  };
    
  const redeemWinnings = async (_marketId: number) => {
    if (!activeChain) return;
  
    let id = toast.loading("Redeeming winnings...");
  
    const marketContract = await getContractInstance(
      Addresses[activeChain]?.XOMultiOutcomeMarketAddress,
      MultiOutcomeMarketABI
    );
  
    try {
      if (marketContract) {
        const tx = await marketContract.redeem(_marketId);
        await tx.wait();
        toast.success("Winnings redeemed successfully", { id });
      }
    } catch (error) {
      console.error("Error redeeming winnings:", error);
      toast.error("Error redeeming winnings", { id });
    }
  };
  
  useEffect(() => {
    if (!signer) return;
    getTokenBalance();
  }, [signer, address, activeChain]);

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
        createMarket,
        reviewMarket,
        setMarketResolver,
        setMarketResolverFee,
        getMarketResolver,
        resolveMarket,
        buyOutcome,
        sellOutcome,
        redeemWinnings
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
