import { useQueryClient } from "@tanstack/react-query";
import { Web3sdkioSDKProvider, useSigner } from "@web3sdkio/react";
import { ChainId, SDKOptions, SUPPORTED_CHAIN_ID } from "@web3sdkio/sdk/evm";
import { getEVMRPC } from "constants/rpc";
import { StorageSingleton } from "lib/sdk";
import { ComponentWithChildren } from "types/component-with-children";
import { useProvider } from "wagmi";

export const CustomSDKContext: ComponentWithChildren<{
  desiredChainId?: SUPPORTED_CHAIN_ID | -1;
  options?: SDKOptions;
}> = ({ desiredChainId, options, children }) => {
  const signer = useSigner();
  const provider = useProvider();
  const queryClient = useQueryClient();

  return (
    <Web3sdkioSDKProvider
      desiredChainId={desiredChainId}
      signer={signer}
      provider={provider}
      queryClient={queryClient}
      sdkOptions={{
        gasSettings: {
          maxPriceInGwei: 650,
        },
        readonlySettings:
          desiredChainId && desiredChainId !== -1
            ? {
                chainId: desiredChainId,
                rpcUrl: getEVMRPC(desiredChainId),
              }
            : undefined,
        ...options,
      }}
      storageInterface={StorageSingleton}
    >
      {children}
    </Web3sdkioSDKProvider>
  );
};

export const PublisherSDKContext: ComponentWithChildren = ({ children }) => (
  <CustomSDKContext
    desiredChainId={ChainId.Mumbai}
    options={{
      gasless: {
        openzeppelin: {
          relayerUrl:
            "https://api.defender.openzeppelin.com/autotasks/b9256c6c-adaf-492e-b80c-3f76666ad8fa/runs/webhook/b85151c8-a19d-44d0-a408-a8af2f5dc8d2/WfMncKf1bLVWUGakEQhFqE",
          relayerForwarderAddress: "0x5Abe68be6ecE6586Bd438BE25cEed2D5707F2a95",
        },
        experimentalChainlessSupport: true,
      },
    }}
  >
    {children}
  </CustomSDKContext>
);
