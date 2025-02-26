import { BigNumberish, ethers } from 'ethers';

export const formatNumber = (value: number, decimals: number = 2) => {
  return value.toFixed(decimals);
};

export const formatDate = (timestamp: number) => {
  return new Date(timestamp * 1000).toLocaleString();
};

export const parseUnits = (value: string, unitName?: string | BigNumberish | undefined): bigint => {
  return ethers.parseUnits(value, unitName);
};

export const formatUnits = (value: bigint | number, unitName?: string | BigNumberish | undefined): string => {
  return ethers.formatUnits(value, unitName);
};