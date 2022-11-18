import type { NFT } from "@web3sdkio/sdk";

export type WalletNFT = NFT & {
  contractAddress: string;
  tokenId: number;
};
