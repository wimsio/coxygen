/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  webpack: function (config, options) {
    config.experiments = {
      asyncWebAssembly: true,
      layers: true,
      topLevelAwait: true,
    };
    return config;
  },
  env: {
    TITLE: 'Helios Smart Contract Example : VESTING IMPROVED',
    WALLET_CONNECTION_MESSAGE: 'Click wallet circle:',
    NEXT_PUBLIC_BLOCKFROST_API_KEY : 'preprodh0Mr07iXe1BwHLeKBKn58TYqDej2JCZm',
    NEXT_PUBLIC_BLOCKFROST_API : 'https://cardano-preprod.blockfrost.io/api/v0',
    NEXT_PUBLIC_NETWORK_PARAMS_URL : 'https://d1t0d7c2nekuk0.cloudfront.net/preprod.json',
  },
};
module.exports = nextConfig;