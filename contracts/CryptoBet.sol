// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";
import "./Token.sol";

contract CryptoBet is Ownable(msg.sender){
    Token private _token;

    /// @dev option will be 0 or 1
    struct Player {
        address playerAddress;
        uint outcome;
    }

    mapping(uint256 => Player) private _players;
    bool private _window;
    uint256 _betPrice;
    uint256 private _playerId;
    uint256 public voteOnOne;
    uint256 public voteOnTwo;

    constructor(Token token, uint256 betPrice) {
        _token = token;
        _betPrice = betPrice;
        _window = true;
        _playerId = 1;
    }

    /// @dev Deposit of bet option between 2 parties
    /**
     * 0: betting on outcome 1
     * 1: betting on outcome 2
    */
   function bet(uint256 option) external checkWindow() checkLimit() checkOutcome(option) checkVote(msg.sender){
    _token.transferFrom(msg.sender, owner(), _betPrice);
    _players[_playerId].playerAddress = msg.sender;
    _players[_playerId].outcome = option;
    if (option == 0) {
        voteOnOne++;
    } else {
        voteOnTwo++;
    }
    _playerId++;
   }

   function settle(uint256 option) public onlyOwner() {
    (bool success, uint256 totalBet) = Math.tryMul(_betPrice, _playerId);
    require(success);
    uint256 winningAmt;
    if (option == 0) {
        (bool _success, uint256 winning) = Math.tryDiv(totalBet, voteOnOne);
        winningAmt = winning;
        require(_success);
    } else {
        (bool _success, uint256 winning) = Math.tryDiv(totalBet, voteOnTwo);
        winningAmt = winning;
        require(_success);
    }

    for (uint256 i = 0; i < _playerId; i++) {
        if(_players[i].outcome == option) {
            _token.transferFrom(owner(), _players[i].playerAddress, winningAmt);
        }
    }

    _playerId = 0;
    voteOnOne = 0;
    voteOnTwo = 0;
   }

   function window(bool open) public onlyOwner() returns(bool) {
    _window = open;
    return _window;
   }

   // ======= MODIFIER ==========

   modifier checkWindow() {
    require(_window);
    _;
   }
   modifier checkOutcome(uint256 outcome) {
    require(outcome == 1 || outcome == 0);
    _;
   }
    modifier checkLimit {
        require(_playerId<=20);
        _;
    }
    modifier checkVote(address voter) {
        bool freshVote = true;
        for (uint256 i = 0; i < _playerId; i++) {
            if(_players[i].playerAddress == voter) {
                freshVote = false;
            }
        }
        require(freshVote);
        _;
    }
    


}