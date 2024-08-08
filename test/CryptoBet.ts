import { time, loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { exec } from "child_process";
import { createPrivateKey } from "crypto";
import { ethers } from "hardhat";

describe("CryptoBet", function () {
    async function deployTokenFixture() {
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
        const tokenAddr = await token.getAddress()

        const CryptoBet = await ethers.getContractFactory("CryptoBet")
        const cryptoBet = await CryptoBet.connect(owner).deploy(tokenAddr, ethers.parseUnits("1", "20"));
        return {owner, players, token, cryptoBet}
    }

    describe("Initialisation", function() {
        it("successful initialisation of token", async function () {
            const { token } = await loadFixture(deployTokenFixture)
            expect(await token.totalSupply()).to.equal(ethers.parseUnits('1', '24'))
            // 1000000 * 10e18 = 1000000 token
        })
        it("successful initialisation of cryptoBet", async function () {
            const { owner, cryptoBet } = await loadFixture(deployTokenFixture)
            expect(await cryptoBet.owner()).to.equal(owner.address)
        })
    })

    describe("minting of token", function() {
        it("successful minting of token to player", async function() {
            const { token, players } = await loadFixture(deployTokenFixture)
            await token.mint(players[1].address, ethers.parseUnits('1', '20'))
            expect(await token.balanceOf(players[1].address)).to.equal(
                ethers.parseUnits('1', '20')
            )
        })
    })

    describe("depositing bet", function() {
        it("successfully deposit of player1", async function() {
            const {cryptoBet, token, players} = await loadFixture(deployTokenFixture)
            await token.mint(players[1].address, ethers.parseUnits('1', '20'))
            await token.connect(players[1]).approve(await cryptoBet.getAddress(), ethers.parseUnits('1', '20'))
            await cryptoBet.connect(players[1]).bet(1)
            expect(await token.balanceOf(players[1].address)).to.equal(0)
        })
        it("fails to deposit of player1 on closed window", async function() {
            const {cryptoBet, token, players} = await loadFixture(deployTokenFixture)
            await token.mint(players[1].address, ethers.parseUnits('1', '20'))
            await token.connect(players[1]).approve(await cryptoBet.getAddress(), ethers.parseUnits('1', '20'))
            await cryptoBet.window(false);
            await expect(cryptoBet.connect(players[1]).bet(1)).to.be.revertedWithoutReason()
        })
        it("failure of deposit at second time", async function() {
            const {cryptoBet, token, players } = await loadFixture(deployTokenFixture)
            await token.mint(players[1].address, ethers.parseUnits('2', '20'))
            await token.connect(players[1]).approve(await cryptoBet.getAddress(), ethers.parseUnits('2', '20'))
            await cryptoBet.connect(players[1]).bet(1)
            await expect(cryptoBet.connect(players[1]).bet(1)).to.be.revertedWithoutReason()

        })
    })
})

