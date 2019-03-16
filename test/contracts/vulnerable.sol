pragma solidity ^0.5.3;

contract A {
    uint256 public n = 2^250;

    function f() public {
        selfdestruct(msg.sender);
    }

    function a() public {
        n = n * 2;
    }
}
