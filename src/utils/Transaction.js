import { ethers } from "ethers";

class Transaction {
    constructor() {
        if (window.ethereum) {
            this.provider = new ethers.providers.Web3Provider(window.ethereum);
        } else {
            this.provider = new ethers.providers.JsonRpcProvider(process.env.REACT_APP_NETWORK_HTTP_PROVIDER);
        }
    }

    getRevertReason = async(transactionHash) => {
        try {
            console.log('Checking transaction ' + transactionHash);
            let transaction = await this.provider.getTransaction(transactionHash);
            if (!transaction) {
                console.log('Transaction ' + transactionHash + ' not found');
            } else {
                console.log('Transaction data: ', transaction);
                let revertData = await this.provider.call(transaction, transaction.blockNumber);
                console.log('Revert data: ', revertData);
                let revertReason = ethers.utils.toUtf8String('0x' + revertData.substr(138));
                console.log('Revert reason: ', revertReason);
            }
        } catch (error) {
            console.error("getRevertReason failed", error);
        }
    }
}

export default Transaction;