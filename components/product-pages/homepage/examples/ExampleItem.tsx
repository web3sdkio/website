import {
  CommunityRewards,
  CreatorTools,
  DAOs,
  DefiProtocols,
  Marketplaces,
  NFTDrops,
  PlayToEarnGames,
  TokenGated,
} from "./example-svgs";
import { Flex, LinkBox, LinkOverlay } from "@chakra-ui/react";
import { useTrack } from "hooks/analytics/useTrack";
import { Heading } from "tw-components";

const EXAMPLES_MAP = {
  nftDrops: {
    title: "NFT drops",
    href: "https://github.com/web3sdkio-template/nft-drop",
    svg: NFTDrops,
  },
  marketplaces: {
    title: "NFT marketplaces",
    href: "https://github.com/web3sdkio-template/marketplace-next-ts",
    svg: Marketplaces,
  },
  tokenGated: {
    title: "Token Gating",
    href: "https://github.com/web3sdkio-template/nft-gated-website",
    svg: TokenGated,
  },
  daos: {
    title: "DAOs",
    href: "https://github.com/web3sdkio-template/dao",
    svg: DAOs,
  },
  creatorTools: {
    title: "Creator tools",
    href: "https://github.com/web3sdkio-template/creator-platform",
    svg: CreatorTools,
  },
  communityRewards: {
    title: "Community rewards",
    href: "https://github.com/web3sdkio-template/community-rewards",
    svg: CommunityRewards,
  },
  playToEarnGames: {
    title: "Play-to-earn games",
    href: "https://github.com/web3sdkio-template/play-to-earn-game/",
    svg: PlayToEarnGames,
  },
  defiProtocols: {
    title: "DeFi protocols",
    href: "https://docs.web3sdk.io/templates",
    svg: DefiProtocols,
  },
} as const;

export const exampleCategories = Object.keys(EXAMPLES_MAP) as Array<
  keyof typeof EXAMPLES_MAP
>;

export type ExampleCategory = keyof typeof EXAMPLES_MAP;

export const ExampleItem: React.FC<{ category: ExampleCategory }> = ({
  category,
}) => {
  const trackEvent = useTrack();
  const { title, href, svg: RenderSVG } = EXAMPLES_MAP[category];
  return (
    <Flex as={LinkBox} role="group" flexDir="column" gap={6} flexGrow={0}>
      <RenderSVG />
      <LinkOverlay
        href={href}
        isExternal
        onClick={() => {
          trackEvent({
            category: "example",
            action: "click",
            label: category,
          });
        }}
      >
        <Heading
          _groupHover={{ textDecor: "underline" }}
          textAlign="center"
          size="subtitle.md"
          maxW="100%"
          textTransform="capitalize"
        >
          {title}
        </Heading>
      </LinkOverlay>
    </Flex>
  );
};
