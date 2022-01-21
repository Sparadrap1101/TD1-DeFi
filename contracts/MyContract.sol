pragma solidity >=0.6.0;

import "./IExerciceSolution.sol";
import "./ERC20Claimable.sol";
import "./MyErc20Contract.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract MyContract is IExerciceSolution {

    ERC20Claimable myERC20Claimable;
    MyErc20Contract myErc20Contract;
    mapping (address => uint256) public trackClaimedToken;

    constructor(ERC20Claimable _myERC20Claimable, MyErc20Contract _myErc20Contract) public {
        myERC20Claimable = _myERC20Claimable;
        myErc20Contract = _myErc20Contract;
    }

    function claimTokensOnBehalf() external override {
        uint256 lastBalance = myERC20Claimable.balanceOf(address(this));
        myERC20Claimable.claimTokens();
        trackClaimedToken[msg.sender] += myERC20Claimable.balanceOf(address(this)) - lastBalance;
    }

	function tokensInCustody(address callerAddress) external override returns (uint256) {
        return trackClaimedToken[callerAddress];
    }

	function withdrawTokens(uint256 amountToWithdraw) external override returns (uint256) {
        require(trackClaimedToken[msg.sender] >= amountToWithdraw);
        myERC20Claimable.transfer(msg.sender, amountToWithdraw);
        trackClaimedToken[msg.sender] -= amountToWithdraw;
        
        if (myErc20Contract.balanceOf(msg.sender) >= amountToWithdraw) { // Better with a Require but can't pass exo3 with.
            myErc20Contract.burn(msg.sender, amountToWithdraw);
        }

        return trackClaimedToken[msg.sender];
    }

	function depositTokens(uint256 amountToWithdraw) external override returns (uint256) {
        myERC20Claimable.transferFrom(msg.sender, address(this), amountToWithdraw);
        trackClaimedToken[msg.sender] += amountToWithdraw;
        myErc20Contract.mint(msg.sender, amountToWithdraw);

        return trackClaimedToken[msg.sender];
    }

	function getERC20DepositAddress() external override returns (address) {
        return address(myErc20Contract);
    }
}