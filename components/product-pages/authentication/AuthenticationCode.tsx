import { CodeOptionButton, CodeOptions } from "../common/CodeOptionButton";
import { LightMode, SimpleGrid } from "@chakra-ui/react";
import { GeneralCta } from "components/shared/GeneralCta";
import { useState } from "react";
import { Card, CodeBlock } from "tw-components";

//

const codeSnippets = {
  javascript: `import { Web3sdkioSDK } from "@web3sdkio/sdk/evm";

const sdk = new Web3sdkioSDK("goerli");

// Login with a single line of code
const payload = await sdk.auth.login();

// And verify the address of the logged in wallet
const address = await sdk.auth.verify(payload);`,
  react: `import { useSDK } from "@web3sdkio/react";

export default function App() {
 const sdk = useSDK();

 async function login() {
  // Login with a single line of code
  const payload = await sdk.auth.login();

  // And verify the address of the logged in wallet
  const address = await sdk.auth.verify(payload);
 }
}`,
  python: `from web3sdkio import Web3sdkioSDK

sdk = Web3sdkioSDK("goerli")

# Login with a single line of code
payload = sdk.auth.login();

# And verify the address of the logged in wallet
address = sdk.auth.verify(payload);`,
  go: `import "github.com/web3sdkio/go-sdk/web3sdkio"

func main() {
  sdk, err := web3sdkio.NewWeb3sdkioSDK("goerli", nil)

  // Login with a single line of code
  payload, err := sdk.Auth.Login()

  // And verify the address of the logged in wallet
  address, err := sdk.Auth.Verify(payload)
}`,
};

export const AuthenticationCode: React.FC = () => {
  const [activeLanguage, setActiveLanguage] =
    useState<CodeOptions>("javascript");

  return (
    <>
      <SimpleGrid
        gap={{ base: 2, md: 3 }}
        columns={{ base: 2, md: 4 }}
        justifyContent={{ base: "space-between", md: "center" }}
      >
        <CodeOptionButton
          setActiveLanguage={setActiveLanguage}
          activeLanguage={activeLanguage}
          language="javascript"
        >
          JavaScript
        </CodeOptionButton>
        <CodeOptionButton
          setActiveLanguage={setActiveLanguage}
          activeLanguage={activeLanguage}
          language="python"
        >
          Python
        </CodeOptionButton>
        <CodeOptionButton
          setActiveLanguage={setActiveLanguage}
          activeLanguage={activeLanguage}
          language="react"
        >
          React
        </CodeOptionButton>
        <CodeOptionButton
          setActiveLanguage={setActiveLanguage}
          activeLanguage={activeLanguage}
          language="go"
        >
          Go
        </CodeOptionButton>
      </SimpleGrid>

      <Card
        w={{ base: "full", md: "69%" }}
        borderWidth={0}
        p={0}
        outlineBorder={{
          gradient:
            "linear-gradient(147.15deg, #410AB6 30.17%, #FF8D5C 100.01%)",
          width: "5px",
        }}
      >
        <CodeBlock
          borderWidth={0}
          w="full"
          py={4}
          code={codeSnippets[activeLanguage]}
          language={activeLanguage === "react" ? "jsx" : activeLanguage}
        />
      </Card>

      <LightMode>
        <GeneralCta
          title="Explore documentation"
          size="sm"
          fontSize="20px"
          px={8}
          py={8}
          href="https://portal.web3sdk.io/auth"
          w={{ base: "full", md: "inherit" }}
        />
      </LightMode>
    </>
  );
};
