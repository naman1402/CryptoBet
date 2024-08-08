import { time, loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { ethers } from "hardhat";

describe("CryptoBet", function () {
    async function deployFixture() {
        const [owner] = await ethers.getSigners()
        const players = []

        for (let i = 0; i <= 20; i++) {
            const wallet = ethers.Wallet.createRandom().connect(ethers.provider)
            await owner.sendTransaction({
                to: wallet.address,
                value: ethers.parseEther("1")
            })
            players.push(wallet)
        }

        const Token = await ethers.getContractFactory("Token")
        const token = await Token.connect(owner).deploy()

        const CryptoBet = await ethers.getContractFactory("CryptoBet")
        const cryptoBet = await CryptoBet.connect(owner).deploy(token.getAddress, ethers.parseUnits("1", "20"));
        return {owner, players, token, cryptoBet}
    }

    describe("Initialisation", function() {
    
    })
})

