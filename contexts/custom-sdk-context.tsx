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
    desiredChainId={ChainId.Polygon}
    options={{
      gasless: {
        openzeppelin: {
          relayerUrl:
            "https://api.defender.openzeppelin.com/autotasks/dad61716-3624-46c9-874f-0e73f15f04d5/runs/webhook/7d6a1834-dd33-4b7b-8af4-b6b4719a0b97/FdHMqyF3p6MGHw6K2nkLsv",
          relayerForwarderAddress: "0xEbc1977d1aC2fe1F6DAaF584E2957F7c436fcdEF",
        },
        experimentalChainlessSupport: true,
      },
    }}
  >
    {children}
  </CustomSDKContext>
);
