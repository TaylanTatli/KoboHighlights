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
};

export default nextConfig;
