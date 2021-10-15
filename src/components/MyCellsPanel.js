import React from "react";
import CellRect from "./CellRect";
import InfoIcon from "@material-ui/icons/Info";
import { useHistory } from "react-router";
import Grid from "@material-ui/core/Grid";
import { Paper } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { getTeamColor } from "components/Widget";
// import { CellCoordinates, CellGrade, CellTeam } from "./Widget";
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
}));
export default function MyCellsPanel({ theme = {}, data = [] }) {
  const classes = useStyles();
  const history = useHistory();
  const handleViewCell = (cellId) => {
    history.push(`/cell/${cellId}/claim`);
  };
  return (
    <div className="cells-container">
      <div className={classes.root}>
        <Grid container spacing={3}>
          {data.map((cell, cellIndex) => {
            let { teamLabel } = getTeamColor(cell.team);
            return (
              <Grid item xs={12} sm={6} md={4} key={cellIndex}>
                <Paper>
                  <div
                    className={`cells-row pointer border-hover-${teamLabel}`}
                    style={{ borderRadius: 4 }}
                    onClick={() => handleViewCell(cell.id)}
                  >
                    <div className="cell-property">
                      <CellRect
                        team={cell?.team}
                        type={cell?.type ?? "none"}
                        title={`${cell?.coordinates[0] ?? ""}, ${
                          cell?.coordinates[1] ?? ""
                        }`}
                      />
                    </div>
                    <div className="cell-action">
                      <div className="cell-earning">
                        <h2 style={{ paddingTop: 0 }}>{`CELL #${cell.id}`}</h2>
                        {/* <span>1356 BNB</span> */}
                      </div>
                      <button
                        className="view-more"
                        onClick={() => handleViewCell(cell.id)}
                      >
                        <InfoIcon />
                        <span>View Details</span>
                      </button>
                    </div>
                  </div>
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      </div>
    </div>
  );
}
