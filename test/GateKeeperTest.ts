import { Alchemy, Network } from "alchemy-sdk"
import { expect } from "chai"
import { ethers } from "hardhat"
import { TicketAddress } from "../constants/Ticket"
import { Keypair } from "qaci-domainobjs"
import { TestMACI, TestMACI__factory, SignUpNFTGatekeeper, SignUpNFTGatekeeper__factory } from "../typechain-types"

const provider = ethers.getDefaultProvider()
const settings = {
  apiKey: `${process.env.ALCHEMY_API_KEY}`,
  network: Network.OPT_MAINNET,
}

const holders: string[] = [
  "0xe9a8A1F356bD457d33C31730F1Dbea8038835bED",
  "0x7Bb3Db8429059684Bf2cEb01861E6438B4b99FC0",
  "0x322Ebd2Aa9Df8f33cc2010AF5375aFCdDe54397e",
  "0x2C8d1FD63aa75F1B8b5b2380dA75D7Ee333C6db0",
  "0xd1fFdA9C225DDEE34f0837BF4D4a441bDd54C473",
  "0x3779cD041672a4bf2AeDc5bEf1320940a1baC89A",
  "0x22a274A520587d979436Bde4D7495137a25f0044",
  "0xD63fA8eaF82078Eb2E1515a5d892AD3B3bEa32FA",
]

const notHolder: string = "0x16c4AAc26A4171a9873297cd0c649808f8E36f30"
const holder: string = "0x3779cD041672a4bf2AeDc5bEf1320940a1baC89A"
const alchemy = new Alchemy(settings)
const ethersSigner = ethers.provider.getSigner()
//let ethersSigner: SignerWithAddress
let QFI: TestMACI
let gateKeeper: SignUpNFTGatekeeper

function createMACI() {
  const maciKey = new Keypair()
  const _pubKey = maciKey.pubKey.asContractParam()
  return _pubKey
}

describe("SignUp", function () {
  beforeEach(async () => {
    gateKeeper = await new SignUpNFTGatekeeper__factory(ethersSigner).deploy(TicketAddress)
    QFI = await new TestMACI__factory(ethersSigner).deploy(gateKeeper.address)
    await gateKeeper.connect(ethersSigner).setMaciInstance(QFI.address)
  })
  it("Success get MACI and SignUp", async () => {
    for (const holder of holders) {
      // Check off-chain front page
      const result = await alchemy.nft.getNftsForOwner(holder, { contractAddresses: [TicketAddress] })
      console.log(holder)
      if (result.ownedNfts.length < 1) {
        console.log("Do not have NFT ticket")
      } else {
        var tokenId = result.ownedNfts[0].tokenId // TODO. 여러 개 가진경우 선택한 NFT 아이디만 넘겨주게?
        console.log("📌 token ID:", tokenId)
        // Check on-chain
        const holderSigner = await ethers.getImpersonatedSigner(holder)
        const signUpGatekeeperData = ethers.utils.defaultAbiCoder.encode(["uint256"], [tokenId])
        const pubKey = createMACI()
        await QFI.connect(holderSigner).signUp(pubKey, signUpGatekeeperData)
      }
    }
  })

  it("Fail if don't have NFT ticket", async () => {
    const result = await alchemy.nft.getNftsForOwner(notHolder, { contractAddresses: [TicketAddress] })
    expect(result.ownedNfts.length).to.be.eql(0)
    const notHolderSigner = await ethers.getImpersonatedSigner(notHolder)
    const signUpGatekeeperData = ethers.utils.defaultAbiCoder.encode(["uint256"], [2])
    const pubKey = createMACI()
    await expect(QFI.connect(notHolderSigner).signUp(pubKey, signUpGatekeeperData)).to.be.revertedWith(
      "SignUpTokenGatekeeper: this user does not own the token"
    )
  })

  it("Fail if already signUp", async () => {
    const result = await alchemy.nft.getNftsForOwner(holder, { contractAddresses: [TicketAddress] })
    var tokenId = result.ownedNfts[0].tokenId

    const holderSigner = await ethers.getImpersonatedSigner(holder)
    const signUpGatekeeperData = ethers.utils.defaultAbiCoder.encode(["uint256"], [tokenId])
    const pubKey = createMACI()
    expect(await QFI.connect(holderSigner).signUp(pubKey, signUpGatekeeperData)).to.be.revertedWith(
      "SignUpTokenGatekeeper: this token has already been used to sign up"
    )
  })

  it("Fai if caller is not MACI contract", async () => {
    const signUpGatekeeperData = ethers.utils.defaultAbiCoder.encode(["uint256"], [3])
    await expect(
      gateKeeper.connect(ethersSigner).register(await ethersSigner.getAddress(), signUpGatekeeperData)
    ).to.be.revertedWith("SignUpTokenGatekeeper: only specified MACI instance can call this function")
  })
})
