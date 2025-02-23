'use client'

import React, { useState, useEffect } from 'react';
import { ethers, BrowserProvider, JsonRpcProvider, Contract } from 'ethers';
import { formatUnits, formatDate, parseUnits } from '../utils';
import '../app/globals.css';
import MultiOutcomeMarketABI from '../contracts/MultiOutcomeMarket.json';
import XOMarketABI from '../contracts/XOMarket.json';
import XOutcomeABI from '../contracts/XOutcome.json';

const contractAddress = '0x9C5c116B90dA4ae820f9078586ef232f8FabC510';
const XO_RPC = 'https://rpc.xo-testnet.t.raas.gelato.cloud'; // Add your RPC URL here
const COLLATERAL_TOKEN = '0xC44eaB33F1B67b17Bc1c51F2b2e3BDC81270A53d';
const XO_MARKETS_ADDRESS = '0xfb06e7B5983724E3623911B12C929CEf07c53278';
const XO_OUTCOMES_ADDRESS = '0x7dC2D5FF8b8BcEAB36B0bdA96694c06a14cBF6A6';

function ConnectWallet({ onConnect }: { onConnect: (provider: BrowserProvider) => void }) {
  const connectWallet = async () => {
    try {
        
      if (!(window as any).ethereum) {
        alert('Please install MetaMask!');
        return;
      }

      const ethereum = (window as any).ethereum;
      
      const provider = new BrowserProvider(ethereum);
      const network = await provider.getNetwork();
      
      // Check if we're on Holesky (chainId 17000)
      if (Number(network.chainId) !== 17000) {
        try {
          await ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '123420001402' }], // 17000 in hex
          });
        } catch (error: any) {
          // If the chain hasn't been added to MetaMask
          if (error.code === 4902) {
            await ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: '123420001402',
                chainName: 'XO Testnet',
                nativeCurrency: {
                  name: 'XO',
                  symbol: 'XO',
                  decimals: 18
                },
                rpcUrls: [XO_RPC],
              }],
            });
          }
        }
      }
      
      await provider.send('eth_requestAccounts', []);
      onConnect(provider);
    } catch (error) {
      console.error('Error connecting wallet:', error);
    }
  };

  return (
    <button onClick={connectWallet} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
      Connect Wallet
    </button>
  );
}

function Account({ address, onDisconnect }: { address: string, onDisconnect: () => void }) {
  return (
    <div>
      <div>Address: {address}</div>
      <button onClick={onDisconnect} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
        Disconnect
      </button>
    </div>
  );
}

interface Market {
  id: number;
  expiry: number;
  createdAt: number;
  creator: string;
  collateralToken: string;
  metaDataURI: string;
  resolved: boolean;
  winningOutcome: number | null;
  outcomeTokenStartIndex: number;
  outcomeCount: number;
  price?: number[];
  balance?: number[];
}

const MarketUI: React.FC = () => {
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [markets, setMarkets] = useState<Market[]>([]);
  const [selectedMarket, setSelectedMarket] = useState<Market | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleConnect = async (newProvider: BrowserProvider) => {
    setProvider(newProvider);
    const newSigner = await newProvider.getSigner();
    setSigner(newSigner);
    const newAddress = await newSigner.getAddress();
    setAddress(newAddress);
  };

  const handleDisconnect = () => {
    setProvider(null);
    setSigner(null);
    setAddress(null);
  };

  const getContracts = (runner: ethers.ContractRunner | null) => {
    const xoMarkets = new ethers.Contract(XO_MARKETS_ADDRESS, XOMarketABI, runner);
    const xOutcomes = new ethers.Contract(XO_OUTCOMES_ADDRESS, XOutcomeABI, runner);
    const multiOutcomeMarket = new ethers.Contract(contractAddress, MultiOutcomeMarketABI, runner);
    return { xoMarkets, xOutcomes, multiOutcomeMarket };
  };

  const fetchMarkets = async () => {
    if (!provider) return;
    
    const contracts = getContracts(provider);
    try {
      setLoading(true);

      const nextMarketId= await contracts.xoMarkets.totalSupply() + BigInt(1);
        console.log('nextMarketId', nextMarketId);
      const marketsData: Market[] = [];

      for (let i = 1; i < nextMarketId; i++) {
        const market = await contracts.multiOutcomeMarket.getExtendedMarket(i);
        if (!market) continue;
        console.log('market', market);
        const creator = market.market.creator;
        const collateralToken = market.market.collateralToken;
        const metaDataURI = await contracts.xoMarkets.tokenURI(i);
        const resolved = market.market.resolved;
        const winningOutcome = resolved ? Number(market.market.winningOutcome) : null;
        const outcomeCount = Number(market.market.outcomeCount);
        const outcomeTokenStartIndex = Number(market.market.outcomeTokenStartIndex);
        const prices = market.outcomePrices;
        const balances = market.collateralAmounts;

        // prices =market.outcomePrices);
        // balances.push(market.collateralAmounts);
        // for (let j = 0; j < outcomeCount; j++) {
        //   const price = await contracts.multiOutcomeMarket.getPrice(i, j);
        //   prices.push(Number(price));
        //   const balance = address ? await contracts.xOutcomes.balanceOf(address, outcomeTokenStartIndex + j) : 0;
        //   balances.push(Number(balance));
        // }

        marketsData.push({
          id: Number(market.market.id),
          expiry: Number(market.market.expiry),
          createdAt: Number(market.market.createdAt),
          creator: creator,
          collateralToken: collateralToken,
          metaDataURI: metaDataURI,
          resolved: resolved,
          winningOutcome: winningOutcome,
          outcomeTokenStartIndex: outcomeTokenStartIndex,
          outcomeCount: outcomeCount,
          price: prices,
          balance: balances,
        });
      }
      setMarkets(marketsData);
      setError(null);
    } catch (error: any) {
      console.error('Error fetching markets:', error);
      setError(error.message || 'An error occurred while fetching markets.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMarket = async (
    startsAt: string,
    expiresAt: string,
    collateralToken: string,
    initialCollateral: string,
    creatorFeeBps: string,
    outcomeCount: string,
    resolver: string,
    metaDataURI: string
  ) => {
    const contracts = getContracts(signer);
    if (!contracts) return;

    try {
      setLoading(true);
      const collateralAmount = parseUnits(initialCollateral, 18);
      const startsAtTimestamp = Math.floor(new Date(startsAt).getTime() / 1000);
      const expiresAtTimestamp = Math.floor(new Date(expiresAt).getTime() / 1000);

      const collateralTokenContract = new Contract(
        collateralToken,
        ['function approve(address spender, uint256 amount)'],
        signer
      );

      const approvalTx = await collateralTokenContract.approve(contractAddress, collateralAmount);
      await approvalTx.wait();

      const tx = await contracts.multiOutcomeMarket.createMarket(
        startsAtTimestamp,
        expiresAtTimestamp,
        collateralToken,
        collateralAmount,
        Number(creatorFeeBps),
        Number(outcomeCount),
        resolver,
        metaDataURI
      );
      await tx.wait();
      fetchMarkets();
    } catch (error: any) {
      console.error('Error creating market:', error);
      setError(error.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleMarketClick = async (marketId: number) => {
    const market = markets.find((m) => m.id === marketId);
    setSelectedMarket(market || null);
  };

  const handleBuy = async (marketId: number, outcome: number, amount: string, maxCost: string) => {
    const contracts = getContracts(signer);
    if (!contracts) return;

    try {
      setLoading(true);
      const collateralToken = selectedMarket?.collateralToken;
      if (!collateralToken) {
        throw new Error("Collateral token is undefined");
      }
      
      const collateralTokenContract = new Contract(
        collateralToken,
        ['function approve(address spender, uint256 amount)'],
        signer
      );
      const approvalTx = await collateralTokenContract.approve(contractAddress, parseUnits(maxCost, 18));
      await approvalTx.wait();

      const tx = await contracts.multiOutcomeMarket.buy(marketId, outcome, parseUnits(amount, 18), parseUnits(maxCost, 18));
      await tx.wait();
      fetchMarkets(); // Refresh market data
      setSelectedMarket(null)
    } catch (error: any) {
      console.error('Error buying outcome tokens:', error);
      setError(error.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleSell = async (marketId: number, outcome: number, amount: string, minReturn: string) => {
    const contracts = getContracts(signer);
    if (!contracts) return;

    try {
      setLoading(true);
      const tx = await contracts.multiOutcomeMarket.sell(marketId, outcome, parseUnits(amount, 18), parseUnits(minReturn, 18));
      await tx.wait();
      fetchMarkets(); // Refresh market data
      setSelectedMarket(null)
    } catch (error: any) {
      console.error('Error selling outcome tokens:', error);
      setError(error.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleResolveMarket = async (marketId: number, winningOutcome: number) => {
    const contracts = getContracts(signer);
    if (!contracts) return;

    try {
      setLoading(true);
      const tx = await contracts.multiOutcomeMarket.resolveMarket(marketId, winningOutcome);
      await tx.wait();
      fetchMarkets();
      setSelectedMarket(null);
    } catch (error: any) {
      console.error('Error resolving market:', error);
      setError(error.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleRedeem = async (marketId: number) => {
    const contracts = getContracts(signer);
    if (!contracts) return;

    try {
      setLoading(true);
      const tx = await contracts.multiOutcomeMarket.redeem(marketId);
      await tx.wait();
      fetchMarkets(); // Refresh market data
      setSelectedMarket(null)
    } catch (error: any) {
      console.error('Error redeeming winnings:', error);
      setError(error.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (provider) {
      fetchMarkets();
    }
  }, [provider]);

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="flex justify-between items-center mb-8 bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
          XO Prediction Market
        </h1>
        <div className="flex items-center gap-4">
          {signer && <MintCollateral signer={signer} />}
          {address ? (
            <Account address={address} onDisconnect={handleDisconnect} />
          ) : (
            <ConnectWallet onConnect={handleConnect} />
          )}
        </div>
      </div>

      {/* Create Market Form */}
      {address && (
        <div className="mb-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-2xl">
          <h2 className="text-2xl font-bold mb-4">Create Market</h2>
          <CreateMarketForm onCreateMarket={handleCreateMarket} />
        </div>
      )}

      {/* List Markets */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Markets</h2>
        {loading && <div className="animate-pulse text-gray-500">Loading...</div>}
        {error && <div className="text-red-500 p-4 bg-red-100 rounded-lg">{error}</div>}
        <ul className="space-y-2">
          {markets.map((market) => (
            <li 
              key={market.id} 
              onClick={() => handleMarketClick(market.id)} 
              className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-md cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition duration-300"
            >
              <h3 className="text-xl font-semibold mb-2">Market ID: {market.id}</h3>
              <p>Expiry: {formatDate(market.expiry)}</p>
              <p>Collateral: {market.collateralToken.slice(0, 6)}...{market.collateralToken.slice(-4)}</p>
              <p>Outcomes: {market.outcomeCount}</p>
              {market.resolved && <p>Winning Outcome: {market.winningOutcome}</p>}
              {market.price && market.price.map((price, index) => (
                <p key={index}>Price {index}: {formatUnits(price, 18)}</p>
              ))}
              {market.balance && market.balance.map((balance, index) => (
                <p key={index}>Balance {index}: {formatUnits(balance, 18)}</p>
              ))}
            </li>
          ))}
        </ul>
      </div>

      {/* Market Details */}
      {selectedMarket && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Market Details</h2>
          <p>Market ID: {selectedMarket.id}</p>
          <p>Expiry: {formatDate(selectedMarket.expiry)}</p>
          <p>Creator: {selectedMarket.creator}</p>
          <p>Collateral: {selectedMarket.collateralToken}</p>
          <p>Outcomes: {selectedMarket.outcomeCount}</p>
          {selectedMarket.resolved && <p>Winning Outcome: {selectedMarket.winningOutcome}</p>}
          {selectedMarket.price && selectedMarket.price.map((price, index) => (
            <p key={index}>Price {index}: {formatUnits(price, 18)}</p>
          ))}
          {selectedMarket.balance && selectedMarket.balance.map((balance, index) => (
            <p key={index}>Balance {index}: {formatUnits(balance, 18)}</p>
          ))}

          <div className="mt-4 flex flex-wrap gap-8">
            <div className="flex-1 min-w-[300px] max-w-[400px]">
              <h3 className="text-xl font-semibold mb-2">Buy Outcome Tokens</h3>
              <BuyForm 
                marketId={selectedMarket.id} 
                outcomeCount={selectedMarket.outcomeCount}
                onBuy={handleBuy} 
                prices={selectedMarket.price || []}
              />
            </div>

            <div className="flex-1 min-w-[300px] max-w-[400px]">
              <h3 className="text-xl font-semibold mb-2">Sell Outcome Tokens</h3>
              <SellForm 
                marketId={selectedMarket.id} 
                outcomeCount={selectedMarket.outcomeCount}
                onSell={handleSell} 
                balances={selectedMarket.balance || []}
              />
            </div>
          </div>

          {signer && (
            <div className="mt-8 max-w-[400px]">
              <h3 className="text-xl font-semibold mb-2">Resolve Market</h3>
              <ResolveForm 
                marketId={selectedMarket.id} 
                outcomeCount={selectedMarket.outcomeCount}
                onResolve={handleResolveMarket} 
              />
            </div>
          )}

          {selectedMarket.resolved && (
            <div className="mt-4">
              <button onClick={() => handleRedeem(selectedMarket.id)} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                Redeem Winnings
              </button>
            </div>
          )}
          <button onClick={() => setSelectedMarket(null)} className="mt-4 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
            Close
          </button>
        </div>
      )}
    </div>
  );
};

interface CreateMarketFormProps {
  onCreateMarket: (
    startsAt: string,
    expiresAt: string,
    collateralToken: string,
    initialCollateral: string,
    creatorFeeBps: string,
    outcomeCount: string,
    resolver: string,
    metaDataURI: string
  ) => void;
}

const CreateMarketForm: React.FC<CreateMarketFormProps> = ({ onCreateMarket }) => {
  const [startsAt, setStartsAt] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [collateralToken, setCollateralToken] = useState(COLLATERAL_TOKEN);
  const [initialCollateral, setInitialCollateral] = useState('');
  const [creatorFeeBps, setCreatorFeeBps] = useState('');
  const [outcomeCount, setOutcomeCount] = useState('');
  const [resolver, setResolver] = useState('');
  const [metaDataURI, setMetaDataURI] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateMarket(
      startsAt,
      expiresAt,
      collateralToken,
      initialCollateral,
      creatorFeeBps,
      outcomeCount,
      resolver,
      metaDataURI
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {/* First row */}
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">Start Date</label>
          <input 
            type="datetime-local" 
            value={startsAt} 
            onChange={(e) => setStartsAt(e.target.value)} 
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
            required 
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">Expiry Date</label>
          <input 
            type="datetime-local" 
            value={expiresAt} 
            onChange={(e) => setExpiresAt(e.target.value)} 
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
            required 
          />
        </div>
        {/* Second row */}
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">Collateral Token</label>
          <input 
            type="text" 
            value={collateralToken} 
            onChange={(e) => setCollateralToken(e.target.value)} 
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
            required 
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">Initial Collateral</label>
          <input 
            type="number" 
            value={initialCollateral} 
            onChange={(e) => setInitialCollateral(e.target.value)} 
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
            required 
          />
        </div>
        {/* Third row */}
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">Creator Fee (BPS)</label>
          <input 
            type="number" 
            value={creatorFeeBps} 
            onChange={(e) => setCreatorFeeBps(e.target.value)} 
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
            required 
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">Outcome Count</label>
          <input 
            type="number" 
            value={outcomeCount} 
            onChange={(e) => setOutcomeCount(e.target.value)} 
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
            required 
          />
        </div>
        {/* Fourth row */}
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">Resolver Address</label>
          <input 
            type="text" 
            value={resolver} 
            onChange={(e) => setResolver(e.target.value)} 
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
            required 
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">Metadata URI</label>
          <input 
            type="text" 
            value={metaDataURI} 
            onChange={(e) => setMetaDataURI(e.target.value)} 
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
            required 
          />
        </div>
      </div>
      <div className="flex justify-end mt-4">
        <button 
          type="submit" 
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Create Market
        </button>
      </div>
    </form>
  );
};

interface BuyFormProps {
  marketId: number;
  outcomeCount: number;
  onBuy: (marketId: number, outcome: number, amount: string, maxCost: string) => void;
  prices: number[];
}

const BuyForm: React.FC<BuyFormProps> = ({ marketId, outcomeCount, onBuy, prices }) => {
  const [outcome, setOutcome] = useState(0);
  const [amount, setAmount] = useState('');
  const [maxCost, setMaxCost] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onBuy(marketId, Number(outcome), amount, maxCost);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full">
      <div>
        <label className="block text-gray-700 text-sm font-bold mb-2">Outcome</label>
        <select value={outcome} onChange={(e) => setOutcome(Number(e.target.value))} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
          {Array.from({ length: outcomeCount }, (_, i) => (
            <option key={i} value={i}>{i+1}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-gray-700 text-sm font-bold mb-2">Amount</label>
        <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
      </div>
      <div>
        <label className="block text-gray-700 text-sm font-bold mb-2">Max Cost</label>
        <input type="number" value={maxCost} onChange={(e) => setMaxCost(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
      </div>
      <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
        Buy
      </button>
    </form>
  );
};

interface SellFormProps {
  marketId: number;
  outcomeCount: number;
  onSell: (marketId: number, outcome: number, amount: string, minReturn: string) => void;
  balances: number[];
}

const SellForm: React.FC<SellFormProps> = ({ marketId, outcomeCount, onSell, balances }) => {
  const [outcome, setOutcome] = useState(0);
  const [amount, setAmount] = useState('');
  const [minReturn, setMinReturn] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSell(marketId, Number(outcome), amount, minReturn);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full">
      <div>
        <label className="block text-gray-700 text-sm font-bold mb-2">Outcome</label>
        <select value={outcome} onChange={(e) => setOutcome(Number(e.target.value))} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
          {Array.from({ length: outcomeCount }, (_, i) => (
            <option key={i} value={i}>{i+1}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-gray-700 text-sm font-bold mb-2">Amount</label>
        <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
      </div>
      <div>
        <label className="block text-gray-700 text-sm font-bold mb-2">Min Return</label>
        <input type="number" value={minReturn} onChange={(e) => setMinReturn(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
      </div>
      <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
        Sell
      </button>
    </form>
  );
};

interface ResolveFormProps {
  marketId: number;
  outcomeCount: number;
  onResolve: (marketId: number, winningOutcome: number) => void;
}

const ResolveForm: React.FC<ResolveFormProps> = ({ marketId, outcomeCount, onResolve }) => {
  const [winningOutcome, setWinningOutcome] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onResolve(marketId, Number(winningOutcome));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full">
      <div>
        <label className="block text-gray-700 text-sm font-bold mb-2">Winning Outcome</label>
        <select value={winningOutcome} onChange={(e) => setWinningOutcome(Number(e.target.value))} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
          {Array.from({ length: outcomeCount }, (_, i) => (
            <option key={i} value={i}>{i}</option>
          ))}
        </select>
      </div>
      <button type="submit" className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
        Resolve Market
      </button>
    </form>
  );
};

function MintCollateral({ signer }: { signer: ethers.Signer | null }) {
  const [amount, setAmount] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleMint = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signer || !amount) return;

    try {
      setLoading(true);
      const collateralToken = new Contract(
        COLLATERAL_TOKEN,
        ['function mint(address to, uint256 amount)'],
        signer
      );

      const address = await signer.getAddress();
      const tx = await collateralToken.mint(address, parseUnits(amount, 18));
      await tx.wait();
      setAmount('');
    } catch (error) {
      console.error('Error minting tokens:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleMint} className="flex gap-2 items-center max-w-[400px]">
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Amount"
        className="p-2 border rounded"
      />
      <button
        type="submit"
        disabled={loading || !signer}
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
      >
        Mint DOGE
      </button>
    </form>
  );
}

export default MarketUI;