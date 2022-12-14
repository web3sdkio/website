const ContentSecurityPolicy = `
  default-src 'self';
  img-src * data: blob:;
  media-src * data: blob:;
  object-src 'none';
  style-src 'self' 'unsafe-inline' fonts.googleapis.com unpkg.com;
  font-src 'self' fonts.gstatic.com;
  frame-src *;
  script-src 'self' 'unsafe-eval' 'unsafe-inline' *.web3sdk.io vercel.live;
  connect-src * data:;
  block-all-mixed-content;
`;

const securityHeaders = [
  {
    key: "X-DNS-Prefetch-Control",
    value: "on",
  },
  {
    key: "X-XSS-Protection",
    value: "1; mode=block",
  },
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  {
    key: "Referrer-Policy",
    value: "origin-when-cross-origin",
  },
  {
    key: "Content-Security-Policy",
    value: ContentSecurityPolicy.replace(/\s{2,}/g, " ").trim(),
  },
];

/** @type {import('next').NextConfig} */
const moduleExports = {
  async headers() {
    return [
      {
        // Apply these headers to all routes in your application.
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/portal/:match*",
        destination: "https://docs.web3sdk.io/:match*",
        permanent: true,
      },
      {
        source: "/dashboard/publish/:path*",
        destination: "/contracts/publish/:path*",
        permanent: false,
      },
      {
        source: "/dashboard/mumbai/publish/:path*",
        destination: "/contracts/publish/:path*",
        permanent: false,
      },
      {
        source: "/privacy",
        destination: "/web3sdkio_Privacy_Policy_May_2022.pdf",
        permanent: false,
      },
      {
        source: "/tos",
        destination: "/Web3sdkio_Terms_of_Service.pdf",
        permanent: false,
      },
      {
        source: "/contracts/publish",
        destination: "/contracts/release",
        permanent: false,
      },
      {
        source: "/authentication",
        destination: "/auth",
        permanent: false,
      },
      {
        source: "/extensions",
        destination: "/contractkit",
        permanent: false,
      },
      //  old (deprecated) routes
      {
        source:
          "/:network/(edition|nft-collection|token|pack|nft-drop|signature-drop|edition-drop|token-drop|marketplace|split|vote)/:address",
        destination: "/:network/:address",
        permanent: false,
      },
      // prebuilt contract deploys
      {
        source: "/contracts/new/:slug*",
        destination: "/contracts",
        permanent: false,
      },
    ];
  },
  images: {
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    domains: ["web3sdk.io", "docs.web3sdk.io", "blog.web3sdk.io"],
  },
  reactStrictMode: true,
  experimental: {
    scrollRestoration: true,
  },
};

// eslint-disable-next-line @typescript-eslint/no-var-requires
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { withSentryConfig } = require("@sentry/nextjs");

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { withPlausibleProxy } = require("next-plausible");

const sentryWebpackPluginOptions = {
  // Additional config options for the Sentry Webpack plugin. Keep in mind that
  // the following options are set automatically, and overriding them is not
  // recommended:
  //   release, url, org, project, authToken, configFile, stripPrefix,
  //   urlPrefix, include, ignore

  // Suppresses all logs
  silent: true,
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options.

  hideSourceMaps: false,
};
module.exports = withPlausibleProxy({
  customDomain: "https://pl.web3sdk.io",
  scriptName: "pl",
})(
  withBundleAnalyzer(
    withSentryConfig(moduleExports, sentryWebpackPluginOptions),
  ),
);
