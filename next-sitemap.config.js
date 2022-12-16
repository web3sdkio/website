/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || "https://web3sdk.io",
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
      },
      {
        userAgent: "*",
        disallow: ["/_og"],
      },
    ],
  },
  transform: async (config, path) => {
    // ignore og image paths
    if (path.includes("_og")) {
      return null;
    }

    // rewwrite paths that include deployer to use web3sdkio.eth directly
    if (path.includes("deployer.web3sdkio.eth")) {
      path = path.replace("deployer.web3sdkio.eth", "web3sdkio.eth");
    }
    return {
      // => this will be exported as http(s)://<config.siteUrl>/<path>
      loc: path,
      changefreq: config.changefreq,
      priority: config.priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
      alternateRefs: config.alternateRefs ?? [],
    };
  },
};
