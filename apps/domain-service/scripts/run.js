const main = async () => {
  // compile contract and generate files
  const domainContractFactory = await hre.ethers.getContractFactory("Domains");
  // Initialize local ethereum network, pass in a root domain to contract constructor
  const domainContract = await domainContractFactory.deploy('characktor');
  // Wait for contract to be mined and deployed
  await domainContract.deployed();

  // log address of deployed contract
  console.log("Contract deployed to:", domainContract.address);

  // Invoke register func, pass in 'fake' matic
  let txn = await domainContract.register("wiel", {value: hre.ethers.utils.parseEther('0.1')});
  await txn.wait();

  // Invoke contract function
  const domainAddress = await domainContract.getAddress("doom");
  console.log("Owner of domain doom:", domainAddress);

  // Setting a record that doesn't belong to "me"
  txn = await domainContract.connect(randomPerson).setRecord("doom", "I want this domain");
  await txn.wait();
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