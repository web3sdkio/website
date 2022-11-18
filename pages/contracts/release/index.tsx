import { Flex, Link } from "@chakra-ui/react";
import { AppLayout } from "components/app-layouts/app";
import { DeployableContractTable } from "components/contract-components/contract-table";
import { useRouter } from "next/router";
import { PageId } from "page-id";
import { Web3sdkioNextPage } from "pages/_app";
import { ReactElement, useMemo } from "react";
import { Heading, Text } from "tw-components";

const ContractsReleasePage: Web3sdkioNextPage = () => {
  const router = useRouter();

  const ipfsHashes = useMemo(() => {
    const ipfs = router.query.ipfs;
    return Array.isArray(ipfs) ? ipfs : [ipfs || ""];
  }, [router.query]);

  return (
    <Flex gap={8} direction="column">
      <Flex gap={2} direction="column">
        <Heading size="title.md">Release Contracts</Heading>
        <Text fontStyle="italic" maxW="container.md">
          Welcome to the new web3sdkio contract deployment flow.
          <br />
          <Link
            color="primary.500"
            isExternal
            href="https://portal.web3sdk.io/release"
          >
            Learn more about releasing your contracts.
          </Link>
        </Text>
      </Flex>

      <DeployableContractTable
        contractIds={ipfsHashes}
        context="create_release"
      />
    </Flex>
  );
};

ContractsReleasePage.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};

ContractsReleasePage.pageId = PageId.ReleaseMultiple;

export default ContractsReleasePage;
