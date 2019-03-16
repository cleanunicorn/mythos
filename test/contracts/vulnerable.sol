pragma solidity ^0.5.3;

contract Vulnerable {
    uint256 public n = 2^250;

    function f() public {
        selfdestruct(msg.sender);
    }

    function a() public {
        n = n * 2;
    }
}
