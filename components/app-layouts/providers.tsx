import { SolanaProvider } from "./solana-provider";
import { useDashboardEVMChainId } from "@3rdweb-sdk/react";
import { useQueryClient } from "@tanstack/react-query";
import { Web3sdkioProvider, WalletConnector } from "@web3sdkio/react";
import { EVM_RPC_URL_MAP, getEVMRPC } from "constants/rpc";
import { useNativeColorMode } from "hooks/useNativeColorMode";
import { StorageSingleton } from "lib/sdk";
import { ComponentWithChildren } from "types/component-with-children";

const walletConnectors: WalletConnector[] = [
  "metamask",
  "walletConnect",
  "walletLink",
  "gnosis",
];
if (process.env.NEXT_PUBLIC_MAGIC_KEY) {
  walletConnectors.push({
    name: "magic",
    options: {
      apiKey: process.env.NEXT_PUBLIC_MAGIC_KEY,
      rpcUrls: EVM_RPC_URL_MAP,
    },
  });
}

export const DashboardWeb3sdkioProvider: ComponentWithChildren = ({
  children,
}) => {
  useNativeColorMode();
  const queryClient = useQueryClient();

  const activeChainId = useDashboardEVMChainId();

  return (
    <Web3sdkioProvider
      queryClient={queryClient}
      dAppMeta={{
        name: "web3sdkio",
        logoUrl: "https://web3sdk.io/favicon.ico",
        isDarkMode: false,
        url: "https://web3sdk.io",
      }}
      chainRpc={EVM_RPC_URL_MAP}
      desiredChainId={activeChainId}
      sdkOptions={{
        gasSettings: { maxPriceInGwei: 650 },
        readonlySettings: activeChainId
          ? {
              chainId: activeChainId,
              rpcUrl: getEVMRPC(activeChainId),
            }
          : undefined,
      }}
      storageInterface={StorageSingleton}
      walletConnectors={walletConnectors}
    >
      <SolanaProvider>{children}</SolanaProvider>
    </Web3sdkioProvider>
  );
};
