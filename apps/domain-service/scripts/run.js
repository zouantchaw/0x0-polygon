const main = async () => {
  // compile contract and generate files
  const domainContractFactory = await hre.ethers.getContractFactory("Domains");
  // Initialize local ethereum network, pass in a root domain to contract constructor
  const domainContract = await domainContractFactory.deploy('charaktor');
  // Wait for contract to be mined and deployed
  await domainContract.deployed();

  // log address of deployed contract
  console.log("Contract deployed to:", domainContract.address);

  // Invoke register func, pass in 'fake' matic
  let txn = await domainContract.register("wiel", {value: hre.ethers.utils.parseEther('0.8')});
  await txn.wait();

  // Invoke contract function
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