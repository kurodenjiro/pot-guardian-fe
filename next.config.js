/** @type {import('next').NextConfig} */
// CHAIN_ID: 204,
// CHAIN_NAME: "opBNB",
// CHAIN_NETWORK: "opBNB",
// TOKEN: "BNB",
// SYMBOL: "tBNB",
// RPC: "https://opbnb-mainnet-rpc.bnbchain.org",
// URL_FAUCET: "https://opbnb-testnet-bridge.bnbchain.org/deposit",
// NFT_ADDRESS:'0xdd6E85bC17cF6851A9919A19E5f354Af0D312A6B',
// TOKEN_ADDRESS:'0x4710F75e172831D5D37B4a8506E43556e4b452cb',
// FAUCET_ADDRESS:'0x077035f863022d3dc9422b5d0c6Be62446034cCC',
// DAO_ADDRESS:'0x294041aC4ed65f7cba6B2182C2c10193fedDB9fE',
// EXPLORER_URL:'https://op-bnb-testnet-explorer-api.nodereal.io',
// HOST:'https://joygotchi-bnb.vercel.app'

// CHAIN_ID: 5611,
// CHAIN_NAME: "opBNB Testnet",
// CHAIN_NETWORK: "opBNB",
// TOKEN: "BNB",
// SYMBOL: "tBNB",
// RPC: "https://opbnb-testnet-rpc.bnbchain.org",
// URL_FAUCET: "https://opbnb-testnet-bridge.bnbchain.org/deposit",
// NFT_ADDRESS:'0xe966Dd4DfBc97F37470B8F9C26Fc83EFa15339E5',
// TOKEN_ADDRESS:'0x0B47EEB7290D413D2a51273cf7fd440c6f53E8e4',
// FAUCET_ADDRESS:'0x20449b21e2DDb4a1C335C2e65DD731482450558f',
// DAO_ADDRESS:'0x410EaA07644593d428568eA1B6b435e6f6Ad3C4D',
// EXPLORER_URL:'https://op-bnb-testnet-explorer-api.nodereal.io',
// HOST:'https://joygotchi-bnb.vercel.app'
const nextConfig = {
  reactStrictMode: true,
  env: {
    CHAIN_ID: 314159,
    CHAIN_NAME: "Filecoin - Calibration testnet",
    CHAIN_NETWORK: "fevm",
    TOKEN: "tFIL",
    SYMBOL: "tFIL",
    RPC: "https://api.calibration.node.glif.io/",
    URL_FAUCET: "https://faucet.calibnet.chainsafe-fil.io/funds.html",
    NFT_ADDRESS: '0x9b57e2E0717E39a107c2F80B9165c49B2089835C',
    TOKEN_ADDRESS: '0x1fb0D724A433832f9f05929139A9D1af065F0B8B',
    FAUCET_ADDRESS: '0x5950cF7303605acBC5B274E8cA658542832Cb9a3',
    DAO_ADDRESS: '0x410EaA07644593d428568eA1B6b435e6f6Ad3C4D',
    EXPLORER_URL: 'https://calibration.filscan.io',
    HOST: 'http://localhost:3000',
    MONGODB_USER:"kurodenjiro",
    MONGODB_PASSWORD:"potguardian"
  },
}
module.exports = nextConfig