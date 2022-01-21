var TDErc20 = artifacts.require("ERC20TD.sol");
var ERC20Claimable = artifacts.require("ERC20Claimable.sol");
var evaluator = artifacts.require("Evaluator.sol");
var myContract = artifacts.require("MyContract.sol");
var myErc20Contract = artifacts.require("MyErc20Contract.sol");


module.exports = (deployer, network, accounts) => {
    deployer.then(async () => {
        await deployTDToken(deployer, network, accounts); 
        await deployEvaluator(deployer, network, accounts); 
        // await setPermissionsAndRandomValues(deployer, network, accounts); 
        // await deployRecap(deployer, network, accounts);
		await deployMyErc20Contract(deployer, network, accounts);
		await deployMyContract(deployer, network, accounts);
		await submitExercice(deployer, network, accounts);
		await exo1(deployer, network, accounts);
		await exo2(deployer, network, accounts);
		await exo3(deployer, network, accounts);
		await exo4(deployer, network, accounts);
		await exo5(deployer, network, accounts);
		await exo6(deployer, network, accounts);
		await exo7(deployer, network, accounts);
		await exo8(deployer, network, accounts);
		await exo9(deployer, network, accounts);
		await getResults(deployer, network, accounts);
    });
};

async function deployTDToken(deployer, network, accounts) {
	// TDToken = await TDErc20.new("TD-ERC20-101","TD-ERC20-101",web3.utils.toBN("20000000000000000000000000000"))
	// ClaimableToken = await ERC20Claimable.new("ClaimableToken","CLTK",web3.utils.toBN("20000000000000000000000000000"))
	TDToken = await TDErc20.at("0xccCf36429190773Fd604a808Cb03f682136B007e")
	ClaimableToken = await ERC20Claimable.at("0x754a4F8D05f9A4157C355d42E8334999Ea5d66c9")
}

async function deployEvaluator(deployer, network, accounts) {
	// Evaluator = await evaluator.new(TDToken.address, ClaimableToken.address)
	Evaluator = await evaluator.at("0x1987D516D14eBf3025069504b1aD2257516C426a")
}

async function setPermissionsAndRandomValues(deployer, network, accounts) {
	await TDToken.setTeacher(Evaluator.address, true)
}

async function deployRecap(deployer, network, accounts) {
	console.log("TDToken " + TDToken.address)
	console.log("ClaimableToken " + ClaimableToken.address)
	console.log("Evaluator " + Evaluator.address)
}

async function deployMyErc20Contract(deployer, network, accounts) {
	MyErc20Contract = await myErc20Contract.new("MyToken", "MTK");
}

async function deployMyContract(deployer, network, accounts) {
	MyContract = await myContract.new(ClaimableToken.address, MyErc20Contract.address);
}

async function submitExercice(deployer, network, accounts) {
	console.log("\n> Submit: ", await Evaluator.exerciceProgression(accounts[0], 0));
	await Evaluator.submitExercice(MyContract.address);
	console.log("> Submit: ", await Evaluator.exerciceProgression(accounts[0], 0));
}

async function exo1(deployer, network, accounts) {
	console.log("\n> Exo 1: ", await Evaluator.exerciceProgression(accounts[0], 1));
	await ClaimableToken.claimTokens();
	await Evaluator.ex1_claimedPoints();
	console.log("> Exo 1: ", await Evaluator.exerciceProgression(accounts[0], 1));
}

async function exo2(deployer, network, accounts) {
	console.log("\n> Exo 2: ", await Evaluator.exerciceProgression(accounts[0], 2));
	//Evaluator.sendTransaction({from:accounts[0],value:1000000000000000000});
	//web3.eth.sendTransaction({to:Evaluator.address, from:accounts[0], value: 1000000000000000000});
	await Evaluator.ex2_claimedFromContract();
	console.log("> Exo 2: ", await Evaluator.exerciceProgression(accounts[0], 2));
}

async function exo3(deployer, network, accounts) {
	console.log("\n> Exo 3: ", await Evaluator.exerciceProgression(accounts[0], 3));
	// Need to setMinter() only at exo7 but can't run exo3 & exo6 without it because it call the same functions as exo8 & exo9 (with a mint needed later).
	await MyErc20Contract.setMinter(MyContract.address, true); 
	await Evaluator.ex3_withdrawFromContract();
	console.log("> Exo 3: ", await Evaluator.exerciceProgression(accounts[0], 3));
}

async function exo4(deployer, network, accounts) {
	console.log("\n> Exo 4: ", await Evaluator.exerciceProgression(accounts[0], 4));
	console.log(">>  Allowance before: ", (await ClaimableToken.allowance(accounts[0], MyContract.address)).toString());
	await ClaimableToken.approve(MyContract.address, 1000);
	await Evaluator.ex4_approvedExerciceSolution();
	console.log(">>  Allowance after: ", (await ClaimableToken.allowance(accounts[0], MyContract.address)).toString());
	console.log("> Exo 4: ", await Evaluator.exerciceProgression(accounts[0], 4));
}

async function exo5(deployer, network, accounts) {
	console.log("\n> Exo 5: ", await Evaluator.exerciceProgression(accounts[0], 5));
	console.log(">>  Allowance before: ", (await ClaimableToken.allowance(accounts[0], MyContract.address)).toString());
	await ClaimableToken.approve(MyContract.address, 0);
	await Evaluator.ex5_revokedExerciceSolution();
	console.log(">>  Allowance after: ", (await ClaimableToken.allowance(accounts[0], MyContract.address)).toString());
	console.log("> Exo 5: ", await Evaluator.exerciceProgression(accounts[0], 5));
}

async function exo6(deployer, network, accounts) {
	console.log("\n> Exo 6: ", await Evaluator.exerciceProgression(accounts[0], 6));
	await Evaluator.ex6_depositTokens();
	console.log("> Exo 6: ", await Evaluator.exerciceProgression(accounts[0], 6));
}

async function exo7(deployer, network, accounts) {
	console.log("\n> Exo 7: ", await Evaluator.exerciceProgression(accounts[0], 7));
	await Evaluator.ex7_createERC20();
	console.log("> Exo 7: ", await Evaluator.exerciceProgression(accounts[0], 7));
}

async function exo8(deployer, network, accounts) {
	console.log("\n> Exo 8: ", await Evaluator.exerciceProgression(accounts[0], 8));
	await Evaluator.ex8_depositAndMint();
	console.log("> Exo 8: ", await Evaluator.exerciceProgression(accounts[0], 8));
}

async function exo9(deployer, network, accounts) {
	console.log("\n> Exo 9: ", await Evaluator.exerciceProgression(accounts[0], 9));
	await Evaluator.ex9_withdrawAndBurn();
	console.log("> Exo 9: ", await Evaluator.exerciceProgression(accounts[0], 9));
}

async function getResults(deployer, network, accounts) {
	grade = (await TDToken.balanceOf(accounts[0])).toString()
	console.log("\n> Final grade: ", web3.utils.fromWei(grade, 'ether'));
}