import { useState, useEffect } from "react";
import { ethers } from "ethers";
import abi from "../../artifacts/contracts/WeirdPortal.sol/WeirdPortal.json";

import Card from "../components/Card";

export default function Home() {
  const [currentAccount, setCurrentAccount] = useState("");
  const [allGreetings, setAllGreetings] = useState([]);
  const contractAddress = "0x8B06964c8082c6997A228a32239A230a6Df92a02";
  const contractABI = abi.abi;

  const [greetingMessage, setGreetingMessage] = useState("");

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        console.log("Make sure you have Metamask!");
        return;
      } else {
        console.log("We have ethereum object ", ethereum);
      }

      const accounts = await ethereum.request({ method: "eth_accounts" });
      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account: ", account);
        setCurrentAccount(account);
        getAllGreetings();
      } else {
        console.log("No authorized account found");
      }
    } catch (error) {
      console.log("ERROR", error);
    }
  };

  const getAllGreetings = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const portalContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        const greetings = await portalContract.getAllGreetings();

        let greetingsCleaned = [];
        greetings.forEach((greeting) => {
          greetingsCleaned.push({
            address: greeting.chum,
            timestamp: new Date(greeting.timestamp * 1000),
            message: greeting.message,
          });
        });
        setAllGreetings(greetingsCleaned);
      } else {
        console.log("Ethereum object doesn't exist");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        alert("Get Metamask!");
        return;
      }
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      console.log("Connected ", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  const greeting = async (msg) => {
    setGreetingMessage("");
    try {
      if (!currentAccount) {
        alert("Please connect your wallet 🦊");
      }
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const portalContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        let count = await portalContract.getTotalGreetings();
        console.log("Retrieved total greetings count... ", count.toNumber());

        const greetingTxn = await portalContract.greeting(msg);
        console.log("Mining... ", greetingTxn.hash);

        await greetingTxn.wait();
        console.log("Mined -- ", greetingTxn.hash);

        count = await portalContract.getTotalGreetings();
        console.log("Retrieved total greetings count... ", count.toNumber());
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
    let weirdPortalContract;
    const onNewGreeting = (from, timestamp, message) => {
      console.log("newGreeting", from, timestamp, message);
      setAllGreetings((prevState) => [
        ...prevState,
        {
          address: from,
          timestamp: new Date(timestamp * 1000),
          message: message,
        },
      ]);
    };

    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      weirdPortalContract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );
      weirdPortalContract.on("newGreeting", onNewGreeting);
    }

    return () => {
      if (weirdPortalContract) {
        weirdPortalContract.off("newGreeting", onNewGreeting);
      }
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center gap-10 bg-[#DA4453] bg-gradient-to-t from-[#89216B] to-[#DA4453] text-white p-10">
      <div className="text-center max-w-6xl mx-auto">
        <h2 className="text-4xl sm:text-6xl tracking-widest font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-[#DCE35B] to-[#45B649]">
          WEIRD PORTAL
        </h2>
        <p className="text-xl sm:text-2xl font-light">
          I am Renzo, a frenchie lover! Connect your wallet and tell me
          something about your passion 💕
        </p>
        <div className="flex flex-col items-center gap-5">
          <textarea
            className="w-full sm:w-2/3 rounded-xl my-10 px-4 py-3 text-[#89216B]"
            onChange={(e) => setGreetingMessage(e.target.value)}
            value={greetingMessage}
            autoFocus
            required
            placeholder="Feel free to share something cool..."
            rows="8"
            cols="40"
          />
          {!currentAccount && (
            <button
              className="weird-button font-bold text-lg"
              onClick={connectWallet}
            >
              Connect Wallet
            </button>
          )}
          <button
            className="weird-button"
            onClick={() => greeting(greetingMessage)}
          >
            Greeting Me
          </button>
        </div>
      </div>

      <div className="flex flex-col items-center my-5 gap-2">
        <h2 className="title-2">STEPS 👣</h2>
        <p className="step">1. Connect your wallet 🦊</p>
        <p className="step">2. Write a cool message 😎</p>
        <p className="step">3. Send it! (it'll be cost some gas) ⛽</p>
        <p className="step">4. Win (50% to win 0.005 GoerliETH) 🪙</p>
        <br />
        <p className="note">
          Note 1: you must wait 5 minutes between messages (cooldown to prevent
          spammers).
        </p>
        <p className="note">
          Note 2: check all transactions{" "}
          <a
            href={`https://goerli.etherscan.io/address/${contractAddress}`}
            className="text-blue-400"
          >
            here
          </a>
          .
        </p>
      </div>
      <div
        className={`${
          allGreetings.length ? "flex" : "hidden"
        } flex-col items-center my-5`}
      >
        <h2 className="title-2">COOL MESSAGES 💯</h2>
        <div className="flex items-center justify-center gap-5 flex-wrap my-5">
          {allGreetings.map((greeting, i) => (
            <Card greeting={greeting} key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
