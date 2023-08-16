import "@nomicfoundation/hardhat-chai-matchers"
import "@nomicfoundation/hardhat-network-helpers"
import "@nomiclabs/hardhat-ethers"
import "@nomiclabs/hardhat-etherscan"
import "@typechain/hardhat"
import "alchemy-sdk"
import * as dotenv from "dotenv"
import "hardhat-change-network"
import { HardhatUserConfig } from "hardhat/config"

dotenv.config()

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.1",
    settings: {
      optimizer: {
        enabled: true,
        runs: 1000,
      },
    },
  },
  networks: {
    hardhat: {
      allowUnlimitedContractSize: true,
      blockGasLimit: 30_000_000,
      forking: {
        url: "https://opt-mainnet.g.alchemy.com/v2/" + process.env.ALCHEMY_API_KEY,
        enabled: true,
        blockNumber: 107805900,
      },
    },
    localhost: {
      url: "http://127.0.0.1:8545/",
    },
    optimism: {
      url: "https://rpc.ankr.com/optimism",
      chainId: 10,
      accounts: [`0x${process.env.DEPLOYER_PRIVATE_KEY}`],
    },
  },
  paths: {
    sources: "./contracts",
    cache: "./cache",
    artifacts: "./artifacts",
  },
}

export default config
