import createNextIntlPlugin from "next-intl/plugin";
const withNextIntl = createNextIntlPlugin("./src/app/i18n/request.ts");
/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        path: false,
        crypto: false,
      };
    }
    config.experiments = {
      asyncWebAssembly: true,
      syncWebAssembly: true,
      layers: true,
    };

    return config;
  },
  output: "standalone",
  // Disable streaming metadata for all user agents so metadata is rendered in <head>
  htmlLimitedBots: /.*/,
  async redirects() {
    return [
      {
        source: "/stats/:match*",
        destination: "https://stats.tatli.me/:match*",
        permanent: true,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
