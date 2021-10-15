import React, { useContext, useEffect, useState } from "react";
import { getGradeLabel } from "store/actions/auctionAction";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router";
import { toastMessage } from "store/actions/appAction";
import DetailBanner from "../../components/DetailBanner";
import DetailContent from "../../components/DetailContent";
import PageContent from "../../components/PageContent";
import { ThemeContext } from "../../components/Theme";
import { ethers } from "ethers";
import { FormatPrice, SubPageLoading } from "components/Widget";
import { FormatBidPrice } from "store/actions/cellsAction";

export default function CellDetailChangeTeam(props) {
  const history = useHistory();
  const dispatch = useDispatch();
  const themeContext = useContext(ThemeContext);
  const theme = themeContext.theme;
  const { gridCellId = 0 } = useParams();
  const account = useSelector((state) => state?.app ?? {})?.account || null;
  const connector = props?.connector || null;
  const [cell, SetCell] = useState({});
  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(true);
  const pageParam = "change_team";

  const loadCellData = async () => {
    setLoading(true);
    try {
      let result = await connector.getContract("core").getCellData(gridCellId);
      let rewardsResult = await connector
        .getContract("core")
        .getClaimableGridTokens(gridCellId);
      let auctionResult = await connector
        .getContract("gridCellAuction")
        .getCurrentPrice(gridCellId)
        .then(async (result) => {
          let auctionResult = await connector
            .getContract("gridCellAuction")
            .getAuction(gridCellId);

          //auctionResult is not extensible, so we clone it,
          //then add currentPrice result before returning the combined result object
          var extendedResult = {};
          Object.assign(extendedResult, auctionResult);
          extendedResult.bidPrice = FormatBidPrice(result, extendedResult.startingPrice, extendedResult.endingPrice);
          extendedResult.currentPrice = FormatPrice(ethers.utils.formatEther(result));
          extendedResult.startedAt = extendedResult.startedAt.toNumber();
          extendedResult.duration = extendedResult.duration.toNumber();
          extendedResult.startingPrice = FormatPrice(ethers.utils.formatEther(extendedResult.startingPrice));
          extendedResult.endingPrice = FormatPrice(ethers.utils.formatEther(extendedResult.endingPrice));
          extendedResult.tokenId = extendedResult.tokenId.toNumber();

          return extendedResult;
        })
        .catch((error) => {
          //CELL is not currently on sale, ignore the error and return an empty object
          return {};
        });
      console.log("auctionResult: ", auctionResult);

      SetCell({
        coordinates: result.coordinates,
        owner: result.owner,
        team: parseInt(result.team),
        gradeId: result.grade,
        grade: getGradeLabel(result.grade),
        stake: result.stake,
        rewards: FormatPrice(ethers.utils.formatEther(rewardsResult)),
        auction: auctionResult,
      });
      if (result.owner.toLowerCase() === account) {
        setIsOwner(true);
      }
      setLoading(false);
    } catch (error) {
      //if cell doesn't exist, trigger a redirect
      if (
        typeof error.error !== "undefined" &&
        typeof error.error.message !== "undefined"
      ) {
        // toastMessage(dispatch, "Error", error.error.message);
        console.log(error.error.message);
      } else {
        // toastMessage(dispatch, "Error", error);
        console.log(error);
      }
      setLoading(false);
      history.push("/my-cells");
    }
  };
  useEffect(() => {
    if (gridCellId <= 0 || isNaN(gridCellId)) {
      toastMessage(dispatch, "Error", "There is no cell!");
      history.push("/");
    }
    loadCellData();
  }, [gridCellId, connector, account]);

  return (
    <>
      {loading ? (
        <SubPageLoading theme={theme} />
      ) : (
        <PageContent>
          <div className={theme}>
            <div className="cell-detail">
              <DetailBanner
                gridCellId={gridCellId}
                coordinate={cell?.coordinates}
                grade={Number(cell?.gradeId)}
                team={Number(cell?.team)}
                owner={cell?.owner}
                sellable={true}
                earnings={cell?.rewards}
                theme={theme}
                isOwner={isOwner}
                connector={connector}
                account={account}
                {...cell}
              />
              <DetailContent
                {...cell}
                pageParam={pageParam}
                gridCellId={gridCellId}
                isOwner={isOwner}
                theme={theme}
                team={Number(cell?.team)}
              />
            </div>
          </div>
        </PageContent>
      )}
    </>
  );
}
