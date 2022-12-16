export enum PageId {
  // unknown page id (default)
  Unknown = "unknown",

  // ---------------------------------------------------------------------------
  //  marketing / growth pages
  // ---------------------------------------------------------------------------

  // web3sdk.io
  Homepage = "homepage-landing",

  // web3sdk.io
  About = "about-page",

  // web3sdk.io/auth
  AuthenticationLanding = "auth-landing",

  // web3sdk.io/release
  ReleaseLanding = "release-landing",

  // web3sdk.io/deploy
  DeployLanding = "deploy-landing",

  // web3sdk.io/contract-extensions
  ContractExtensionsLanding = "contract-extensions-landing",

  // web3sdk.io/web3-sdk
  Web3SDKLanding = "web3-sdk-landing",

  // web3sdk.io/pre-built-contracts
  PreBuiltContractsLanding = "pre-built-contracts-landing",

  // web3sdk.io/web3-dashboard
  DashboardLanding = "dashboard-landing",

  // web3sdk.io/web3-storage
  StorageLanding = "storage-landing",

  // web3sdk.io/ui-components
  UIComponentsLanding = "ui-components-landing",

  // web3sdk.io/gas
  GasEstimator = "gas-estimator",

  // web3sdk.io/hackathon/solanathon
  SolanaHackathonLanding = "solanathon",

  // web3sdk.io/404
  PageNotFound = "page-not-found",

  // ---------------------------------------------------------------------------
  //  general product pages
  // ---------------------------------------------------------------------------

  // web3sdk.io/dashboard
  Dashboard = "dashboard",

  // thridweb.com/contracts
  Contracts = "contracts",

  // thridweb.com/explore
  Explore = "explore",

  // thridweb.com/explore/[category]
  ExploreCategory = "explore-category",

  // thridweb.com/contracts
  Programs = "programs",

  // ---------------------------------------------------------------------------
  //  solutions pages
  // ---------------------------------------------------------------------------

  SolutionsCommerce = "solutions-commerce",
  SolutionsGaming = "solutions-gaming",

  // ---------------------------------------------------------------------------
  //  network pages
  // ---------------------------------------------------------------------------

  NetworkSolana = "network-solana",

  // ---------------------------------------------------------------------------
  //  faucets pages
  // ---------------------------------------------------------------------------

  FaucetSolana = "faucet-solana",

  // ---------------------------------------------------------------------------
  //  "release" product pages
  // ---------------------------------------------------------------------------

  // web3sdk.io/contracts/release
  ReleaseMultiple = "release-multiple-contracts",

  // web3sdk.io/contracts/release/:id
  ReleaseSingle = "release-single-contract",

  // web3sdk.io/:wallet
  // example: web3sdk.io/jns.eth
  Profile = "profile",

  // web3sdk.io/:wallet/:contractId
  // example: web3sdk.io/jns.eth/PermissionedERC721A
  ReleasedContract = "released-contract",

  // ---------------------------------------------------------------------------
  //  "deploy" product pages
  // ---------------------------------------------------------------------------

  // web3sdk.io/contracts/deploy
  DeployMultiple = "deploy-multiple-contracts",

  // web3sdk.io/contracts/deploy/:id
  DeploySingle = "deploy-single-contract",

  // web3sdk.io/contracts/new
  NewContract = "new-contract",

  // web3sdk.io/contracts/custom
  NewCustomContract = "new-custom-contract",

  // web3sdk.io/contracts/new/pre-built
  PreBuiltContract = "new-pre-built-contract",

  // web3sdk.io/contracts/new/pre-built/:contractCategory
  // example: web3sdk.io/contracts/new/pre-built/drop/
  PreBuiltContractCategory = "new-pre-built-contract-category",

  // web3sdk.io/contracts/new/pre-built/:contractCategory/:contractType
  // example: web3sdk.io/contracts/new/pre-built/drop/nft-drop
  PreBuiltContractType = "new-pre-built-contract-type",

  // web3sdk.io/:network/:contractAddress (evm)
  // example: web3sdk.io/goerli/0x2eaDAa60dBB74Ead3E20b23E4C5A0Dd789932846
  DeployedContract = "deployed-contract",

  // web3sdk.io/:network/:contractAddress (solana)
  // example: web3sdk.io/solana/5GYspMpsfw3Vrf7FQ37Jbhpg4PeVZHEPrfPcXY9sGQzy
  DeployedProgram = "deployed-program",
}
