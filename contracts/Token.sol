// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Token is ERC20, ERC20Burnable, Ownable(msg.sender){

    constructor() ERC20("token", "TKN") {
        _mint(msg.sender, 1000000 * 10 ** decimals());
    }

    /// @param  to - receiver address
    /// @param amount - amount of TKN minted 
    function mint(address to, uint256 amount) public onlyOwner() {
        _mint(to, amount);
    }
}