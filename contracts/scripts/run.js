const main = async () => {
  const contractFactory = await hre.ethers.getContractFactory("WeirdPortal");
  const contract = await contractFactory.deploy({
    value: hre.ethers.utils.parseEther("0.01"),
  });
  await contract.deployed();
  console.log("Contract addy: ", contract.address);

  let contractBalance = await hre.ethers.provider.getBalance(contract.address);
  console.log(
    "Contract balance: ",
    hre.ethers.utils.formatEther(contractBalance)
  );

  let greetingsTxn1 = await contract.greeting("Message #1!");
  await greetingsTxn1.wait();

  let greetingsTxn2 = await contract.greeting("Message #2!");
  await greetingsTxn2.wait();

  contractBalance = await hre.ethers.provider.getBalance(contract.address);
  console.log(
    "Contract balance: ",
    hre.ethers.utils.formatEther(contractBalance)
  );

  let allGreetings = await contract.getAllGreetings();
  console.log(allGreetings);

  let totalGreetings = await contract.getTotalGreetings();
  console.log(totalGreetings);
};

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
