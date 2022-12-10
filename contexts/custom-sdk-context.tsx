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
    desiredChainId={ChainId.Goerli}
    options={{
      gasless: {
        openzeppelin: {
          relayerUrl:
            "https://api.defender.openzeppelin.com/autotasks/7d9b328d-2fc8-447d-a686-5c9b6cea8938/runs/webhook/b85151c8-a19d-44d0-a408-a8af2f5dc8d2/CThqESCM8DaxqMppFyvaTU",
          relayerForwarderAddress: "0x91e373b8Caf9E0E0694099039Ce006aAc5598db2",
        },
        experimentalChainlessSupport: true,
      },
    }}
  >
    {children}
  </CustomSDKContext>
);
