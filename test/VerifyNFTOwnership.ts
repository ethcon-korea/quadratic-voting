import { Alchemy, Network } from "alchemy-sdk"
import { expect } from "chai"
import { TicketAddress } from "../constants/Ticket"

describe("BalanceOf", function () {
  it("should succeed to fetch balance of addresses", async function () {
    const settings = {
      apiKey: `${process.env.ALCHEMY_API_KEY}`,
      network: Network.OPT_MAINNET,
    }

    const alchemy = new Alchemy(settings)

    const holders: string[] = [
      "0xe9a8A1F356bD457d33C31730F1Dbea8038835bED",
      "0x1d56AbEFEC79e302808C9e392d846E8666152C1C",
      "0x1d56AbEFEC79e302808C9e392d846E8666152C1C",
      "0x7Bb3Db8429059684Bf2cEb01861E6438B4b99FC0",
      "0x1d56AbEFEC79e302808C9e392d846E8666152C1C",
      "0x1d56AbEFEC79e302808C9e392d846E8666152C1C",
      "0x9BFa49e3dD88Ab923482f7ACAa6Ee3efa87044f3",
      "0xCdFa31658459344d4c63453e1e15F0F96aE76615",
      "0x1d56AbEFEC79e302808C9e392d846E8666152C1C",
      "0x1d56AbEFEC79e302808C9e392d846E8666152C1C",
      "0x1d56AbEFEC79e302808C9e392d846E8666152C1C",
      "0x322Ebd2Aa9Df8f33cc2010AF5375aFCdDe54397e",
      "0x1d56AbEFEC79e302808C9e392d846E8666152C1C",
      "0xe9a8A1F356bD457d33C31730F1Dbea8038835bED",
      "0x7Bb3Db8429059684Bf2cEb01861E6438B4b99FC0",
      "0x1d56AbEFEC79e302808C9e392d846E8666152C1C",
      "0x1d56AbEFEC79e302808C9e392d846E8666152C1C",
      "0x1d56AbEFEC79e302808C9e392d846E8666152C1C",
      "0x7Bb3Db8429059684Bf2cEb01861E6438B4b99FC0",
      "0x290799659d0C5F56d3700D0dE334b8A561b09e57",
      "0x2C8d1FD63aa75F1B8b5b2380dA75D7Ee333C6db0",
      "0xd1fFdA9C225DDEE34f0837BF4D4a441bDd54C473",
      "0x98e565e1D8fFC9A87ae623A5eF02A6829726dee3",
      "0x3779cD041672a4bf2AeDc5bEf1320940a1baC89A",
      "0xccc2A124C284D8A9c7C67572791c7d8854F229E8",
      "0x7e54B15F7b63071Ee5F32B8B30a690379354aB4b",
    ]

    for (const holder of holders) {
      console.log(`Verifing NFT ownership of ${holder}...`)

      expect(await alchemy.nft.verifyNftOwnership(holder, TicketAddress)).to.be.true
    }
  })
})
