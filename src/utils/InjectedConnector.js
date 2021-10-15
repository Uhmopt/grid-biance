import { ethers } from "ethers";

import coreContractJSON from "../artifacts/GridCore.json";
import gridCellContractJSON from "../artifacts/GridCell.json";
import gridCellAuctionContractJSON from "../artifacts/CellClockAuction.json";
import gridTokenContractJSON from "../artifacts/GridToken.json";

class InjectedConnector {
  constructor(validChainId) {
    this.initialised = false;
    this.account = null;
    this.chainId = null;
    this.validChainId = parseInt(validChainId);
    this.provider = null;
    this.signer = null;
    this.contracts = {};
    this.signedContracts = {};

    if (!window.ethereum) {
      //initialise RPC connection if no wallet connection is available
      this.getProvider();
    } else {
      this.getChainId();
      this.getAccount();

      window.ethereum.on("chainChanged", this.handleChainChanged);
      window.ethereum.on("accountsChanged", this.handleAccountsChanged);
    }
  }

  connect = (onFinish = () => {}) => {
    if (!window.ethereum) {
      console.error("No wallet connector available");
      return;
    }

    window.ethereum
      .request({
        method: "eth_requestAccounts",
      })
      .then((res) => {
        onFinish(this);
      })
      //successful request will trigger accountsChanged event
      .catch(this.handleError);
  };

  disconnect = () => {
    return this.provider.close();
  };

  isConnected = () => {
    return this.chainId === this.validChainId && this.account !== null;
  };

  isInitialised = () => {
    return this.initialised;
  };

  getAccount = () => {
    if (this.account !== null || !window.ethereum) {
      return this.account;
    }

    window.ethereum
      .request({
        method: "eth_accounts",
      })
      .then(this.handleAccountsChanged)
      .catch(this.handleError);

    return null;
  };

  getChainId = () => {
    if (this.chainId !== null) {
      return this.chainId;
    }

    window.ethereum
      .request({
        method: "eth_chainId",
      })
      .then(this.handleChainChanged)
      .catch(this.handleError);

    return null;
  };

  handleAccountsChanged = (accounts) => {
    if (accounts.length === 0) {
      // Wallet is locked or the user has not connected any accounts
      this.account = null;
      console.log("Please connect your wallet (Metamask, TrustWallet, etc).");
    } else if (accounts[0] !== this.account) {
      this.account = accounts[0].toLowerCase();
    }

    this.initialised = true;
  };

  handleChainChanged = (chainId) => {
    chainId = parseInt(chainId);
    if (this.chainId !== chainId) {
      this.chainId = chainId;
    }

    if (this.chainId !== this.validChainId) {
      console.error(
        `Please connect your wallet (${this.chainId}) to the correct chain (${this.validChainId}).`
      );
    }
  };

  handleError = (error) => {
    // EIP 1193 userRejectedRequest error
    if (error.code === 4001) {
      console.log("Please connect your wallet (Metamask, TrustWallet, etc).");
      //other errors
    } else {
      console.log(error);
    }
  };

  getProvider = () => {
    try {
      if (this.provider === null) {
        if (window.ethereum) {
          this.provider = new ethers.providers.Web3Provider(window.ethereum);
        } else {
          this.provider = new ethers.providers.JsonRpcProvider(
            process.env.REACT_APP_NETWORK_HTTP_PROVIDER
          );
          this.initialised = true;
        }
      }

      return this.provider;
    } catch (error) {
      console.error(error);
    }
  };

  getSigner = () => {
    try {
      if (this.signer === null) {
        if (!window.ethereum) {
          throw "No wallet connector available";
        }

        this.signer = this.getProvider().getSigner();
      }

      return this.signer;
    } catch (error) {
      console.error(error);
    }
  };

  getContract = (name) => {
    try {
      if (typeof this.contracts[name] !== "undefined") {
        return this.contracts[name];
      }

      let provider = this.getProvider();
      if (!provider) {
        console.error("Provider not ready");
        return false;
      }

      let contractJSON = null;

      switch (name) {
        case "core":
          contractJSON = coreContractJSON;
          break;
        case "gridCell":
          contractJSON = gridCellContractJSON;
          break;
        case "gridCellAuction":
          contractJSON = gridCellAuctionContractJSON;
          break;
        case "gridToken":
          contractJSON = gridTokenContractJSON;
          break;
        default:
          //add error handling
          console.log("Invalid contract type");
          return false;
      }

      if (
        typeof contractJSON.networks[process.env.REACT_APP_NETWORK_ID] ===
        "undefined"
      ) {
        throw (
          "Contract (" +
          name +
          ") address not found on network (" +
          process.env.REACT_APP_NETWORK_ID +
          ")"
        );
      }

      this.contracts[name] = new ethers.Contract(
        contractJSON.networks[process.env.REACT_APP_NETWORK_ID].address,
        contractJSON.abi,
        provider
      );

      return this.contracts[name];
    } catch (error) {
      console.error(error);
    }
  };

  getSignedContract = (name) => {
    if (typeof this.signedContracts[name] !== "undefined") {
      return this.signedContracts[name];
    }

    this.signedContracts[name] = this.getContract(name).connect(
      this.getSigner()
    );

    return this.signedContracts[name];
  };
}

export default InjectedConnector;
