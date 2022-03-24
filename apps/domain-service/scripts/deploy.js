const main = async () => {
  const domainContractFactory = await hre.ethers.getContractFactory('Domains');
  const domainContract = await domainContractFactory.deploy("Charaktor");
  await domainContract.deployed();

  console.log("Contract deployed to:", domainContract.address);

	let txn = await domainContract.register("wiel",  {value: hre.ethers.utils.parseEther('0.5')});
	await txn.wait();
  console.log("Minted domain wiel.charaktor");

  txn = await domainContract.setRecord("wiel", "25 yo Software Developer");
  await txn.wait();
  console.log("Set record for wiel.charaktor");

  const address = await domainContract.getAddress("wiel");
  console.log("Owner of domain wiel:", address);

  const balance = await hre.ethers.provider.getBalance(domainContract.address);
  console.log("Contract balance:", hre.ethers.utils.formatEther(balance));
}

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();