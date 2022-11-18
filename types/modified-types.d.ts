import type { NFTMetadataInput } from "@web3sdkio/sdk/evm";

export type NFTMetadataInputLimited = Pick<
  NFTMetadataInput,
  | "name"
  | "image"
  | "external_url"
  | "animation_url"
  | "description"
  | "background_color"
>;
