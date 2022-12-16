import type { ContractType } from "@web3sdkio/sdk/evm";

export type ContractId = ContractType | string;
export type ContractCellContext = "deploy" | "create_release";

export interface DeployableContractContractCellProps {
  cell: {
    value: ContractId;
  };
  context?: ContractCellContext;
}

export type SourceFile = {
  filename: string | undefined;
  source: string;
};
