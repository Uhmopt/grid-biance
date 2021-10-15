import { ethers } from "ethers";
import { getAxios, toastMessage } from "./appAction";
import { FormatPrice } from "../../components/Widget"
const API_URL = process.env.REACT_APP_BACKEND_URL;

export const getCellAuctionHitory = async (
  gridCellId = "",
  onFinish,
  onError
) => {
  try {
    const url = API_URL + `/cell/history/${gridCellId}`;
    const cellHistoryRes = await getAxios(url);
    if (cellHistoryRes.status === "OK") {
      onFinish(cellHistoryRes.output);
    }
  } catch (error) {
    console.log(error, "getCellAuctionHistory");
  }
};

export const getAuctionCells = async (account = "") => {
  try {
    if (account !== "") {
      const url = API_URL + `/auction/player/${account}`;
      const auctionCellRes = await getAxios(url);
      if (auctionCellRes.status == "OK") {
        const auctionCells = auctionCellRes.output;
        return auctionCells;
      }
    }
  } catch (errpr) {
    return {};
  }
};

export function FormatBidPrice(bidPrice, startPrice, endPrice) {
  if (bidPrice != startPrice && bidPrice != endPrice) {
    //add a small amount of dust to ensure rounded bid price wont be below the minimum and cause a revert
    bidPrice = parseFloat(ethers.utils.formatEther(bidPrice) + 0.000005).toFixed(6);
  } else {
    bidPrice = ethers.utils.formatEther(bidPrice);
  }

  return bidPrice;
}

export const BuyCell = async (
  gridCellId = null,
  price = null,
  account = null,
  connector = {},
  onFinish
) => {
  if (!connector?.isConnected()) {
    onFinish({
      msg: "You must connect your wallet to perform this action",
      status: false,
    });
    console.error("You must connect your wallet to perform this action");
    return;
  }
  if (!gridCellId || !price || !account) {
    onFinish({
      status: false,
      msg: "Please check gridCellId, account and price",
    });
    return;
  }
  let overrides = {
    value: ethers.utils.parseEther(price),
  };
  console.log(overrides, "override----------", ethers.utils.parseEther(price));
  console.log(account + " BIDS " + price + " BNB on Grid Cell #" + gridCellId);
  await connector
    ?.getSignedContract("gridCellAuction")
    ?.bid(gridCellId, overrides)
    .then((result) => {
      console.log("BID RESULT", result);
    })
    .catch((error) => {
      //ADD ERROR HANDLING
      if (
        typeof error.error !== "undefined" &&
        typeof error.error.message !== "undefined"
      ) {
        onFinish({ msg: error.error.message, status: false });
        console.log(error.error.message);
      } else {
        onFinish({ msg: error.message, status: false });
        console.log(error);
      }
    });
  //event AuctionSuccessful(uint256 indexed tokenId, uint256 salePrice, address indexed winner, uint64 timestamp)
  let filter = connector
    .getContract("gridCellAuction")
    .filters.AuctionSuccessful(
      parseInt(gridCellId), //tokenId
      null, //salePrice (not indexed)
      account, //winner
      null //timestamp (not indexed)
    );
  connector
    ?.getContract("gridCellAuction")
    .on(filter, (tokenId, salePrice, winner, timestamp, event) => {
      console.log("buycell info - >", tokenId, salePrice, winner, timestamp);
      onFinish({
        msg: `Cell ID ${tokenId} bought for ${FormatPrice(
          ethers.utils.formatEther(salePrice), true
        )}`,
        status: true,
      });

      console.log(
        `Cell ID ${tokenId} bought by ${winner} for ${parseFloat(
          ethers.utils.formatEther(salePrice)
        )} BNB at ${timestamp}`
      );
    });
};

export const CancelCell = async (
  gridCellId = null,
  connector = {},
  account = "",
  onFinish
) => {
  if (!gridCellId || !connector?.isConnected || account === "") {
    return;
  }
  console.log(
    account + " ATTEMPTS TO CANCEL AUCTION FOR Grid Cell #" + gridCellId
  );
  console.log(typeof gridCellId, connector, "hello");
  await connector
    ?.getSignedContract("gridCellAuction")
    ?.cancelAuction(gridCellId)
    .then((result) => {
      console.log("CANCEL AUCTION RESULT", result);
    })
    .catch((error) => {
      //ADD ERROR HANDLING
      if (
        typeof error.error !== "undefined" &&
        typeof error.error.message !== "undefined"
      ) {
        onFinish({ msg: error.error.message, status: false });
        console.log(error.error.message);
      } else {
        onFinish({ msg: error.message, status: false });
        console.log(error);
      }
    });
  //event AuctionCancelled(uint256 indexed tokenId, uint64 timestamp)
  var filter = connector
    ?.getContract("gridCellAuction")
    ?.filters.AuctionCancelled(
      parseInt(gridCellId), //tokenId
      null //timestamp
    );
  connector?.getContract("gridCellAuction").on(filter, (tokenId, event) => {
    console.log(`Cell ID ${tokenId} auction successfully cancelled`);
    //ADD ERROR HANDLING
    onFinish({
      msg: `Cell ID ${tokenId} auction successfully cancelled`,
      status: true,
    });
  });
};
