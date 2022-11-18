import { Abi, ContractId } from "./types";
import { FeatureName } from "@web3sdkio/sdk/dist/declarations/src/evm/constants/contract-features";
import {
  PREBUILT_CONTRACTS_MAP,
  ValidContractInstance,
  isFeatureEnabled,
} from "@web3sdkio/sdk/evm";

export function isContractIdBuiltInContract(
  contractId: ContractId,
): contractId is keyof typeof PREBUILT_CONTRACTS_MAP {
  return contractId in PREBUILT_CONTRACTS_MAP;
}

export function detectFeatures<TContract extends ValidContractInstance | null>(
  contract: ValidContractInstance | null | undefined,
  features: FeatureName[],
  strategy: "any" | "all" = "any",
): contract is TContract {
  if (!contract) {
    return false;
  }
  if (!("abi" in contract)) {
    return false;
  }

  if (strategy === "any") {
    return features.some((feature) =>
      isFeatureEnabled(contract?.abi as Abi, feature),
    );
  }

  return features.every((feature) =>
    isFeatureEnabled(contract?.abi as Abi, feature),
  );
}
