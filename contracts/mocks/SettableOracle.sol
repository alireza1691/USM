// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.0;

import "../oracles/Oracle.sol";

abstract contract SettableOracle is Oracle {
    uint public savedPrice;

    function setPrice(uint p) public {
        savedPrice = p;
    }
}
