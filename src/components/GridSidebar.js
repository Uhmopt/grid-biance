import { Collapse, Grid, makeStyles, Paper } from "@material-ui/core";
import Pagination from "@material-ui/lab/Pagination";
import premiumIcon from "assets/img/premium-icon.svg";
import unlockIcon from "assets/img/sale.svg";
import React, { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ReactSVG } from "react-svg";
import binanceIcon from "../assets/img/binance-icon.svg";
import collectIcon from "../assets/img/collect-icon.svg";
import mapBack from "../assets/img/map-grid-back.svg";
import stopWatchIcon from "../assets/img/stop-watch.svg";
import { ThemeContext } from "./Theme";
import { getTeamColor, GridMapSideAbilities, SubPageLoading } from "./Widget";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    marginTop: 15,
    marginBottom: 15,
  },
  paper: {
    cursor: "pointer",
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
  paginationBar: {
    display: "flex",
    justifyContent: "flex-end",
    marginTop: 20,
    marginBottom: 20,
    fontFamily: "Kanit",
    "& .MuiPaginationItem-root": {
      height: "21px",
      margin: "0px 1px",
      padding: "0px 2px",
      minWidth: "20px",
    },
  },
}));

export const CellCollectToken = ({ data = {}, index = 0 }) => {
  return (
    <div className="collect-token">
      {Boolean(index % 2) ? (
        <div className="triangle-right"></div>
      ) : (
        <div className="triangle-left"></div>
      )}
      <p className="cell-id">CELL #{data?.id}</p>
      <div className="next-timer display-center">
        <ReactSVG src={stopWatchIcon} />
        <h5>Next token distribution time</h5>
        <h4>07:54</h4>
      </div>
      <div className="pending-token">
        <p>
          Unclaimed Tokens: <span>124.445</span>
        </p>
      </div>
      <div className="collect-button">
        <button
          className="display-center position-relative"
          onClick={() => console.log("heloo")}
        >
          <ReactSVG src={collectIcon} />
          <span>Collect</span>
          <ReactSVG src={binanceIcon} />
        </button>
      </div>
    </div>
  );
};

export const MyCell = ({ ...props }) => {
  const { teamLabel } = getTeamColor(props?.team);
  const classes = useStyles();
  return (
    <div>
      <Paper className={classes.paper}>
        <div className="cell-info">
          <div className={`back-color-${teamLabel} cell-item`}>
            <div className="cell-icon">
              <ReactSVG className="premium" src={premiumIcon} />
              <ReactSVG className="sale" src={unlockIcon} />
            </div>
            <div className="cell-rect-title">
              <span>{`${props?.coordinates[0]}, ${props?.coordinates[1]}`}</span>
            </div>
          </div>
          <span style={{ color: "#333" }}>CELL #{props?.id}</span>
        </div>
      </Paper>
    </div>
  );
};

export function Sidebar({ ...props }) {
  const classes = useStyles();
  const themeContext = useContext(ThemeContext);
  const theme = themeContext.theme;
  const connector = props?.connector || null;
  const account = useSelector((state) => state?.app)?.account ?? null;
  const [myCells, setMyCells] = useState([]);
  const [myCellsSlice, setMyCellsSlice] = useState([]);
  const [selectedMyCell, setSelctedMyCell] = useState({});
  const [numPages, setNumPages] = useState(null);
  const [page, setPage] = useState(1);
  const [startNum, setStartNum] = useState(1);
  const [pageLoading, setPageLoading] = useState(false);

  const getMycells = async () => {
    let cellData = [];
    let gridCellContract = connector.getContract("gridCell");
    if (typeof gridCellContract === "undefined") {
      toastMessage(dispatch, "Could not connect to GridCell contract");
      setPageLoading(false);
      return;
    }

    let result = await gridCellContract.balanceOf(account);
    if (!result) {
      setPageLoading(false);
    } else if (result.toNumber() <= 0) {
      setPageLoading(false);
    } else {
      await Promise.all(
        Array.from(Array(result.toNumber()).keys()).map(async (i) => {
          let gridCellId = await gridCellContract.tokenOfOwnerByIndex(
            account,
            i
          );
          let cellResult = await gridCellContract.getCell(gridCellId);
          cellData.push({
            id: cellResult.cellId.toNumber(),
            coordinates: cellResult.coordinates,
            properties: cellResult.properties.toString(),
            team: cellResult.team,
            owner: cellResult.owner,
            type: "none",
          });
        })
      );
      const newArrayCellData = cellData.reduce((ret, cur, index) => {
        const i = parseInt(index / 2);
        if (!Boolean(index % 2)) {
          ret[i] = [cur];
        } else {
          ret[i] = [...(ret?.[i] ?? []), cur];
        }
        return ret;
      }, []);
      setMyCells(newArrayCellData);
      setMyCellsSlice(newArrayCellData);
      setPageLoading(false);
    }
  };

  const handleChangePage = (e, num) => {
    setPage(num);
    setStartNum((num - 1) * 3 + 1);
    setMyCells(myCellsSlice);
  };

  useEffect(() => {
    setPageLoading(true);
    getMycells();
    return () => {
      getMycells();
    };
  }, []);

  useEffect(() => {
    if (myCells?.length > 0) {
      const numpage = Boolean(myCells?.length % 3)
        ? parseInt(myCells?.length / 3) + 1
        : parseInt(myCells?.length / 3);
      setNumPages(numpage);
    }
  }, [myCells.length]);

  return (
    <>
      {pageLoading ? (
        <SubPageLoading theme={theme} />
      ) : (
        <div
          id="grid-page-sidebar"
          className="grid-page-sidebar"
          style={{ backgroundImage: `url(${mapBack})` }}
        >
          <div className="grid-page-sidebar-content">
            <div className={`${classes.root} sidebarm-ycells`}>
              <Grid container spacing={1}>
                {Boolean(myCells.length) > 0 &&
                  myCells
                    .slice(startNum - 1, startNum + 2)
                    .map((dir, dirIndex) => (
                      <React.Fragment key={dirIndex}>
                        {dir.map((item, key) => (
                          <Grid
                            item
                            sm={6}
                            key={key}
                            onClick={() => {
                              setSelctedMyCell((s) =>
                                s?.id == item?.id ? {} : item
                              );
                            }}
                          >
                            <MyCell {...item} />
                          </Grid>
                        ))}
                        {dir.map((item, key) => (
                          <Collapse
                            in={Boolean(selectedMyCell?.id === item?.id)}
                            key={key}
                          >
                            <CellCollectToken data={item} index={key} />
                          </Collapse>
                        ))}
                      </React.Fragment>
                    ))}
              </Grid>
              {numPages > 1 && (
                <div className={classes.paginationBar}>
                  <Pagination
                    count={numPages}
                    variant="outlined"
                    shape="rounded"
                    color="primary"
                    page={Number(page)}
                    onChange={handleChangePage}
                  />
                </div>
              )}
            </div>
            <GridMapSideAbilities />
          </div>
        </div>
      )}
    </>
  );
}
