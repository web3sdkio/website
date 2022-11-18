import { NFTDrawerTab } from "./types";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  DropContract,
  NFTContract,
  getErcs,
  useAddress,
  useNFTBalance,
} from "@web3sdkio/react/evm";
import type { NFT } from "@web3sdkio/sdk";
import type { NFTCollection, NFTDrop } from "@web3sdkio/sdk/solana";
import { detectFeatures } from "components/contract-components/utils";
import { BigNumber } from "ethers";
import dynamic from "next/dynamic";
import { useMemo } from "react";

type UseNFTDrawerTabsParams =
  | [ecosystem: "evm", contract: NFTContract, token: NFT | null]
  | [ecosystem: "solana", program: NFTCollection | NFTDrop, token: NFT | null];

export function useNFTDrawerTabs(
  ...args: UseNFTDrawerTabsParams
): NFTDrawerTab[] {
  const [ecosystem, contractOrProgram, token] = args;

  const tokenId = token?.metadata.id || "";

  if (ecosystem === "solana") {
    // solana land
    // this is ok because ecosystem can never change!
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const solAddress = useWallet().publicKey?.toBase58();
    // this is ok because ecosystem can never change!
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useMemo(() => {
      const isOwner = token?.owner === solAddress;
      let tabs: NFTDrawerTab[] = [
        {
          title: "Transfer",
          isDisabled: !isOwner,
          children: dynamic(() =>
            import("program-ui/nft/drawer-tabs/transfer").then(
              ({ TransferTab }) =>
                // eslint-disable-next-line react/display-name
                () =>
                  <TransferTab program={contractOrProgram} tokenId={tokenId} />,
            ),
          ),
        },
        {
          title: "Burn",
          isDisabled: !isOwner,
          children: dynamic(() =>
            import("program-ui/nft/drawer-tabs/burn").then(({ BurnTab }) =>
              // eslint-disable-next-line react/display-name
              () => <BurnTab program={contractOrProgram} tokenId={tokenId} />,
            ),
          ),
        },
      ];

      if (contractOrProgram.accountType === "nft-collection") {
        tabs = tabs.concat([
          {
            title: "Mint",
            // TODO: Disable if the user is not the authority
            isDisabled: false,
            children: dynamic(() =>
              import("program-ui/nft/drawer-tabs/mint-supply").then(
                ({ MintSupplyTab }) =>
                  // eslint-disable-next-line react/display-name
                  () =>
                    (
                      <MintSupplyTab
                        program={contractOrProgram as NFTCollection}
                        tokenId={tokenId}
                      />
                    ),
              ),
            ),
          },
        ]);
      }
      return tabs;
    }, [contractOrProgram, solAddress, token, tokenId]);
  }

  if (ecosystem === "evm") {
    // evm land

    // this is ok because ecosystem can never change!
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const address = useAddress();
    // this is ok because ecosystem can never change!
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const balanceOf = useNFTBalance(
      contractOrProgram,
      address,
      token?.metadata.id,
    );

    // this is ok because ecosystem can never change!
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useMemo(() => {
      const isERC1155 = detectFeatures(contractOrProgram, ["ERC1155"]);
      const isERC721 = detectFeatures(contractOrProgram, ["ERC721"]);
      const isMintable = detectFeatures(contractOrProgram, ["ERC1155Mintable"]);
      const isClaimable = detectFeatures<DropContract>(contractOrProgram, [
        "ERC1155Claimable",
      ]);
      const isClaimableWithConditions = detectFeatures<DropContract>(
        contractOrProgram,
        ["ERC1155ClaimableWithConditions"],
      );
      const isBurnable = detectFeatures(contractOrProgram, [
        "ERC721Burnable",
        "ERC1155Burnable",
      ]);
      const isOwner =
        (isERC1155 && BigNumber.from(balanceOf?.data || 0).gt(0)) ||
        (isERC721 && token?.owner === address);
      const { erc1155 } = getErcs(contractOrProgram);
      let tabs: NFTDrawerTab[] = [
        {
          title: "Transfer",
          isDisabled: !isOwner,
          children: dynamic(() =>
            import("contract-ui/tabs/nfts/components/transfer-tab").then(
              ({ TransferTab }) =>
                // eslint-disable-next-line react/display-name
                () =>
                  (
                    <TransferTab
                      contract={contractOrProgram}
                      tokenId={tokenId}
                    />
                  ),
            ),
          ),
        },
      ];
      if (erc1155) {
        tabs = tabs.concat([
          {
            title: "Airdrop",
            isDisabled: !isOwner,
            children: dynamic(() =>
              import("contract-ui/tabs/nfts/components/airdrop-tab").then(
                ({ AirdropTab }) =>
                  // eslint-disable-next-line react/display-name
                  () =>
                    <AirdropTab contract={erc1155} tokenId={tokenId} />,
              ),
            ),
          },
        ]);
      }
      if (isBurnable) {
        tabs = tabs.concat([
          {
            title: "Burn",
            isDisabled: !isOwner,
            children: dynamic(() =>
              import("contract-ui/tabs/nfts/components/burn-tab").then(
                ({ BurnTab }) =>
                  // eslint-disable-next-line react/display-name
                  () =>
                    <BurnTab contract={contractOrProgram} tokenId={tokenId} />,
              ),
            ),
          },
        ]);
      }
      if (isMintable && erc1155) {
        tabs = tabs.concat([
          {
            title: "Mint",
            isDisabled: false,
            children: dynamic(() =>
              import("contract-ui/tabs/nfts/components/mint-supply-tab").then(
                ({ MintSupplyTab }) =>
                  // eslint-disable-next-line react/display-name
                  () =>
                    <MintSupplyTab contract={erc1155} tokenId={tokenId} />,
              ),
            ),
          },
        ]);
      }
      if (isClaimableWithConditions && isERC1155) {
        tabs = tabs.concat([
          {
            title: "Claim Conditions",
            isDisabled: false,
            children: dynamic(() =>
              import(
                "contract-ui/tabs/claim-conditions/components/claim-conditions"
              ).then(({ ClaimConditions }) =>
                // eslint-disable-next-line react/display-name
                () => (
                  <ClaimConditions
                    contract={contractOrProgram}
                    tokenId={tokenId}
                    isColumn
                  />
                ),
              ),
            ),
          },
        ]);
      }
      if (isClaimable && isERC1155) {
        tabs = tabs.concat([
          {
            title: "Claim",
            isDisabled: false,
            children: dynamic(() =>
              import("contract-ui/tabs/nfts/components/claim-tab").then(
                ({ ClaimTab }) =>
                  // eslint-disable-next-line react/display-name
                  () =>
                    <ClaimTab contract={contractOrProgram} tokenId={tokenId} />,
              ),
            ),
          },
        ]);
      }

      return tabs;
    }, [address, balanceOf?.data, contractOrProgram, token?.owner, tokenId]);
  }

  return [];
}
