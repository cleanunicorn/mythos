pragma solidity 0.5.1;

import "./external-lib.sol";

contract UseExternalLib {
  function useExternal(uint256 _n) public pure returns (uint256) {
    return External.increment(_n);
  }
}
