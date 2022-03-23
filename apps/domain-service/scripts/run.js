const main = async () => {
  const [owner, randomPerson] = await hre.ethers.getSigners();
  // compile contract and generate files
  const domainContractFactory = await hre.ethers.getContractFactory("Domains");
  // Initialize local ethereum network
  const domainContract = await domainContractFactory.deploy();
  // Wait for contract to be mined and deployed
  await domainContract.deployed();
  // log address of deployed contract
  console.log("Contract deployed to:", domainContract.address);
  console.log("Contract deployed by:", owner.address);

  // Invoke contract function
  const txn = await domainContract.register("doom");
  await txn.wait();

  // Invoke contract function
  const domainOwner = await domainContract.getAddress("doom");
  console.log("Owner of domain:", domainOwner);
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