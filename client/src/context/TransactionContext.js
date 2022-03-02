import React, { useEffect, useState } from "react";
import { ethers } from "ethers";

import { contractABI, contractAddress } from "../utils/constants";

export const TransactionContext = React.createContext();

const { ethereum } = window;

const createEthereumContract = () => {
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  const transactionContract = new ethers.Contract(
    contractAddress,
    contractABI,
    signer
  );
  return transactionContract;
};

export const TransactionProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState("");
  const [formData, setFormData] = useState({
    addressTo: "",
    amount: "",
    keyword: "",
    message: "",
  });
  const [transactionCount, setTransactionCount] = useState(
    localStorage.getItem("transactionCount")
  );
  const [isLoading, setIsLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);

  const handleChange = (e, name) => {
    setFormData((prevState) => ({ ...prevState, [name]: e.target.value }));
  };
  const getAllTransactions = async () => {
    try {
      if (ethereum) {
        const transactionsContract = createEthereumContract();

        const availableTransactions =
          await transactionsContract.getAllTransactions();

        const structuredTransactions = availableTransactions.map(
          (transaction) => ({
            addressTo: transaction.receiver,
            addressFrom: transaction.sender,
            timestamp: new Date(
              transaction.timestamp.toNumber() * 1000
            ).toLocaleString(),
            message: transaction.message,
            keyword: transaction.keyword,
            amount: parseInt(transaction.amount._hex) / 10 ** 18,
          })
        );

        console.log(structuredTransactions);

        setTransactions(structuredTransactions);
      } else {
        console.log("Ethereum is not present");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const checkWalletIsConnected = async () => {
    try {
      if (!ethereum) return alert("Connect MetaMask Wallet");
      const accounts = await ethereum.request({ method: "eth_accounts" });
      if (accounts.length) {
        setCurrentAccount(accounts[0]);

        getAllTransactions();
      } else {
        console.log("No account found");
      }
    } catch (error) {
      console.log(error);
      throw new Error("No Ethereum object");
    }
  };

  const connectWallet = async () => {
    try {
      if (!ethereum) return alert("Connect MetaMask Wallet");
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
      throw new Error("No Ethereum object");
    }
  };

  const checkIfTransactionExist = async () => {
    try {
      if (ethereum) {
        const transactionContract = createEthereumContract();
        const currentTransactionCount =
          transactionContract.getTransactioncount();

        window.localStorage.setItem(
          "transactionCount",
          currentTransactionCount
        );
      }
    } catch (error) {
      console.log(error);

      throw new Error("No Ethereum object");
    }
  };

  const sendTransaction = async () => {
    try {
      if (ethereum) {
        const transactionContract = createEthereumContract();
        const { addressTo, amount, message, keyword } = formData;
        const parsedAmount = ethers.utils.parseEther(amount);
        // Send Transaction Through MetaMask
        await ethereum.request({
          method: "eth_sendTransaction",
          params: [
            {
              to: addressTo,
              gas: "0x5208",
              from: currentAccount,
              value: parsedAmount._hex,
            },
          ],
        });
        // Send Transaction To Blockchain
        const transactionHash = await transactionContract.addToBlockchain(
          addressTo,
          parsedAmount,
          message,
          keyword
        );
        setIsLoading(true);
        console.log(`Loading... ${transactionHash.hash}`);
        await transactionHash.wait();
        console.log(`Success... ${transactionHash.hash}`);
        setIsLoading(false);

        const transactionsCount = transactionContract.getTransactioncount();
        setTransactionCount(transactionsCount.toNumber());
        window.location.reload();
      } else {
        alert("No Ethereum object");
      }
    } catch (error) {
      console.log(error);
      throw new Error("No Ethereum object");
    }
  };

  useEffect(() => {
    checkWalletIsConnected();
    checkIfTransactionExist();
  }, [transactionCount]);

  return (
    <TransactionContext.Provider
      value={{
        connectWallet,
        currentAccount,
        formData,
        handleChange,
        sendTransaction,
        isLoading,
        transactions,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};
