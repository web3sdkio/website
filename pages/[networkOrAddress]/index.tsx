import { useMainnetsContractList } from "@3rdweb-sdk/react";
import { Flex } from "@chakra-ui/react";
import { QueryClient, dehydrate } from "@tanstack/react-query";
import { ChainId } from "@web3sdkio/sdk/evm";
import { AppLayout } from "components/app-layouts/app";
import {
  ens,
  fetchPublishedContracts,
  fetchReleaserProfile,
  usePublishedContractsQuery,
  useReleaserProfile,
} from "components/contract-components/hooks";
import { ReleaserHeader } from "components/contract-components/releaser/releaser-header";
import { DeployedContracts } from "components/contract-components/tables/deployed-contracts";
import { ReleasedContracts } from "components/contract-components/tables/released-contracts";
import { PublisherSDKContext } from "contexts/custom-sdk-context";
import { useOgImagePing } from "hooks/useOgImagePing";
import { useSingleQueryParam } from "hooks/useQueryParam";
import { getEVMWeb3sdkioSDK } from "lib/sdk";
import { GetStaticPaths, GetStaticProps } from "next";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import { PageId } from "page-id";
import { Web3sdkioNextPage } from "pages/_app";
import { createProfileOGUrl } from "pages/_og/profile";
import { ReactElement, useEffect, useMemo } from "react";
import { Heading, Text } from "tw-components";
import { getSingleQueryValue } from "utils/router";
import { shortenIfAddress } from "utils/usedapp-external";

const UserPage: Web3sdkioNextPage = () => {
  const wallet = useSingleQueryParam("networkOrAddress");

  const ensQuery = ens.useQuery(wallet);

  const router = useRouter();

  // We do this so it doesn't break for users that haven't updated their CLI
  useEffect(() => {
    const previousPath = router.asPath.split("/")[2];
    if (
      previousPath !== "[networkOrAddress]" &&
      wallet?.startsWith("Qm") &&
      !wallet.endsWith(".eth")
    ) {
      router.replace(`/contracts/deploy/${previousPath}`);
    }
  }, [wallet, router]);

  const releaserProfile = useReleaserProfile(
    ensQuery.data?.address || undefined,
  );

  const displayName = shortenIfAddress(ensQuery?.data?.ensName || wallet);

  const currentRoute = `https://web3sdk.io${router.asPath}`;

  const publishedContracts = usePublishedContractsQuery(
    ensQuery.data?.address || undefined,
  );

  const mainnetsContractList = useMainnetsContractList(
    ensQuery.data?.address || undefined,
  );

  const ogImage = useMemo(() => {
    if (!releaserProfile.data || !publishedContracts.data) {
      return undefined;
    }
    return createProfileOGUrl({
      displayName,
      bio: releaserProfile.data?.bio,
      avatar: releaserProfile.data?.avatar || undefined,
      releaseCnt: publishedContracts.data?.length.toString(),
    });
  }, [displayName, publishedContracts.data, releaserProfile.data]);

  useOgImagePing(ogImage);

  return (
    <>
      <NextSeo
        title={displayName}
        description={`Visit ${displayName}'s profile. See their releases and deploy them in one click.`}
        openGraph={{
          title: displayName,
          images: ogImage
            ? [
                {
                  url: ogImage,
                  alt: `${displayName}'s profile on web3sdk.io`,
                  width: 1200,
                  height: 630,
                },
              ]
            : undefined,
          url: currentRoute,
        }}
      />

      <Flex flexDir="column" gap={12}>
        {wallet && <ReleaserHeader wallet={wallet} />}
        <Flex flexDir="column" gap={4}>
          <Flex gap={2} direction="column">
            <Heading size="title.md">Released contracts</Heading>
            <Text fontStyle="italic" maxW="container.md">
              The list of contract instances that this wallet has released
            </Text>
          </Flex>
          {ensQuery.data?.address && (
            <ReleasedContracts address={ensQuery.data?.address} noHeader />
          )}
        </Flex>
        <Flex flexDir="column" gap={4}>
          <Flex
            justify="space-between"
            align="top"
            gap={4}
            direction={{ base: "column", md: "row" }}
          >
            <Flex gap={2} direction="column">
              <Heading size="title.md">Deployed contracts</Heading>
              <Text fontStyle="italic" maxW="container.md">
                The list of contract instances that this wallet has deployed
                across all mainnets
              </Text>
            </Flex>
          </Flex>
          {ensQuery.data?.address && (
            <DeployedContracts
              noHeader
              contractListQuery={mainnetsContractList}
            />
          )}
        </Flex>
      </Flex>
    </>
  );
};

UserPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <AppLayout>
      <PublisherSDKContext>{page}</PublisherSDKContext>
    </AppLayout>
  );
};

UserPage.pageId = PageId.Profile;

export default UserPage;

export const getStaticProps: GetStaticProps = async (ctx) => {
  const queryClient = new QueryClient();
  // TODO make this use alchemy / other RPC
  // currently blocked because our alchemy RPC does not allow us to call this from the server (since we have an allow-list)
  const polygonSdk = getEVMWeb3sdkioSDK(ChainId.Polygon);

  const networkOrAddress = getSingleQueryValue(ctx.params, "networkOrAddress");

  if (!networkOrAddress) {
    return {
      redirect: {
        destination: "/contracts",
        permanent: false,
      },
      props: {},
    };
  }

  const { address, ensName } = await queryClient.fetchQuery(
    ens.queryKey(networkOrAddress),
    () => ens.fetch(networkOrAddress),
  );

  if (!address) {
    return {
      redirect: {
        destination: "/contracts",
        permanent: false,
      },
      props: {},
    };
  }

  const ensQueries = [
    queryClient.prefetchQuery(ens.queryKey(address), () => ens.fetch(address)),
  ];
  if (ensName) {
    ensQueries.push(
      queryClient.prefetchQuery(ens.queryKey(ensName), () =>
        ens.fetch(ensName),
      ),
    );
  }

  await Promise.all([
    ...ensQueries,
    queryClient.prefetchQuery(["releaser-profile", address], () =>
      fetchReleaserProfile(polygonSdk, address),
    ),
    queryClient.prefetchQuery(["published-contracts", address], () =>
      fetchPublishedContracts(polygonSdk, queryClient, address),
    ),
  ]);

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    fallback: "blocking",
    paths: [{ params: { networkOrAddress: "deployer.web3sdkio.eth" } }],
  };
};
