import {
  ChainId,
  Web3sdkioSDK as EVMWeb3sdkioSDK,
  SUPPORTED_CHAIN_ID,
} from "@web3sdkio/sdk/evm";
import { Web3sdkioSDK as SOLWeb3sdkioSDK } from "@web3sdkio/sdk/solana";
import { IpfsUploader, Web3sdkioStorage } from "@web3sdkio/storage";
import { getEVMRPC, getSOLRPC } from "constants/rpc";
import { DashboardSolanaNetwork } from "utils/network";

export const StorageSingleton = new Web3sdkioStorage({
  gatewayUrls: {
    "ipfs://": [process.env.NEXT_PUBLIC_IPFS_GATEWAY_URL as string],
  },
});

export function replaceIpfsUrl(url: string) {
  return StorageSingleton.resolveScheme(url);
}

// EVM SDK
const EVM_SDK_MAP = new Map<SUPPORTED_CHAIN_ID, EVMWeb3sdkioSDK>();

export function getEVMWeb3sdkioSDK(
  chainId: SUPPORTED_CHAIN_ID,
): EVMWeb3sdkioSDK {
  if (process.env.SDK_POLYGON_CHAIN_ID && chainId === ChainId.Polygon) {
    chainId = parseInt(process.env.SDK_POLYGON_CHAIN_ID);
  }
  if (EVM_SDK_MAP.has(chainId)) {
    return EVM_SDK_MAP.get(chainId) as EVMWeb3sdkioSDK;
  }
  const rpcUrl = getEVMRPC(chainId);
  const sdk = new EVMWeb3sdkioSDK(
    rpcUrl,
    {
      readonlySettings: {
        rpcUrl,
        chainId,
      },
    },
    StorageSingleton,
  );
  EVM_SDK_MAP.set(chainId, sdk);
  return sdk;
}

// SOLANA SDK
const SOL_SDK_MAP = new Map<DashboardSolanaNetwork, SOLWeb3sdkioSDK>();

export function getSOLWeb3sdkioSDK(
  network: DashboardSolanaNetwork,
): SOLWeb3sdkioSDK {
  if (SOL_SDK_MAP.has(network)) {
    return SOL_SDK_MAP.get(network) as SOLWeb3sdkioSDK;
  }
  const rpcUrl = getSOLRPC(network);
  const sdk = SOLWeb3sdkioSDK.fromNetwork(
    rpcUrl,
    new Web3sdkioStorage({
      uploader: new IpfsUploader({ uploadWithGatewayUrl: true }),
    }),
  );
  SOL_SDK_MAP.set(network, sdk);
  return sdk;
}
