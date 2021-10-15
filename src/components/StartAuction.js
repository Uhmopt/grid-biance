import { ethers } from "ethers";
import React, { useContext, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import Select from "react-select-me";
import { ReactSVG } from "react-svg";
import { toastMessage } from "store/actions/appAction";
import startIcon from "../assets/img/start-auction.svg";
import { ThemeContext } from "./Theme";
import { FormatPrice, SubPageLoading } from "./Widget";
import gridCellAuctionContractJSON from "artifacts/CellClockAuction.json";

export default function StartAuction({ account, gridCellId }) {
  // set setting values
  const themeContext = useContext(ThemeContext);
  const theme = themeContext.theme;
  const dispatch = useDispatch();
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [startPrice, setStartPrice] = useState("");
  const [endPrice, setEndPrice] = useState("");
  const [days, setDays] = useState("172800");
  const connector = useSelector((state) => state?.app)?.connector ?? null;

  const handleStartPrice = (value) => {
    setStartPrice(value);
  };
  const handleEndPrice = (value) => {
    setEndPrice(value);
  };

  const handleDurations = (value) => {
    setDays(value.value);
  };

  const handleAuction = () => {
    if (startPrice === "" || endPrice === "") {
      toastMessage(dispatch, "Warning", "Error: Auction prices not set");
      return;
    }
    setLoading(true);
    let startingPrice = ethers.utils.parseEther(startPrice),
      endingPrice = ethers.utils.parseEther(endPrice);
    let duration = Number(days);

    console.log(gridCellId, startingPrice, endingPrice, duration, account);

    connector
      .getSignedContract("gridCell")
      .approve(
        gridCellAuctionContractJSON.networks[process.env.REACT_APP_NETWORK_ID]
          .address,
        gridCellId
      )
      .then((result) => {
        console.log("AUCTION APPROVAL RESULT");
        console.log(result);
      })
      .catch((error) => {
        if (
          typeof error.error !== "undefined" &&
          typeof error.error.message !== "undefined"
        ) {
          toastMessage(dispatch, "Error", error.error.message);
          console.log(error.error.message);
        } else {
          toastMessage(dispatch, "Error", error);
          console.log(error.message);
        }
        setLoading(false);
      });

    // //event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId)
    var filter = connector.getContract("gridCell").filters.Approval(
      null, //owner address
      gridCellAuctionContractJSON.networks[process.env.REACT_APP_NETWORK_ID]
        .address, //approved address
      gridCellId //tokenId
    );

    connector
      .getContract("gridCell")
      .on(filter, (owner, approved, tokenId, event) => {
        console.log(
          `Cell ID ${tokenId} owned by ${owner} approved for transfer by ${approved}`
        );
        //ADD ERROR HANDLING? CHANGE TO APPROVE BUTTON AND CREATE AUCTION BUTTON
        connector
          .getSignedContract("gridCellAuction")
          .createAuction(
            gridCellId,
            startingPrice,
            endingPrice,
            duration,
            account
          )
          .catch((error) => {
            if (
              typeof error.error !== "undefined" &&
              typeof error.error.message !== "undefined"
            ) {
              toastMessage(dispatch, "Error", error.error.message);
              console.log(error.error.message);
            } else {
              toastMessage(dispatch, "Error", error.message);
              console.log(error);
            }
            setLoading(false);
          });

        //event AuctionCreated(uint256 indexed tokenId, uint256 startingPrice, uint256 endingPrice, uint256 duration, uint64 timestamp)
        var filter = connector
          .getContract("gridCellAuction")
          .filters.AuctionCreated(
            gridCellId, //tokenId
            null, //startingPrice (not indexed)
            null, //endingPrice (not indexed)
            null, //duration (not indexed)
            null //timestamp (not indexed)
          );
        connector
          .getSignedContract("gridCellAuction")
          .on(
            filter,
            (tokenId, startingPrice, endingPrice, duration, event) => {
              toastMessage(
                dispatch,
                "Success",
                `Cell ID ${tokenId} auction created for ${FormatPrice(ethers.utils.formatEther(
                  startingPrice
                ))} BNB down to ${FormatPrice(ethers.utils.formatEther(
                  endingPrice
                ))} BNB over ${ Number(duration) / 86400 } days`
              );
              console.log(
                `Cell ID ${tokenId} auction created for ${ethers.utils.formatEther(
                  startingPrice
                )} BNB down to ${ethers.utils.formatEther(
                  endingPrice
                )} BNB over ${duration} seconds`
              );
              history.push("/market/1");
              setLoading(false);
              return;
            }
          );
      });
  };
  return (
    <>
      {loading ? (
        <SubPageLoading theme={theme} />
      ) : (
        <div className="start-auction-section">
          <div className="auction-setting-item">
            <label>starting price:</label>
            <div className="auction-setting-form">
              <input
                value={startPrice}
                type="number"
                onChange={(e) => handleStartPrice(e.target.value)}
                className="aution-setting-input"
              />
              <span>BNB</span>
            </div>
          </div>
          <div className="auction-setting-item">
            <label>end price:</label>
            <div className="auction-setting-form">
              <input
                value={endPrice}
                type="number"
                onChange={(e) => handleEndPrice(e.target.value)}
                className="aution-setting-input"
              />
              <span>BNB</span>
            </div>
          </div>
          <div className="auction-setting-item">
            <label>duration:</label>
            <div className="auction-setting-form">
              <Select
                options={durations}
                value={days}
                onChange={handleDurations}
              />
            </div>
          </div>
          <div className="display-center">
            <button
              className="button-auction start-auction mt-40 button-cta"
              onClick={handleAuction}
            >
              <ReactSVG src={startIcon} />
              <span>Start Auction</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
}

const durations = [
  { value: "43200", label: "0.5 days" },
  { value: "86400", label: "1 day" },
  { value: "172800", label: "2 days" },
  { value: "432000", label: "5 days" },
  { value: "604800", label: "7 days" },
  { value: "2592000", label: "30 days" },
];
