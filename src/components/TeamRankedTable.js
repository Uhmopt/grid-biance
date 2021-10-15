import Skeleton from "@material-ui/lab/Skeleton";
import React from "react";
import { useHistory } from "react-router";
import { ReactSVG } from "react-svg";
import bitcoinIcon from "../assets/img/binance-icon.svg";
import { CellTeam } from "./Widget";

export default function TeamRankedTable({
  teamsOrder,
  loading,
  type,
}) {
  // console.log(type, "type")
  const history = useHistory()
  return (
    <div className="player-ranker-table">
      <div className="player-ranker-table-top">
        <div className="table-splite-buttons">
          <button
            className={`${type === "all" ? "current" : ""}`}
            onClick={() => history.push("/leaderboard/team-rankings")}
          >
            All Time
          </button>
          <button
            className={`${type === "month" ? "current" : ""}`}
            onClick={() => history.push("/leaderboard/team-rankings/monthly")}
          >
            Monthly
          </button>
          <button
            className={`${type === "week" ? "current" : ""}`}
            onClick={() => history.push("/leaderboard/team-rankings/weekly")}
          >
            Weekly
          </button>
        </div>
      </div>
      <div className="ranker-table position-relative">
        <table>
          <thead>
            <tr>
              <th>Ranked</th>
              <th>Team</th>
              <th>GRID Claimed</th>
              <th>Average GRID Claimed</th>
              <th>CELLs</th>
              <th>Total Staked</th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? Array.from(Array(8).keys()).map((i) => (
                <tr key={i}>
                  {Array.from(Array(5).keys()).map((j) => (
                    <td align="center" key={j} style={{ padding: "5px" }}>
                      <Skeleton animation="wave" variant="rect" height={30} />
                    </td>
                  ))}
                </tr>
              ))
              : Boolean(teamsOrder.length > 0) ? (

                teamsOrder?.map((item, key) => (
                  <tr className="table-row" key={key}>
                    <td className="table-cell-ranked" align="center">
                      {/* <CellTeam team={item?.rank} width={100} align="left" /> */}
                      <span>{item?.rank}</span>
                    </td>
                    <td>
                      <CellTeam teamId={item?.teamId} />
                    </td>
                    <td className="table-earning" align="center">
                      {Number(item.miningTotal).toFixed(0)}
                    </td>
                    <td className="table-owners" align="center">
                      {(
                        Number(item?.miningTotal) / Number(item?.cellCount)
                      ).toFixed(2)}
                    </td>
                    <td className="table-cells" align="center">
                      {item?.cellCount}
                    </td>
                    <td className="table-stake" align="center">
                      {item?.gridShare}
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="table-row">
                  <td>No data</td>
                </tr>
              )}
          </tbody>
        </table>
        <ReactSVG src={bitcoinIcon} className="ranker-table-back" />
      </div>
    </div >
  );
}
