pragma solidity 0.5.1;

library External {
  function increment(uint256 _n) public pure returns (uint256) {
    return (_n + 1);
  }
}
