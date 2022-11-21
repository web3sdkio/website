import { Box, Flex, Select } from "@chakra-ui/react";
import { SmartContract } from "@web3sdkio/sdk/dist/declarations/src/evm/contracts/smart-contract";
import { useContractFunctions } from "components/contract-components/hooks";
import { CodeSegment } from "components/contract-tabs/code/CodeSegment";
import { Environment } from "components/contract-tabs/code/types";
import { useSingleQueryParam } from "hooks/useQueryParam";
import { useMemo, useState } from "react";
import { Card, Heading, Text } from "tw-components";
import { SupportedNetwork } from "utils/network";

interface CodeOverviewProps {
  contract: SmartContract | null;
}

const COMMANDS = {
  install: {
    javascript: "npm install @web3sdkio/sdk ethers",
    react: "npm install @web3sdkio/react @web3sdkio/sdk ethers",
    web3button: "npm install @web3sdkio/react @web3sdkio/sdk ethers",
    python: "pip install web3sdkio-sdk",
    go: "go get github.com/web3sdkio/go-sdk/web3sdkio",
  },
  setup: {
    javascript: `import { Web3sdkioSDK } from "@web3sdkio/sdk/evm";

const sdk = new Web3sdkioSDK("{{chainName}}");
const contract = await sdk.getContract("{{contract_address}}");`,
    react: `import { useContract } from "@web3sdkio/react";

export default function Component() {
  // While isLoading is true, contract is undefined.
  const { contract, isLoading, error } = useContract("{{contract_address}}");
  // Now you can use the contract in the rest of the component
}`,
    web3button: `import { Web3Button } from "@web3sdkio/react";

export default function Component() {
  return (
    <Web3Button
      contractAddress="{{contract_address}}"
      action={(contract) => {
        // Any action with your contract
      }}
    >
      Do something
    </Web3Button>
  )
}`,
    python: `from web3sdkio import Web3sdkioSDK

sdk = Web3sdkioSDK("{{chainName}}")
contract = sdk.get_contract("{{contract_address}}")`,
    go: `import "github.com/web3sdkio/go-sdk/web3sdkio"

sdk, err := web3sdkio.NewWeb3sdkioSDK("{{chainName}}")
contract, err := sdk.GetContract("{{contract_address}}")
`,
  },
  read: {
    javascript: `const data = await contract.call("{{function}}", {{args}})`,
    react: `import { useContract, useContractRead } from "@web3sdkio/react";

export default function Component() {
  const { contract } = useContract("{{contract_address}}");
  const { data, isLoading } = useContractRead(contract, "{{function}}", {{args}})
}`,
    python: `data = contract.call("{{function}}", {{args}})`,
    go: `data, err := contract.Call("{{function}}", {{args}})`,
  },
  write: {
    javascript: `const data = await contract.call("{{function}}", {{args}})`,
    react: `import { useContract, useContractWrite } from "@web3sdkio/react";

export default function Component() {
  const { contract } = useContract("{{contract_address}}");
  const { mutateAsync: {{function}}, isLoading } = useContractWrite(contract, "{{function}}")

  const call = async () => {
    try {
      const data = await {{function}}([ {{args}} ]);
      console.info("contract call successs", data);
    } catch (err) {
      console.error("contract call failure", err);
    }
  }
}`,
    web3button: `import { Web3Button } from "@web3sdkio/react";

export default function Component() {
  return (
    <Web3Button
      contractAddress="{{contract_address}}"
      action={(contract) => {
        contract.call("{{function}}", {{args}})
      }}
    >
      {{function}}
    </Web3Button>
  )
}`,
    python: `data = contract.call("{{function}}", {{args}})`,
    go: `data, err := contract.Call("{{function}}", {{args}})`,
  },
};

interface SnippetOptions {
  contractAddress?: string;
  fn?: string;
  args?: string[];
  chainName?: string;
}

function formatSnippet(
  snippet: Record<Environment, any>,
  { contractAddress, fn, args, chainName }: SnippetOptions,
) {
  const code = { ...snippet };
  for (const key of Object.keys(code)) {
    const env = key as Environment;

    code[env] = code[env]
      ?.replace(/{{contract_address}}/gm, contractAddress)
      ?.replace(/{{chainName}}/gm, chainName || "goerli")
      ?.replace(/{{function}}/gm, fn || "");

    if (args && args?.some((arg) => arg)) {
      code[env] = code[env]?.replace(/{{args}}/gm, args?.join(", ") || "");
    } else {
      code[env] = code[env]
        ?.replace(", {{args}}", "")
        ?.replace("{{args}}, ", "");
    }
  }

  return code;
}

export const CodeOverview: React.FC<CodeOverviewProps> = ({ contract }) => {
  const chainName = useSingleQueryParam<SupportedNetwork>("networkOrAddress");
  const [environment, setEnvironment] = useState<Environment>("react");

  const functions = useContractFunctions(contract);
  const { readFunctions, writeFunctions } = useMemo(() => {
    return {
      readFunctions: functions?.filter(
        (f) => f.stateMutability === "view" || f.stateMutability === "pure",
      ),
      writeFunctions: functions?.filter(
        (f) => f.stateMutability !== "view" && f.stateMutability !== "pure",
      ),
    };
  }, [functions]);

  const [read, setRead] = useState(
    readFunctions && readFunctions.length > 0 ? readFunctions[0].name : "",
  );
  const [write, setWrite] = useState(
    writeFunctions && writeFunctions.length > 0 ? writeFunctions[0].name : "",
  );

  return (
    <>
      <Card as={Flex} flexDirection="column" gap={3}>
        <Heading size="title.sm">Getting Started</Heading>
        <Text>First, install the latest version of the SDK.</Text>
        <CodeSegment
          environment={environment}
          setEnvironment={setEnvironment}
          snippet={COMMANDS.install}
          isInstallCommand
        />
        <Text>
          Follow along below to get started using this contract in your code.
        </Text>
        <CodeSegment
          environment={environment}
          setEnvironment={setEnvironment}
          snippet={formatSnippet(COMMANDS.setup as any, {
            contractAddress: contract?.getAddress(),
            chainName,
          })}
          hideTabs
        />
      </Card>
      <Card as={Flex} flexDirection="column" gap={3}>
        <Flex align="center" justify="space-between">
          <Heading size="title.sm">Reading Data</Heading>
        </Flex>
        <Text>
          Once you setup your contract, you can read data from contract
          functions as follows:
        </Text>
        <Flex>
          <Box>
            <Select
              variant="outline"
              value={read}
              onChange={(e) => setRead(e.target.value)}
            >
              {readFunctions?.map((f, i) => (
                <option value={f.name} key={i}>
                  {f.name}
                </option>
              ))}
            </Select>
          </Box>
        </Flex>
        <CodeSegment
          environment={environment}
          setEnvironment={setEnvironment}
          snippet={formatSnippet(COMMANDS.read as any, {
            contractAddress: contract?.getAddress(),
            fn: read,
            args: readFunctions
              ?.find((f) => f.name === read)
              ?.inputs?.map((i) => i.name),
            chainName,
          })}
        />
      </Card>
      <Card as={Flex} flexDirection="column" gap={3}>
        <Flex align="center" justify="space-between">
          <Heading size="title.sm">Writing Data</Heading>
        </Flex>
        <Text>
          And you can also make write function calls with the following setup:
        </Text>
        <Flex>
          <Box>
            <Select
              variant="outline"
              value={write}
              onChange={(e) => setWrite(e.target.value)}
            >
              {writeFunctions?.map((f, i) => (
                <option value={f.name} key={i}>
                  {f.name}
                </option>
              ))}
            </Select>
          </Box>
        </Flex>
        <CodeSegment
          environment={environment}
          setEnvironment={setEnvironment}
          snippet={formatSnippet(COMMANDS.write as any, {
            contractAddress: contract?.getAddress(),
            fn: write,
            args: writeFunctions
              ?.find((f) => f.name === write)
              ?.inputs?.map((i, index) => i.name || `arg${index}`),
            chainName,
          })}
        />
      </Card>
    </>
  );
};
