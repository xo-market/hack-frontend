"use client";
import React, { useState, useEffect, ReactNode } from "react";
import { useAccount, useChainId } from "wagmi";
import { useEthersSigner } from "@/utils/signer";
import { ethers, BigNumber, Contract } from "ethers";
import { toast } from "react-hot-toast";
import api from "@/config";
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
  redeemDefaultedMarket: (_marketId: number) => void;
  getRedeemableAmount: (_marketId: number, _amount: number) => void;
  setCollateralTokenAllowed: (_tokenAddress: string, _allowed: Boolean) => void;
  getCollateralTokenAllowed: (_tokenAddress: string) => void;
  setMinimumInitialCollateral: (_amount: number) => void;
  getMinimumInitialCollateral: () => void;
  setProtocolFee: (_feeBps: number) => void;
  getProtocolFee: () => void;
  setInsuranceAddress: (_insuranceAddress: string) => void;
  getInsuranceAddress: () => void;
  getMarket: (_marketId: number) => void;
  getExtendedMarket: (_marketId: number) => void;
  fetchAllMarketsData: () => void;
  getMarketMetadata: (hash: string) => void;
  uploadMarketData: (metadata: any) => void;
  scheduleFarcasterMarket: (marketData: any) => void;
  validateFarcasterMarket: (validationData: any) => void;
  createFarcasterMarket: (marketMetadata: any, image: any) => void;
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
  // User -> url -> (Likes,parametres) -> (Choice Params) ->

  const createMarket = async (
    _startsAt: number, // pre define
    _expiresAt: number, //
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

        return tx;
        toast.success("Market created successfully", { id });
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
        const tx = await marketContract.reviewMarket(
          _marketId,
          _isApproved,
          _data
        );
        await tx.wait();
        toast.success("Market Reviewing successfully", { id });
      }
    } catch (error) {
      console.error(error);
      toast.error("Error in Reviewing market", { id });
    }
  };

  const setMarketResolver = async (
    _resolver: string,
    _isPublicResolver: boolean
  ) => {
    if (!activeChain) return;
    let id = toast.loading("Setting market resolver...");

    const marketContract = await getContractInstance(
      Addresses[activeChain]?.XOMultiOutcomeMarketAddress,
      MultiOutcomeMarketABI
    );

    try {
      if (marketContract) {
        const tx = await marketContract.setMarketResolver(
          _resolver,
          _isPublicResolver
        );
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

  const getMarket = async (_marketId: number) => {
    if (!activeChain) return;

    try {
      const marketContract = await getContractInstance(
        Addresses[activeChain]?.XOMultiOutcomeMarketAddress,
        MultiOutcomeMarketABI
      );

      if (marketContract) {
        const marketDetails = await marketContract.getMarket(_marketId);
        return marketDetails;
      }
    } catch (error) {
      console.error("Error fetching market details:", error);
      toast.error("Failed to fetch market details");
      throw error;
    }
  };

  const getExtendedMarket = async (_marketId: number) => {
    if (!activeChain) return;

    try {
      const marketContract = await getContractInstance(
        Addresses[activeChain]?.XOMultiOutcomeMarketAddress,
        MultiOutcomeMarketABI
      );

      if (marketContract) {
        const extendedMarketDetails = await marketContract.getExtendedMarket(
          _marketId
        );
        return extendedMarketDetails;
      }
    } catch (error) {
      console.error("Error fetching extended market details:", error);
      toast.error("Failed to fetch extended market details");
      throw error;
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
        const tx = await marketContract.resolveMarket(
          _marketId,
          _winningOutcome
        );
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
        const tx = await marketContract.buy(
          _marketId,
          _outcome,
          _amount,
          _maxCost
        );
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
        const tx = await marketContract.sell(
          _marketId,
          _outcome,
          _amount,
          _minReturn
        );
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

  const redeemDefaultedMarket = async (_marketId: number) => {
    if (!activeChain) return;

    let id = toast.loading("Redeeming defaulted market...");

    const marketContract = await getContractInstance(
      Addresses[activeChain]?.XOMultiOutcomeMarketAddress,
      MultiOutcomeMarketABI
    );

    try {
      if (marketContract) {
        const tx = await marketContract.redeemDefaultedMarket(_marketId);
        await tx.wait();
        toast.success("Defaulted market redeemed successfully", { id });
      }
    } catch (error) {
      console.error("Error redeeming defaulted market:", error);
      toast.error("Error redeeming defaulted market", { id });
    }
  };

  const getRedeemableAmount = async (_marketId: number, _amount: number) => {
    if (!activeChain) return;
    const marketContract = await getContractInstance(
      Addresses[activeChain]?.XOMultiOutcomeMarketAddress,
      MultiOutcomeMarketABI
    );

    try {
      if (marketContract) {
        const redeemableAmount = await marketContract.getRedeemableAmount(
          _marketId,
          ethers.utils.parseUnits(_amount.toString(), 18) // Ensure correct units
        );
        const formattedAmount = ethers.utils.formatUnits(redeemableAmount, 18);

        return formattedAmount;
      }
    } catch (error) {
      console.error("Error fetching redeemable amount:", error);
    }
  };

  const setCollateralTokenAllowed = async (
    _tokenAddress: string,
    _allowed: Boolean
  ) => {
    if (!activeChain) return;

    let id = toast.loading("Updating collateral token allowance...");

    const marketContract = await getContractInstance(
      Addresses[activeChain]?.XOMultiOutcomeMarketAddress,
      MultiOutcomeMarketABI
    );

    try {
      if (marketContract) {
        const tx = await marketContract.setCollateralTokenAllowed(
          _tokenAddress,
          _allowed
        );
        await tx.wait();
        toast.success(
          `Collateral token ${_allowed ? "enabled" : "disabled"} successfully`,
          { id }
        );
      }
    } catch (error) {
      console.error("Error updating collateral token:", error);
      toast.error("Error updating collateral token", { id });
    }
  };

  const getCollateralTokenAllowed = async (_tokenAddress: string) => {
    if (!activeChain) return;
    const marketContract = await getContractInstance(
      Addresses[activeChain]?.XOMultiOutcomeMarketAddress,
      MultiOutcomeMarketABI
    );
    try {
      if (marketContract) {
        const isAllowed = await marketContract.getCollateralTokenAllowed(
          _tokenAddress
        );
        return isAllowed;
      }
    } catch (error) {
      console.error("Error fetching collateral token allowance:", error);
    }
  };

  const setMinimumInitialCollateral = async (_amount: number) => {
    if (!activeChain) return;

    let id = toast.loading("Setting minimum initial collateral...");

    const marketContract = await getContractInstance(
      Addresses[activeChain]?.XOMultiOutcomeMarketAddress,
      MultiOutcomeMarketABI
    );

    try {
      if (marketContract) {
        const tx = await marketContract.setMinimumInitialCollateral(
          ethers.utils.parseUnits(_amount.toString(), 18)
        );
        await tx.wait();
        toast.success(`Minimum initial collateral set to ${_amount}`, { id });
      }
    } catch (error) {
      console.error("Error setting minimum initial collateral:", error);
      toast.error("Error setting minimum initial collateral", { id });
    }
  };

  const getMinimumInitialCollateral = async () => {
    if (!activeChain) return;

    const marketContract = await getContractInstance(
      Addresses[activeChain]?.XOMultiOutcomeMarketAddress,
      MultiOutcomeMarketABI
    );

    try {
      if (marketContract) {
        const amount = await marketContract.getMinimumInitialCollateral();
        const formattedAmount = ethers.utils.formatUnits(amount, 18);

        return formattedAmount;
      }
    } catch (error) {
      console.error("Error fetching minimum initial collateral:", error);
    }
  };

  const setProtocolFee = async (_feeBps: number) => {
    if (!activeChain) return;

    let id = toast.loading("Setting protocol fee...");

    const marketContract = await getContractInstance(
      Addresses[activeChain]?.XOMultiOutcomeMarketAddress,
      MultiOutcomeMarketABI
    );

    try {
      if (marketContract) {
        const tx = await marketContract.setProtocolFee(_feeBps);
        await tx.wait();
        toast.success(`Protocol fee set to ${_feeBps} bps`, { id });
      }
    } catch (error) {
      console.error("Error setting protocol fee:", error);
      toast.error("Error setting protocol fee", { id });
    }
  };

  const getProtocolFee = async () => {
    if (!activeChain) return;

    const marketContract = await getContractInstance(
      Addresses[activeChain]?.XOMultiOutcomeMarketAddress,
      MultiOutcomeMarketABI
    );

    try {
      if (marketContract) {
        const feeBps = await marketContract.getProtocolFee();

        return feeBps;
      }
    } catch (error) {
      console.error("Error fetching protocol fee:", error);
    }
  };

  const setInsuranceAddress = async (_insuranceAddress: string) => {
    if (!activeChain) return;

    let id = toast.loading("Setting insurance address...");

    const marketContract = await getContractInstance(
      Addresses[activeChain]?.XOMultiOutcomeMarketAddress,
      MultiOutcomeMarketABI
    );

    try {
      if (marketContract) {
        const tx = await marketContract.setInsuranceAddress(_insuranceAddress);
        await tx.wait();
        toast.success(`Insurance address set to ${_insuranceAddress}`, { id });
      }
    } catch (error) {
      console.error("Error setting insurance address:", error);
      toast.error("Error setting insurance address", { id });
    }
  };

  const getInsuranceAddress = async () => {
    if (!activeChain) return;

    const marketContract = await getContractInstance(
      Addresses[activeChain]?.XOMultiOutcomeMarketAddress,
      MultiOutcomeMarketABI
    );

    try {
      if (marketContract) {
        const address = await marketContract.getInsuranceAddress();

        return address;
      }
    } catch (error) {
      console.error("Error fetching insurance address:", error);
    }
  };
  useEffect(() => {
    if (!signer) return;
    getTokenBalance();
  }, [signer, address, activeChain]);

  const fetchAllMarketsData = async () => {
    try {
      let marketData = await api.get("/market/all");
      return marketData?.data?.markets || [];
    } catch (error) {
      console.log(error);
    }
  };

  function formatTimestamp(timestamp: number) {
    const date = new Date(timestamp * 1000); // Convert to milliseconds
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
  }

  function getMarketMetadata(hash: string) {
    try {
      let metadata = api.get(`/ipfs/get_ipfs/${hash}`);
      return metadata;
    } catch (error) {
      console.log("Not getting any data");
    }
  }

  function uploadMarketData(metadata: any) {
    try {
      let response = api.post("/ipfs/upload_image", metadata);
      return response;
    } catch (error) {
      console.log("Error in uploading data");
    }
  }

  const scheduleFarcasterMarket = async (marketData: any) => {
    try {
      const response = await api.post("/farcaster/schedule", marketData);
      return response.data;
    } catch (error) {
      console.error("Error scheduling Farcaster market:", error);
      throw error;
    }
  };

  // Validate a Farcaster market
  const validateFarcasterMarket = async (validationData: any) => {
    try {
      const response = await api.post("/farcaster/validate", validationData);
      return response.data;
    } catch (error) {
      console.error("Error validating Farcaster market:", error);
      throw error;
    }
  };

  // Create a new Farcaster market
  const createFarcasterMarket = async (marketMetadata: any, image: any) => {
    let id = toast.loading("Creating Farcaster market...");
    try {
      if (!activeChain) {
        return;
      }

      // const response = await api.post("/farcaster/create", {
      //   name: "Market Name",
      //   description: "Market Description",
      //   image: image,
      //   attributes: [marketMetadata?.param, marketMetadata?.category],
      //   external_url: "https://farcaster.market",
      //   animation_url: "https://farcaster.market",
      //   background_color: "#FFFFFF",
      // });

      let tx = await createMarket(
        Date.now() + 1000,
        Date.now() + 1000 * 60 * 30,
        Addresses[activeChain]?.XOCollateralTokenAddress,
        0,
        0,
        2,
        "0xa732946c3816e7A7f0Aa0069df259d63385D1BA1",
        "https://ipfs.io/ipfs/bafkreiglmgetqhmrksqwyz7z73ogft4dcwtbzkgiiyij6ofa4ptnl2q2cy"
      );

      console.log("Farcaster market created successfully:", tx);
      toast.success("Farcaster market created successfully", { id });
      // return response.data;
    } catch (error) {
      console.error("Error creating Farcaster market:", error);
      toast.error("Error creating Farcaster market", { id });
      throw error;
    }
  };
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
        redeemWinnings,
        redeemDefaultedMarket,
        getRedeemableAmount,
        setCollateralTokenAllowed,
        getCollateralTokenAllowed,
        setMinimumInitialCollateral,
        getMinimumInitialCollateral,
        setProtocolFee,
        getProtocolFee,
        setInsuranceAddress,
        getInsuranceAddress,
        getMarket,
        getExtendedMarket,
        fetchAllMarketsData,
        getMarketMetadata,
        uploadMarketData,
        scheduleFarcasterMarket,
        validateFarcasterMarket,
        createFarcasterMarket,
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
