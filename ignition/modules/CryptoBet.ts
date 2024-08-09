import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import { ethers } from "hardhat";
// 0x5FbDB2315678afecb367f032d93F642f64180aa3 token deployed on local network 

const tokenAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"
const BetPrice = 1 // 100 token

const CryptoBetModule = buildModule("CryptoBetModule", (m: any) => {
    const token = m.getParameter("token", tokenAddress)
    const betPrice = m.getParameter("betPrice", BetPrice)
    const cryptoBet = m.contract("CryptoBet", [token, betPrice])
    return cryptoBet
})

export default CryptoBetModule
