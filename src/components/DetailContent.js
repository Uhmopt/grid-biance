import moment from "moment";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import CellClaim from "./CellClaim";
import ChangeTeam from "./ChangeTeam";
import Container from "./Container";
import DateValueChart from "./DateValueChart";
import DetailHistory from "./DetailHistory";
import StartAuction from "./StartAuction";
import { SubPageLoading, TopTabButton } from "./Widget";

export default function DetailContent({
  gridCellId,
  isOwner,
  team,
  pageParam,
  theme,
  connector,
  ...cellInfo
}) {
  const account = useSelector((state) => state.app)?.account || null;
  const [loading, setLoading] = useState(false);
  const [chartData, setChartData] = useState([]);
  const tokenId = cellInfo?.auction?.tokenId ?? null;
  const history = useHistory();

  const getTokenByClaim = async () => {
    const claimResult = await connector
      .getSignedContract("core")
      .claimGridTokens(gridCellId);
    console.log(claimResult, "claimResult");
  };

  useEffect(() => {
    if (tokenId) {
      const startingData = {
        date: cellInfo?.auction?.startedAt,
        value: Number(cellInfo?.auction?.startingPrice),
      };
      const endingData = {
        date: cellInfo?.auction?.startedAt + cellInfo?.auction?.duration,
        value: Number(cellInfo?.auction?.endingPrice),
      };
      const currentData = {
        date: moment().unix(),
        value: Number(cellInfo?.auction?.currentPrice),
      };
      let chartData = [startingData, currentData, endingData];
      chartData = chartData.sort((a, b) => a.date - b.date);
      setChartData(chartData);
    }
  }, [tokenId]);

  useEffect(() => {
    if (!isOwner) {
      history.push("history");
    }
  }, []);

  return (
    <>
      {loading ? (
        <SubPageLoading theme={theme} />
      ) : (
        <Container>
          <div className="detail-tab">
            {Boolean(isOwner) && (
              <>
                <div className={pageParam === "claim" ? "active" : ""}>
                  <TopTabButton onClick={() => history.push(`claim`)}>
                    Claim Earnings
                  </TopTabButton>
                </div>
                <div className={pageParam === "auction" ? "active" : ""}>
                  <TopTabButton onClick={() => history.push(`auction`)}>
                    Auction
                  </TopTabButton>
                </div>
                <div className={pageParam === "team" ? "active" : ""}>
                  <TopTabButton onClick={() => history.push(`team`)}>
                    Change Team
                  </TopTabButton>
                </div>
              </>
            )}
            <div className={pageParam === "history" ? "active" : ""}>
              <TopTabButton onClick={() => history.push(`history`)}>
                History
              </TopTabButton>
            </div>
          </div>
          {pageParam === "claim" && isOwner && (
            <CellClaim
              handleClaim={getTokenByClaim}
              {...cellInfo}
              team={team}
            />
          )}

          {!Boolean(cellInfo?.auction?.seller) &&
            Boolean(account === cellInfo.owner.toLowerCase()) &&
            pageParam === "auction" && (
              <StartAuction account={account} gridCellId={Number(gridCellId)} />
            )}
          {pageParam === "history" && (
            <>
              {Boolean(
                cellInfo?.auction?.seller &&
                  Number(cellInfo?.auction?.startingPrice) !==
                    Number(cellInfo?.auction?.endingPrice)
              ) && <DateValueChart data={chartData} theme={theme} />}
              <DetailHistory gridCellId={gridCellId} />
            </>
          )}
          {isOwner && pageParam === "team" && (
            <ChangeTeam
              team={team}
              gridCellId={gridCellId}
              stake={cellInfo?.stake}
            />
          )}
        </Container>
      )}
    </>
  );
}
