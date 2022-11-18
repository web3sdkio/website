import { ValidContractInstance } from "@web3sdkio/sdk/evm";

// We're using it everywhere.
export type PotentialContractInstance =
  | ValidContractInstance
  | null
  | undefined;
