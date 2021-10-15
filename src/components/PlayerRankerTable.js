import { makeStyles } from "@material-ui/core";
import Pagination from "@material-ui/lab/Pagination";
import React from "react";
import { useHistory } from "react-router";
import { CellOwner, CellTeam } from "./Widget";

const useStyles = makeStyles({
  table: {
    minWidth: 700,
  },
  paginationBar: {
    display: "flex",
    justifyContent: "flex-end",
    marginTop: 20,
    marginBottom: 20,
    fontFamily: "Kanit",
  },
  pagiItem: {
    color: "#fff",
  },
});

export default function PlayerRankerTable({
  type,
  numPages,
  page,
  players = [],
  accountRank = {},
}) {
  const classes = useStyles();
  const history = useHistory();
  return (
    <div className="player-ranker-table">
      <div className="player-ranker-table-top">
        <div className="table-splite-buttons">
          <button
            className={`${type === "all" ? "current" : ""}`}
            onClick={() => history.push("/leaderboard/top-players/1")}
          >
            All Time
          </button>
          <button
            className={`${type === "month" ? "current" : ""}`}
            onClick={() => history.push("/leaderboard/top-players/monthly/1")}
          >
            Monthly
          </button>
          <button
            className={`${type === "week" ? "current" : ""}`}
            onClick={() => history.push("/leaderboard/top-players/weekly/1")}
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
              <th>Owner</th>
              <th>GRID Earned</th>
              <th>CELLs</th>
              <th>Team</th>
            </tr>
          </thead>
          <tbody>
            {Number(players?.length) > 0 &&
              players.map((item, key) => (
                <tr
                  className={`table-row ${
                    item?.address === accountRank?.address &&
                    Number(accountRank?.rank) < 10
                      ? "current-player-ranking"
                      : ""
                  }`}
                  key={key}
                >
                  <td className="table-cell-ranked" align="center">
                    {item?.rank}
                  </td>
                  <td className="table-owners" align="center">
                    <CellOwner name={item?.address} />
                  </td>
                  <td className="table-earning" align="center">
                    {Number(item?.total_earnings).toFixed(2)}
                    <span></span>
                  </td>
                  <td className="table-cells" align="center">
                    {item?.cell_count}
                  </td>
                  <td className="table-cells" align="center">
                    <CellTeam teamId={item?.team} />
                  </td>
                </tr>
              ))}
            {Number(accountRank?.rank) > 10 && (
              <>
                <tr className="table-row">
                  <td className="table-cell-ranked" align="center">
                    ...
                  </td>
                  <td className="table-owners" align="center">
                    ...
                  </td>
                  <td className="table-earning" align="center">
                    ...
                  </td>
                  <td className="table-cells" align="center">
                    ...
                  </td>
                  <td className="table-cells" align="center">
                    ...
                  </td>
                </tr>
                <tr className="table-row current-player-ranking">
                  <td className="table-cell-ranked" align="center">
                    {accountRank?.rank}
                  </td>
                  <td className="table-owners" align="center">
                    <CellOwner name={accountRank?.address ?? ""} />
                  </td>
                  <td className="table-earning" align="center">
                    {accountRank?.total_earnings}
                    <span></span>
                  </td>
                  <td className="table-cells" align="center">
                    {accountRank?.cell_count}
                  </td>
                  <td className="table-cells" align="center">
                    <CellTeam teamId={accountRank?.team} />
                  </td>
                </tr>
              </>
            )}
          </tbody>
        </table>
        {/* <ReactSVG src={bitcoinIcon} className="ranker-table-back" /> */}
        <div className={classes.paginationBar}>
          <Pagination
            count={numPages}
            variant="outlined"
            shape="rounded"
            color="primary"
            page={Number(page)}
            onChange={(e, num) =>
              history.push(`/leaderboard/top-players/${num}`)
            }
          />
        </div>
      </div>
    </div>
  );
}

const rankers = [
  { ranked: 1, owner: "username", earning: 4521.232, cells: 12 },
  { ranked: 2, owner: "username", earning: 2422.21, cells: 5 },
  { ranked: 3, owner: "username", earning: 1451.21, cells: 2 },
  { ranked: 4, owner: "username", earning: 755.21, cells: 1 },
  { ranked: 5, owner: "username", earning: 456.67, cells: 1 },
  { ranked: 6, owner: "username", earning: 282.33, cells: 1 },
  { ranked: 7, owner: "username", earning: 225.89, cells: 1 },
  { ranked: 8, owner: "username", earning: 200.89, cells: 1 },
  { ranked: 9, owner: "username", earning: 195.12, cells: 1 },
  { ranked: 10, owner: "username", earning: 80.22, cells: 1 },
];
