import React, { Component } from "react";
import { connect } from "react-redux";
import defaultAvatar from "assets/img/default-avatar.svg";
import { ClickAwayListener, Collapse } from "@material-ui/core";
import {
  setAuthentication,
  setConnectorInjection,
} from "store/actions/appAction";
import profile from "assets/img/profile.svg";
import logout from "assets/img/logout.svg";
import { ReactSVG } from "react-svg";

class Connection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      accountDisplay: null,
      correctChain: false,
      open: false,
    };
  }

  componentDidMount = () => {
    if (this.props.connector == null || !this.props.connector.isInitialised()) {
      this.mountTimeout = window.setTimeout(this.componentDidMount, 100);
      return;
    }

    if (window.ethereum) {
      this.handleChainChanged();
      window.ethereum.on("chainChanged", this.handleChainChanged);

      this.handleAccountsChanged();
      window.ethereum.on("accountsChanged", this.handleAccountsChanged);
    }
  };

  componentWillUnmount = () => {
    window.clearTimeout(this.mountTimeout);
  };

  connect = () => {
    this.props.connector.connect((connector) => {
      setConnectorInjection(this.props.dispatch, { connector: connector });
    });
  };

  handleAccountsChanged = () => {
    let account = this.props.connector.getAccount();
    setAuthentication(this.props.dispatch, { account: account });
    this.setState({
      accountDisplay:
        account !== null
          ? account.substr(0, 4) + "..." + account.substr(38, 4)
          : null,
    });
  };

  handleChainChanged = () => {
    let chain = this.props.connector.getChainId();
    this.setState({
      correctChain: chain == process.env.REACT_APP_CHAIN_ID,
    });
  };

  disconnect = async () => {
    // await this.props.connector.disconnect();
  };

  render() {
    let labelText = "";
    let labelClass = "";
    if (this.state.accountDisplay !== null) {
      labelText = "Connected Account:";
      labelClass = "label";
      if (!this.state.correctChain) {
        labelText = "Wrong Network!";
        labelClass += " error";
      }
    }

    return (
      <div>
        {this.state.accountDisplay !== null ? (
          <div
            className="drop-menu"
            onClick={() => this.setState({ open: !this.state.open })}
          >
            <div id="connection" className="login-user pointer">
              <div className="avatar">
                <img src={defaultAvatar} alt="avatar" />
              </div>
              <div className="flex flex-direction-column">
                {!this.state.correctChain && (
                  <p
                    className={labelClass}
                    style={{ margin: 0, color: "#ff9494" }}
                  >
                    {labelText}
                  </p>
                )}
                <p
                  style={{
                    margin: 0,
                    textAlign: "center",
                    color: `${
                      this.props.theme === "light" ? "#214298" : "#eee"
                    }`,
                  }}
                >
                  {this.state.accountDisplay}
                </p>
              </div>
            </div>
            {this.state.open && (
              <ClickAwayListener
                onClickAway={() => this.setState({ open: false })}
              >
                <Collapse in={this.state.open} unmountOnExit>
                  <div className="drop-body">
                    <div
                      className="drop-item"
                      // onClick={() => goLink(item.url ? item.url : "#")}
                    >
                      <ReactSVG src={profile} />
                      <p>{"Edit Profile"}</p>
                    </div>
                    <div className="drop-item" onClick={this.disconnect}>
                      <ReactSVG src={logout} />
                      <p>{"Disconnect"}</p>
                    </div>
                  </div>
                </Collapse>
              </ClickAwayListener>
            )}
          </div>
        ) : (
          <a id="connection" className="login-user" onClick={this.connect}>
            <span className="button-round">Connect</span>
          </a>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    connector: state?.app?.connector,
  };
};

export default connect(mapStateToProps)(Connection);
