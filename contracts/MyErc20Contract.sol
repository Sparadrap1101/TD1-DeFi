pragma solidity >=0.6.0;

import "./IERC20Mintable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MyErc20Contract is IERC20Mintable, ERC20 {

    mapping (address => bool) allowedToMint;

	constructor(string memory name, string memory symbol) public ERC20(name, symbol) {

    }

	function setMinter(address minterAddress, bool isMinter) override external {
        allowedToMint[minterAddress] = isMinter;
    }

	function mint(address toAddress, uint256 amount) override external {
        require(allowedToMint[msg.sender]);
        _mint(toAddress, amount);
    }

	function burn(address toAddress, uint256 amount) external {
        require(allowedToMint[msg.sender]);
        _burn(toAddress, amount);
    }

	function isMinter(address minterAddress) override external returns (bool) {
        return allowedToMint[minterAddress];
    }
}
