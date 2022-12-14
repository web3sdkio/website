import {
  ens,
  useContractEnabledExtensions,
  useContractPublishMetadataFromURI,
  useReleasedContractCompilerMetadata,
  useReleasedContractEvents,
  useReleasedContractFunctions,
  useReleasedContractInfo,
  useReleaserProfile,
} from "../hooks";
import { ReleaserHeader } from "../releaser/releaser-header";
import { MarkdownRenderer } from "./markdown-renderer";
import {
  Divider,
  Flex,
  GridItem,
  Icon,
  List,
  ListItem,
} from "@chakra-ui/react";
import { SiTwitter } from "@react-icons/all-files/si/SiTwitter";
import { useQuery } from "@tanstack/react-query";
import { useAddress } from "@web3sdkio/react";
import {
  PublishedContract,
  PublishedMetadata,
  fetchSourceFilesFromMetadata,
} from "@web3sdkio/sdk/evm";
import { ContractFunctionsOverview } from "components/contract-functions/contract-functions";
import { ShareButton } from "components/share-buttom";
import { format } from "date-fns";
import { useOgImagePing } from "hooks/useOgImagePing";
import { correctAndUniqueLicenses } from "lib/licenses";
import { StorageSingleton, replaceIpfsUrl } from "lib/sdk";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import { createReleaseOGUrl } from "pages/_og/release";
import { useMemo } from "react";
import { BiPencil } from "react-icons/bi";
import { BsShieldCheck } from "react-icons/bs";
import { FcCheckmark } from "react-icons/fc";
import { VscBook, VscCalendar } from "react-icons/vsc";
import invariant from "tiny-invariant";
import {
  Card,
  Heading,
  Link,
  LinkButton,
  Text,
  TrackedIconButton,
  TrackedLink,
} from "tw-components";
import { shortenIfAddress } from "utils/usedapp-external";

export interface ExtendedReleasedContractInfo extends PublishedContract {
  name: string;
  description: string;
  version: string;
  releaser: string;
  tags?: string[];
  logo?: string;
  audit?: string;
}

interface ReleasedContractProps {
  release: ExtendedReleasedContractInfo;
  walletOrEns: string;
}

export const ReleasedContract: React.FC<ReleasedContractProps> = ({
  release,
  walletOrEns,
}) => {
  const address = useAddress();
  const releasedContractInfo = useReleasedContractInfo(release);
  const { data: compilerInfo } = useReleasedContractCompilerMetadata(release);

  const router = useRouter();
  const contractReleaseMetadata = useContractPublishMetadataFromURI(
    release.metadataUri,
  );

  const enabledExtensions = useContractEnabledExtensions(
    contractReleaseMetadata.data?.abi,
  );

  const releaserProfile = useReleaserProfile(release.releaser);

  const currentRoute = `https://web3sdk.io${router.asPath}`;

  const contractFunctions = useReleasedContractFunctions(release);
  const contractEvents = useReleasedContractEvents(release);

  const ensQuery = ens.useQuery(release.releaser);

  const releaserEnsOrAddress = shortenIfAddress(
    ensQuery.data?.ensName || release.releaser,
  );

  const releasedDate = format(
    new Date(
      parseInt(
        releasedContractInfo?.data?.publishedTimestamp.toString() || "0",
      ) * 1000,
    ),
    "MMM dd, yyyy",
  );

  const licenses = correctAndUniqueLicenses(compilerInfo?.licenses || []);

  const ogImageUrl = useMemo(
    () =>
      createReleaseOGUrl({
        name: release.name,
        description: release.description,
        version: release.version,
        releaser: releaserEnsOrAddress,
        extension: enabledExtensions.map((e) => e.name),
        license: licenses,
        releaseDate: releasedDate,
        releaserAvatar: releaserProfile.data?.avatar || undefined,
        releaseLogo: release.logo,
      }),
    [
      enabledExtensions,
      licenses,
      release.description,
      release.logo,
      release.name,
      release.version,
      releasedDate,
      releaserEnsOrAddress,
      releaserProfile.data?.avatar,
    ],
  );

  useOgImagePing(ogImageUrl);

  const twitterIntentUrl = useMemo(() => {
    const url = new URL("https://twitter.com/intent/tweet");
    url.searchParams.append(
      "text",
      `Check out this ${release.name} contract on @web3sdkio
      
Deploy it in one click`,
    );
    url.searchParams.append("url", currentRoute);
    return url.href;
  }, [release, currentRoute]);

  const sources = useQuery(
    ["sources", release],
    async () => {
      invariant(
        contractReleaseMetadata.data?.compilerMetadata?.sources,
        "no compilerMetadata sources available",
      );
      return (
        await fetchSourceFilesFromMetadata(
          {
            metadata: {
              sources: contractReleaseMetadata.data.compilerMetadata.sources,
            },
          } as unknown as PublishedMetadata,
          StorageSingleton,
        )
      )
        .map((source) => {
          return {
            ...source,
            filename: source.filename.split("/").pop(),
          };
        })
        .slice()
        .reverse();
    },
    { enabled: !!contractReleaseMetadata.data?.compilerMetadata?.sources },
  );
  return (
    <>
      <NextSeo
        title={`${shortenIfAddress(releaserEnsOrAddress)}/${release.name}`}
        description={`${release.description}${
          release.description ? ". " : ""
        }Deploy ${release.name} in one click with web3sdkio.`}
        openGraph={{
          title: `${shortenIfAddress(releaserEnsOrAddress)}/${release.name}`,
          url: currentRoute,
          images: [
            {
              url: ogImageUrl,
              width: 1200,
              height: 630,
              alt: `${release.name} contract on web3sdkio`,
            },
          ],
        }}
      />
      <GridItem colSpan={{ base: 12, md: 9 }}>
        <Flex flexDir="column" gap={6}>
          {address === release.releaser && (
            <LinkButton
              ml="auto"
              size="sm"
              variant="outline"
              leftIcon={<Icon as={BiPencil} />}
              href={`/contracts/release/${encodeURIComponent(
                release.metadataUri.replace("ipfs://", ""),
              )}`}
            >
              Edit Release
            </LinkButton>
          )}
          {releasedContractInfo.data?.publishedMetadata?.readme && (
            <Card as={Flex} flexDir="column" gap={2} p={6} position="relative">
              <MarkdownRenderer
                markdownText={
                  releasedContractInfo.data?.publishedMetadata?.readme
                }
              />
            </Card>
          )}

          {releasedContractInfo.data?.publishedMetadata?.changelog && (
            <Card as={Flex} flexDir="column" gap={2} p={0}>
              <Heading px={6} pt={5} pb={2} size="title.sm">
                {releasedContractInfo.data?.publishedMetadata?.version} Release
                Notes
              </Heading>
              <Divider />

              <MarkdownRenderer
                px={6}
                pt={2}
                pb={5}
                markdownText={
                  releasedContractInfo.data?.publishedMetadata?.changelog
                }
              />
            </Card>
          )}
          {contractFunctions && (
            <ContractFunctionsOverview
              functions={contractFunctions}
              events={contractEvents}
              sources={sources.data}
              abi={contractReleaseMetadata.data?.abi}
            />
          )}
        </Flex>
      </GridItem>
      <GridItem colSpan={{ base: 12, md: 3 }}>
        <Flex flexDir="column" gap={6}>
          {walletOrEns && <ReleaserHeader wallet={walletOrEns} />}
          <Divider />
          <Flex flexDir="column" gap={4}>
            <Heading size="title.sm">Contract details</Heading>
            <List as={Flex} flexDir="column" gap={3}>
              <>
                {releasedContractInfo.data?.publishedTimestamp && (
                  <ListItem>
                    <Flex gap={2} alignItems="center">
                      <Icon color="paragraph" as={VscCalendar} boxSize={5} />
                      <Text size="label.md" lineHeight={1.2}>
                        Released: {releasedDate}
                      </Text>
                    </Flex>
                  </ListItem>
                )}
                {releasedContractInfo.data?.publishedMetadata?.audit && (
                  <ListItem>
                    <Flex gap={2} alignItems="center">
                      <Icon as={BsShieldCheck} boxSize={5} color="green" />
                      <Text size="label.md">
                        <Link
                          href={replaceIpfsUrl(
                            releasedContractInfo.data?.publishedMetadata?.audit,
                          )}
                          isExternal
                        >
                          Audited
                        </Link>
                      </Text>
                    </Flex>
                  </ListItem>
                )}
                <ListItem>
                  <Flex gap={2} alignItems="center">
                    <Icon color="paragraph" as={VscBook} boxSize={5} />
                    <Text size="label.md" lineHeight={1.2}>
                      License
                      {licenses.length > 1 ? "s" : ""}:{" "}
                      {licenses.join(", ") || "None"}
                    </Text>
                  </Flex>
                </ListItem>
                {(enabledExtensions || []).map((extension) => (
                  <ListItem key={extension.name}>
                    <Flex gap={2} alignItems="center">
                      <Icon as={FcCheckmark} boxSize={5} />
                      <Text size="label.md">
                        <TrackedLink
                          href={`https://docs.web3sdk.io/contracts/${extension.docLinks.contracts}`}
                          isExternal
                          category="extension"
                          label={extension.name}
                        >
                          {extension.name}
                        </TrackedLink>
                      </Text>
                    </Flex>
                  </ListItem>
                ))}
              </>
            </List>
          </Flex>
          <Divider />
          <Flex flexDir="column" gap={4}>
            <Heading size="title.sm">Share</Heading>
            <Flex gap={2} alignItems="center">
              <ShareButton
                url={currentRoute}
                title={`${shortenIfAddress(releaserEnsOrAddress)}/${
                  release.name
                }`}
                text={`Deploy ${shortenIfAddress(releaserEnsOrAddress)}/${
                  release.name
                } in one click with web3sdkio.`}
              />
              <TrackedIconButton
                as={LinkButton}
                isExternal
                noIcon
                href={twitterIntentUrl}
                bg="transparent"
                aria-label="twitter"
                icon={<Icon boxSize={5} as={SiTwitter} />}
                category="released-contract"
                label="share-twitter"
              />
            </Flex>
          </Flex>
          <Divider />
          <Flex flexDir="column" gap={4}>
            <Flex gap={2} alignItems="center">
              <LinkButton
                href="https://docs.web3sdk.io/release"
                w="full"
                variant="outline"
                isExternal
              >
                Learn more about Release
              </LinkButton>
            </Flex>
          </Flex>
        </Flex>
      </GridItem>
    </>
  );
};
