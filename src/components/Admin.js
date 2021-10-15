import React, { Component } from 'react';
import { ethers } from "ethers";
import Transaction from '../utils/Transaction';

import coreContractJSON from '../artifacts/GridCore.json';
import gridCellContractJSON from '../artifacts/GridCell.json';
import gridCellAuctionContractJSON from '../artifacts/CellClockAuction.json';
import gridTokenContractJSON from '../artifacts/GridToken.json';

class Admin extends Component {
    constructor() {
        super();
        this.state = {
            core: {
                address: 0x0,
                owner: 0x0,
                finance: 0x0,
                balance: 0
            },
            gridCell: {
                address: 0x0,
                owner: 0x0
            },
            auction: {
                address: 0x0,
                owner: 0x0,
                balance: 0
            },
            gridToken: {
                address: 0x0,
                owner: 0x0
            },
        }
    }

    componentDidMount = async() => {
        if (this.props.connector == null || !this.props.connector.isConnected()) {
            this.mountTimeout = window.setTimeout(this.componentDidMount, 100);
            return;
        }

        this.account = this.props.connector.getAccount();

        //if this account doesn't have access to the admin panel, redirect to homepage
        if (
            this.account != process.env.REACT_APP_OWNER_ADDRESS.toLowerCase() && 
            this.account != process.env.REACT_APP_OPERATOR_ADDRESS.toLowerCase()
        ) {
            this.props.history.push('/');
        }

        if (typeof coreContractJSON.networks[process.env.REACT_APP_NETWORK_ID] === "undefined") {
            throw "Core contract not found on this network";
        }

        let _core = this.state.core;
        _core.address = coreContractJSON.networks[process.env.REACT_APP_NETWORK_ID].address;

        _core.owner = await this.props.connector.getContract("core").getRoleMember(ethers.utils.keccak256(ethers.utils.toUtf8Bytes("ROLE_OWNER")), 0)
        .catch((error) => {
            console.log(error);
        });

        _core.finance = await this.props.connector.getContract("core").financeAccount();

        let core_balance = await this.props.connector.getProvider().getBalance(this.state.core.address);
        _core.balance = parseFloat(ethers.utils.formatEther(core_balance)).toFixed(4);

        let _gridCell = this.state.gridCell;
        _gridCell.address = gridCellContractJSON.networks[process.env.REACT_APP_NETWORK_ID].address;

        _gridCell.owner = await this.props.connector.getContract("gridCell").getRoleMember(ethers.utils.keccak256(ethers.utils.toUtf8Bytes("ROLE_OWNER")), 0)
        .catch((error) => {
            console.log(error);
        });

        let _auction = this.state.auction;
        _auction.address = gridCellAuctionContractJSON.networks[process.env.REACT_APP_NETWORK_ID].address;
        
        _auction.owner = await this.props.connector.getSignedContract("gridCellAuction").getRoleMember(ethers.utils.keccak256(ethers.utils.toUtf8Bytes("ROLE_OWNER")), 0)
        .catch((error) => {
            console.log(error);
        });

        _auction.finance = await this.props.connector.getContract("gridCellAuction").financeAccount();

        let auction_balance = await this.props.connector.getProvider().getBalance(this.state.auction.address);
        _auction.balance = parseFloat(ethers.utils.formatEther(auction_balance)).toFixed(4);

        let _gridToken = this.state.gridToken;
        _gridToken.address = gridTokenContractJSON.networks[process.env.REACT_APP_NETWORK_ID].address;

        _gridToken.owner = await this.props.connector.getContract("gridToken").getRoleMember(ethers.utils.keccak256(ethers.utils.toUtf8Bytes("ROLE_OWNER")), 0)
        .catch((error) => {
            console.log(error);
        });

        let circulatingTokensDirect = await this.props.connector.getContract("gridToken").getCirculatingSupply()
        .catch((error) => {
            console.log(error);
        });
        console.log('Circulating supply (total):', ethers.utils.formatEther(circulatingTokensDirect), 'GRID');

        let circulatingTokens = await this.props.connector.getContract("core").getGridTokenCirculatingSupply()
        .catch((error) => {
            console.log(error);
        });
        if (circulatingTokens) {
            console.log('Circulating supply (claimed):', ethers.utils.formatEther(circulatingTokens), 'GRID');
        }

        this.setState({
            core: _core,
            gridCell: _gridCell,
            auction: _auction,
            gridToken: _gridToken
        });
    }

    componentWillUnmount = () => {
        window.clearTimeout(this.mountTimeout);
    }

    initCoreContract = () => {
        this.props.connector.getSignedContract("core").setFinanceAccount(process.env.REACT_APP_FINANCE_ADDRESS)
        .then((result) => {
            console.log('core -> setFinanceAccount()) done');
            console.log(result);
        })
        .catch((error) => {
            if (typeof error.error !== "undefined" && typeof error.error.message !== "undefined") {
                console.log(error.error.message);
            } else {
                console.log(error);
            }
        });

        this.props.connector.getSignedContract("core").grantRole(ethers.utils.keccak256(ethers.utils.toUtf8Bytes("ROLE_OPERATOR")), process.env.REACT_APP_OPERATOR_ADDRESS)
        .then((result) => {
            console.log('core -> grantRole(ROLE_OPERATOR) done');
            console.log(result);
        })
        .catch((error) => {
            if (typeof error.error !== "undefined" && typeof error.error.message !== "undefined") {
                console.log(error.error.message);
            } else {
                console.log(error);
            }
        });

        this.props.connector.getSignedContract("core").setCellContractAddress(gridCellContractJSON.networks[process.env.REACT_APP_NETWORK_ID].address)
        .then((result) => {
            console.log('core -> setCellContractAddress done');
            console.log(result);
        })
        .catch((error) => {
            if (typeof error.error !== "undefined" && typeof error.error.message !== "undefined") {
                console.log(error.error.message);
            } else {
                console.log(error);
            }
        });

        this.props.connector.getSignedContract("core").setCellClockAuctionContractAddress(gridCellAuctionContractJSON.networks[process.env.REACT_APP_NETWORK_ID].address)
        .then((result) => {
            console.log('core -> setCellClockAuctionContractAddress done');
            console.log(result);
        })
        .catch((error) => {
            if (typeof error.error !== "undefined" && typeof error.error.message !== "undefined") {
                console.log(error.error.message);
            } else {
                console.log(error);
            }
        });

        this.props.connector.getSignedContract("core").setGridTokenContractAddress(gridTokenContractJSON.networks[process.env.REACT_APP_NETWORK_ID].address)
        .then((result) => {
            console.log('core -> setGridTokenContractAddress done');
            console.log(result);
        })
        .catch((error) => {
            if (typeof error.error !== "undefined" && typeof error.error.message !== "undefined") {
                console.log(error.error.message);
            } else {
                console.log(error);
            }
        });
    }

    initGridCellContract = (setCoreOnly) => {
        this.props.connector.getSignedContract("gridCell").grantRole(ethers.utils.keccak256(ethers.utils.toUtf8Bytes("ROLE_CORE_CONTRACT")), coreContractJSON.networks[process.env.REACT_APP_NETWORK_ID].address)
        .then((result) => {
            console.log('gridCell -> grantRole(ROLE_CORE_CONTRACT) done');
            console.log(result);
        })
        .catch((error) => {
            if (typeof error.error !== "undefined" && typeof error.error.message !== "undefined") {
                console.log(error.error.message);
            } else {
                console.log(error);
            }
        });

        if (setCoreOnly) {
            return;
        }

        this.props.connector.getSignedContract("gridCell").grantRole(ethers.utils.keccak256(ethers.utils.toUtf8Bytes("ROLE_OPERATOR")), process.env.REACT_APP_OPERATOR_ADDRESS)
        .then((result) => {
            console.log('gridCell -> grantRole(ROLE_OPERATOR) done');
            console.log(result);
        })
        .catch((error) => {
            if (typeof error.error !== "undefined" && typeof error.error.message !== "undefined") {
                console.log(error.error.message);
            } else {
                console.log(error);
            }
        });

        this.props.connector.getSignedContract("gridCell").grantRole(ethers.utils.keccak256(ethers.utils.toUtf8Bytes("ROLE_STAKE_DENYLIST")), gridCellAuctionContractJSON.networks[process.env.REACT_APP_NETWORK_ID].address)
        .then((result) => {
            console.log('gridCell -> grantRole(ROLE_STAKE_DENYLIST) to gridCellAuction done');
            console.log(result);
        })
        .catch((error) => {
            if (typeof error.error !== "undefined" && typeof error.error.message !== "undefined") {
                console.log(error.error.message);
            } else {
                console.log(error);
            }
        });
    }

    initGridCellAuctionContract = (setCoreOnly) => {
        this.props.connector.getSignedContract("gridCellAuction").grantRole(ethers.utils.keccak256(ethers.utils.toUtf8Bytes("ROLE_CORE_CONTRACT")), coreContractJSON.networks[process.env.REACT_APP_NETWORK_ID].address)
        .then((result) => {
            console.log('gridCellAuction -> grantRole(ROLE_CORE_CONTRACT) done');
            console.log(result);
        })
        .catch((error) => {
            if (typeof error.error !== "undefined" && typeof error.error.message !== "undefined") {
                console.log(error.error.message);
            } else {
                console.log(error);
            }
        });

        if (setCoreOnly) {
            return;
        }

        this.props.connector.getSignedContract("gridCellAuction").grantRole(ethers.utils.keccak256(ethers.utils.toUtf8Bytes("ROLE_OPERATOR")), process.env.REACT_APP_OPERATOR_ADDRESS)
        .then((result) => {
            console.log('gridCellAuction -> grantRole(ROLE_OPERATOR) done');
            console.log(result);
        })
        .catch((error) => {
            if (typeof error.error !== "undefined" && typeof error.error.message !== "undefined") {
                console.log(error.error.message);
            } else {
                console.log(error);
            }
        });

        this.props.connector.getSignedContract("gridCellAuction").setFinanceAccount(process.env.REACT_APP_FINANCE_ADDRESS)
        .then((result) => {
            console.log('gridCellAuction -> setFinanceAccount()) done');
            console.log(result);
        })
        .catch((error) => {
            if (typeof error.error !== "undefined" && typeof error.error.message !== "undefined") {
                console.log(error.error.message);
            } else {
                console.log(error);
            }
        });
    }

    initGridTokenContract = () => {
        this.props.connector.getSignedContract("gridToken").grantRole(ethers.utils.keccak256(ethers.utils.toUtf8Bytes("ROLE_CORE_CONTRACT")), coreContractJSON.networks[process.env.REACT_APP_NETWORK_ID].address)
        .then((result) => {
            console.log('gridToken -> grantRole(ROLE_CORE_CONTRACT) done');
            console.log(result);
        })
        .catch((error) => {
            if (typeof error.error !== "undefined" && typeof error.error.message !== "undefined") {
                console.log(error.error.message);
            } else {
                console.log(error);
            }
        });
    }

    runInit = () => {
        let account = this.props.connector.getAccount();

        if (account != process.env.REACT_APP_OWNER_ADDRESS.toLowerCase()) {
            throw "Only an OWNER can call this function";
        }

        this.initGridCellContract(false);

        this.initGridCellAuctionContract(false);

        this.initGridTokenContract();

        this.initCoreContract();
    }

    runInitNewCoreContract = () => {
        let account = this.props.connector.getAccount();

        if (account != process.env.REACT_APP_OWNER_ADDRESS.toLowerCase()) {
            throw "Only an OWNER can call this function";
        }

        this.initGridCellContract(true);

        this.initGridCellAuctionContract(true);

        this.initGridTokenContract();

        this.initCoreContract();
    }

    retrieveFundsCore = () => {
        let account = this.props.connector.getAccount();

        if (account != process.env.REACT_APP_OPERATOR_ADDRESS.toLowerCase()) {
            throw "Only an OPERATOR can call this function";
        }

        this.props.connector.getSignedContract("core").retrieveFunds()
        .then((result) => {
            console.log('core -> retrieveFunds() done');
            console.log(result);
        })
        .catch((error) => {
            if (typeof error.error !== "undefined" && typeof error.error.message !== "undefined") {
                console.log(error.error.message);
            } else {
                console.log(error);
            }
        });
    }

    retrieveFundsGridCellAuction = () => {
        let account = this.props.connector.getAccount();

        if (account != process.env.REACT_APP_OPERATOR_ADDRESS.toLowerCase()) {
            throw "Only an OPERATOR can call this function";
        }

        this.props.connector.getSignedContract("gridCellAuction").retrieveFunds()
        .then((result) => {
            console.log('gridCellAuction -> retrieveFunds() done');
            console.log(result);
        })
        .catch((error) => {
            if (typeof error.error !== "undefined" && typeof error.error.message !== "undefined") {
                console.log(error.error.message);
            } else {
                console.log(error);
            }
        });
    }

    createCell = () => {
        let account = this.props.connector.getAccount();

        if (account != process.env.REACT_APP_OPERATOR_ADDRESS.toLowerCase()) {
            throw "Only an OPERATOR can call this function";
        }

        this.props.connector.getSignedContract("core").discoverCell()
        .catch((error) => {
            if (typeof error.error !== "undefined" && typeof error.error.message !== "undefined") {
                console.log(error.error.message);
            } else if (typeof error.message !== "undefined") {
                console.log(error.message);
            } else {
                console.log(error);
            }
        });

        this.props.connector.getContract("gridCell").on("Discovery", (cellId, coordinates, properties, colour, owner, event) => {
            console.log(`Latest Discovery: Cell ID ${cellId} at ${coordinates} with properties ${properties} and team ${colour} discovered by ${owner}`);
        });
    }

    mineGridTokens = () => {
        let account = this.props.connector.getAccount();

        if (account != process.env.REACT_APP_OPERATOR_ADDRESS.toLowerCase()) {
            throw "Only an OPERATOR can call this function";
        }

        let order = [4,3,2,6,0,1,5,7];
        /*let bigNumberOrder = order.map(item => {
            return (ethers.BigNumber.from(item)).toString();
        });*/
        
        let overrides = {
            gasLimit: 800000
        };

        this.props.connector.getSignedContract("core").mineGridTokens(order, overrides)
        .catch((error) => {
            if (typeof error.error !== "undefined" && typeof error.error.message !== "undefined") {
                console.log(error.error.message);
            } else if (typeof error.message !== "undefined") {
                console.log(error.message);
            } else {
                console.log(error);
            }
        });
    }

    getRevertReason = () => {
        let transactionHash = document.getElementById("revert").value;
        let transactionData = new Transaction();
        transactionData.getRevertReason(transactionHash);
    }

    render() {
        return (
            <div className="bodyContent admin" style={{padding: "80px 0 160px"}}>
                <h2>Admin Actions</h2>
                <div><button onClick={this.runInit}>Initialise</button></div>
                <div><button onClick={this.runInitNewCoreContract}>Initialise new Core contract</button></div>
                <div><button onClick={this.createCell}>Create Grid Cell</button></div>
                <div><button onClick={this.retrieveFundsCore}>Retrieve funds (core)</button></div>
                <div><button onClick={this.retrieveFundsGridCellAuction}>Retrieve funds (gridCellAuction)</button></div>
                <div><button onClick={this.mineGridTokens}>Mine GRID Tokens</button></div>
                <div><input id="revert" type="text" placeholder="Transaction Hash" /><button onClick={this.getRevertReason}>Get Revert Reason</button></div>

                <h2>Grid Contract Info</h2>
                <div>
                    <h3>GridCore</h3>
                    <div>Address: {this.state.core.address}</div>
                    <div>Owner: {this.state.core.owner}</div>
                    <div>Finance account: {this.state.core.finance}</div>
                    <div>Balance: {this.state.core.balance} BNB</div>
                </div>
                <div>
                    <h3>GridCell</h3>
                    <div>Address: {this.state.gridCell.address}</div>
                    <div>Owner: {this.state.gridCell.owner}</div>
                </div>
                <div>
                    <h3>GridCellAuction</h3>
                    <div>Address: {this.state.auction.address}</div>
                    <div>Owner: {this.state.auction.owner}</div>
                    <div>Finance account: {this.state.auction.finance}</div>
                    <div>Balance: {this.state.auction.balance} BNB</div>
                </div>
                <div>
                    <h3>GridToken</h3>
                    <div>Address: {this.state.gridToken.address}</div>
                    <div>Owner: {this.state.gridToken.owner}</div>
                </div>
            </div>
        );
    }
}

export default Admin;