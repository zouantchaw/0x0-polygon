const main = async () => {
  // compile contract and generate files
  const domainContractFactory = await hre.ethers.getContractFactory("Domains");
  // Initialize local ethereum network
  const domainContract = await domainContractFactory.deploy();
  // Wait for contract to be mined and deployed
  await domainContract.deployed();
  // log address of deployed contract
  console.log("Contract deployed to:", domainContract.address);
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