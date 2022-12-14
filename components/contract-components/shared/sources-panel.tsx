import { Abi, SourceFile } from "../types";
import { SourcesAccordion } from "./sources-accordion";
import { Flex } from "@chakra-ui/react";
import { Link, Text } from "tw-components";

interface SourcesPanelProps {
  sources?: SourceFile[];
  abi?: Abi;
}

export const SourcesPanel: React.FC<SourcesPanelProps> = ({ sources, abi }) => {
  return (
    <Flex flexDir="column" gap={8}>
      <Flex flexDir="column" gap={4}>
        {sources && sources?.length > 0 ? (
          <SourcesAccordion sources={sources} abi={abi} />
        ) : (
          <Text>
            Contract source code not available. Try deploying with{" "}
            <Link
              href="https://docs.web3sdk.io/deploy"
              isExternal
              color="blue.500"
            >
              web3sdkio CLI v0.5+
            </Link>
          </Text>
        )}
      </Flex>
    </Flex>
  );
};
