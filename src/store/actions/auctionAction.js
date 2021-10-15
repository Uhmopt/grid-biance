import { getAxios } from "./appAction";
import { ethers } from "ethers";
import { FormatPrice } from "../../components/Widget"
import { FormatBidPrice } from "./cellsAction"
import Config from "utils/Config.json";

const API_URL = process.env.REACT_APP_BACKEND_URL + "/auction/";

export const getGradeLabel = (grade) => {
  grade = parseInt(grade);
  if (grade === 4) {
    return "Perfect";
  } else if (grade === 3) {
    return "Deluxe";
  } else if (grade === 2) {
    return "Premium";
  }
  return "Standard";
};

export const getAuctionList = async (
  page,
  onFinish = console.log("finish"),
  onError = console.log("error")
) => {
  try {
    let auctionData = [];
    const url = API_URL + `list/${page}`;
    const auctionList = await getAxios(url);
    (auctionList?.output?.auctions || []).forEach((item, index) => {
      var gridCellAuctionData = {
        id: item.cell_id,
        seller: item.seller,
        sellerDisplay:
          item.seller.substr(0, 4) + "..." + item.seller.substr(38, 4),
        price: FormatPrice(ethers.utils.formatEther(item.price)),
        bidPrice: FormatBidPrice(item.price, item.price_start, item.price_end),
        location: item.x + ", " + item.y,
        team: Config.team[item.team].name,
        teamId: item.team,
        colourHex: "#" + Config.team[item.team].colour,
        grade: getGradeLabel(item.grade),
        gradeId: item.grade,
      };

      auctionData.push(gridCellAuctionData);
    });
    onFinish({
      auctionData,
      numPages: auctionList.output.num_pages,
      numActiveAuctions: auctionList.output.num_active_auctions,
    });
  } catch (error) {
    console.log(error, "error");
    onError(error);
  }
};
