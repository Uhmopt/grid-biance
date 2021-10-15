import {
  IconButton,
  makeStyles,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  withStyles,
} from "@material-ui/core";
import Tooltip from "@material-ui/core/Tooltip";
import ArrowBackRoundedIcon from "@material-ui/icons/ArrowBackRounded";
import ArrowDownwardRoundedIcon from "@material-ui/icons/ArrowDownwardRounded";
import ArrowForwardRoundedIcon from "@material-ui/icons/ArrowForwardRounded";
import InfoRoundedIcon from "@material-ui/icons/InfoRounded";
import Pagination from "@material-ui/lab/Pagination";
import Skeleton from "@material-ui/lab/Skeleton";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory, useParams } from "react-router";
import Select from "react-select-me";
import { ReactSVG } from "react-svg";
import { setPageLoading, toastMessage } from "store/actions/appAction";
import { getAuctionList } from "store/actions/auctionAction";
import { BuyCell, CancelCell } from "store/actions/cellsAction";
import binanceIcon from "../assets/img/binance-icon.svg";
import {
  CellCoordinates,
  CellGrade,
  CellOwner,
  CellPrice,
  CellTeam,
  SubPageLoading,
} from "./Widget";

const useStylesBootstrap = makeStyles((theme) => ({
  arrow: {
    color: theme.palette.common.black,
  },
  tooltip: {
    backgroundColor: theme.palette.common.black,
  },
}));

const BootstrapTooltip = (props) => {
  const classes = useStylesBootstrap();
  return <Tooltip arrow classes={classes} {...props} />;
};

export default function CellMarketTable({ theme, ...props }) {
  const StyledTableCell = withStyles(() => ({
    head: {
      borderBottom: theme === "light" ? "2px solid #333" : "2px solid #ccc",
      color: theme === "light" ? "#333" : "#eee",
      fontSize: 24,
      fontWeight: 500,
      lineHeight: "180%",
      fontFamily: "Kanit",
      "@media(max-width: 768px)": {
        fontSize: 16,
      },
    },
  }))(TableCell);

  const StyledTableRow = withStyles(() => ({
    root: {
      "&:nth-of-type(odd)": {
        backgroundColor: theme === "light" ? "#f8f8f8" : "#494949",
        border: "none",
      },
    },
  }))(TableRow);

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

  const dispatch = useDispatch();
  const history = useHistory();
  const pagenum = useParams()?.pagenum;
  const connector = props?.connector || null;
  const connectorAccount = connector?.account ?? "";
  const [pageLoadingCell, setPageLoadingCell] = useState(true);
  const [page, setPage] = useState(pagenum);
  const [numPages, setNumPages] = useState(0);
  const [numActiveAuctions, setNumActiveAuctions] = useState(0);
  const [auctions, setAuctions] = useState([]);
  const [sort, setSort] = useState("latest");
  const [gradeFilter, setGradeFilter] = useState("all");
  const [account, setAccount] = useState(
    JSON.parse(localStorage.getItem("store"))?.app?.account || null
  );
  const [loading, setLoading] = useState(false);

  const handleSort = (value) => {
    setSort(value);
  };

  const handleGradeFilter = (value) => {
    setGradeFilter(value);
  };

  const handlePrev = () => {
    if (page === 1) return;
    history.push(`/market/${page - 1}`);
  };

  const handleNext = () => {
    if (page === numPages) return;
    history.push(`/market/${page + 1}`);
  };

  const handleBuyCell = async (gridCellId, bidPrice) => {
    setLoading(true);
    BuyCell(gridCellId, bidPrice, account, connector, (result) => {
      if (result.status) {
        toastMessage(dispatch, "Success", result.msg);
        setLoading(false);
        history.push("/my-cells");
      } else {
        toastMessage(dispatch, "Error", result.msg);
        setLoading(false);
      }
    });
  };

  const handleCancelCell = (gridCellId) => {
    setLoading(true);
    CancelCell(gridCellId, connector, account, (result) => {
      if (result.status) {
        toastMessage(dispatch, "Success", result.msg);
        setLoading(false);
        history.push("/my-cells");
      } else {
        toastMessage(dispatch, "Error", result.msg);
        setLoading(false);
      }
    });
  };

  const handleGetAuctionList = (page) => {
    getAuctionList(
      page,
      (res) => {
        setNumPages(res.numPages);
        setNumActiveAuctions(res.numActiveAuctions);
        setAuctions(res.auctionData);
        setPageLoading(dispatch, { pageLoading: false });
        setPageLoadingCell(false);
      },
      (error) => {
        console.log(error, "getAuctions");
        setPageLoading(dispatch, { pageLoading: false });
        setPageLoadingCell(false);
      }
    );
  };

  const getAccountInfo = (t) => {
    const account = t?.getAccount() ?? "";
    setAccount(account);
  };

  useEffect(() => {
    if (connectorAccount) {
      getAccountInfo(connector);
    }
  }, [connectorAccount]);

  useEffect(() => {
    setPageLoadingCell(true);
    handleGetAuctionList(pagenum);
    setPage(Number(pagenum));
  }, [pagenum]);

  const classes = useStyles();
  return (
    <>
      {loading ? (
        <SubPageLoading theme={theme} />
      ) : (
        <div className="cell-market-table">
          <div className="data-table-short">
            <label>Sort:</label>
            <Select
              options={sortingOptions}
              value={sort}
              onChange={handleSort}
            />
            <IconButton>
              <ArrowDownwardRoundedIcon style={{ fill: "#0E6EB5" }} />
            </IconButton>
            <label>Grade:</label>
            <Select
              options={gradeFilterOptions}
              value={gradeFilter}
              onChange={handleGradeFilter}
            />
          </div>
          <div className="data-table-conent">
            <div className="desktop-table">
              <TableContainer>
                <Table className={classes.table} aria-label="customized table">
                  <TableHead>
                    <TableRow>
                      <BootstrapTooltip
                        title={"Lorem ipsum dolor sit amet consectetur."}
                        placement="top"
                      >
                        <StyledTableCell align="center">
                          Coordinates
                        </StyledTableCell>
                      </BootstrapTooltip>
                      <BootstrapTooltip
                        title={"Lorem ipsum dolor sit amet consectetur."}
                        placement="top"
                      >
                        <StyledTableCell align="center">
                          Cell&nbsp;ID
                        </StyledTableCell>
                      </BootstrapTooltip>
                      <BootstrapTooltip
                        title={"Lorem ipsum dolor sit amet consectetur."}
                        placement="top"
                      >
                        <StyledTableCell align="center">Grade</StyledTableCell>
                      </BootstrapTooltip>
                      <BootstrapTooltip
                        title={"Lorem ipsum dolor sit amet consectetur."}
                        placement="top"
                      >
                        <StyledTableCell align="center">Team</StyledTableCell>
                      </BootstrapTooltip>
                      <BootstrapTooltip
                        title={"Lorem ipsum dolor sit amet consectetur."}
                        placement="top"
                      >
                        <StyledTableCell align="center">Seller</StyledTableCell>
                      </BootstrapTooltip>
                      <BootstrapTooltip
                        title={"Lorem ipsum dolor sit amet consectetur."}
                        placement="top"
                      >
                        <StyledTableCell align="center">Price</StyledTableCell>
                      </BootstrapTooltip>
                      <BootstrapTooltip
                        title={"Lorem ipsum dolor sit amet consectetur."}
                        placement="top"
                      >
                        <StyledTableCell align="center">Action</StyledTableCell>
                      </BootstrapTooltip>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {pageLoadingCell
                      ? Array.from(Array(7).keys()).map((i) => (
                          <StyledTableRow key={i}>
                            {Array.from(Array(7).keys()).map((j) => (
                              <TableCell align="center" key={j}>
                                <Skeleton
                                  animation="wave"
                                  variant="rect"
                                  height={20}
                                />
                              </TableCell>
                            ))}
                          </StyledTableRow>
                        ))
                      : auctions?.map((row, key) => (
                          <StyledTableRow key={key}>
                            <StyledTableCell
                              align="center"
                              onClick={() =>
                                history.push(
                                  `/grid/${row?.location?.split(", ")[0]}/${
                                    row?.location?.split(", ")[0]
                                  }`
                                )
                              }
                            >
                              <CellCoordinates position={row?.location} />
                            </StyledTableCell>
                            <StyledTableCell align="center">
                              <CellID id={row?.id} />
                            </StyledTableCell>
                            <StyledTableCell align="center">
                              <CellGrade grade={row?.gradeId} />
                            </StyledTableCell>
                            <StyledTableCell align="left">
                              <CellTeam team={row?.team} teamId={row?.teamId} />
                            </StyledTableCell>
                            <StyledTableCell align="center">
                              <CellOwner name={row?.seller} />
                            </StyledTableCell>
                            <StyledTableCell align="center">
                              <CellPrice price={row?.price} />
                            </StyledTableCell>
                            <StyledTableCell align="center">
                              <CellAction
                                account={account}
                                row={row}
                                handleBuy={handleBuyCell}
                                handleCancel={handleCancelCell}
                              />
                            </StyledTableCell>
                          </StyledTableRow>
                        ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
            <div className="cell-market-table-mobile">
              <div className="cell-market-table-mobile-content">
                {auctions?.map((row, key) => (
                  <div className="table-mobile-item" key={key}>
                    <div className="table-mobile-info ">
                      <label>Cell ID:</label>
                      <h4>{row?.id}</h4>
                    </div>
                    <div className="table-mobile-info">
                      <label>Team:</label>
                      <CellTeam team={row?.team} teamId={row?.teamId} />
                    </div>
                    <div className="table-mobile-info">
                      <label>Coordinates :</label>
                      <div className="display-center">
                        <h3>{row?.location}</h3>
                      </div>
                    </div>
                    <div className="table-mobile-info">
                      <label>Seller:</label>
                      <CellOwner name={row?.seller} />
                    </div>
                    <div className="table-mobile-info">
                      <label>Grade:</label>
                      <CellGrade grade={row?.gradeId} />
                    </div>
                    <div className="table-mobile-info">
                      <label>Price:</label>
                      <h4>
                        <CellPrice price={row?.price} />
                      </h4>
                    </div>
                    <div className="action-buttons display-center">
                      <CellAction
                        account={account}
                        row={row}
                        handleBuy={handleBuyCell}
                        handleCancel={handleCancelCell}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className={classes.paginationBar}>
            <Pagination
              count={numPages}
              variant="outlined"
              shape="rounded"
              color="primary"
              page={Number(page)}
              onChange={(e, num) => history.push(`/market/${num}`)}
            />
          </div>
          <div className="table-prev-next display-center">
            <button
              className="table-prev-button"
              onClick={handlePrev}
              style={
                Number(page) === 1
                  ? { cursor: "not-allowed" }
                  : { cursor: "pointer" }
              }
            >
              <ArrowBackRoundedIcon />
              <span>PREV</span>
            </button>
            <button
              className="table-next-button"
              onClick={handleNext}
              style={
                Number(page) === numPages
                  ? { cursor: "not-allowed" }
                  : { cursor: "pointer" }
              }
            >
              <span>Next</span>
              <ArrowForwardRoundedIcon />
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export function CellAction({ row, handleBuy, handleCancel, account }) {
  const history = useHistory();
  // const url = process.env.REACT_APP_FRONTEND_URL + `cell/${row.id}`;
  const url = window.location.origin + `/cell/${row.id}`;

  const handleCellInfo = (row) => {
    history.push({
      pathname: `/cell/${row.id}/history`,
      state: { cellInfo: row },
    });
  };

  const handleCellBuyCancel = (row) => {
    if (account !== row.seller) {
      handleBuy(row.id, row.bidPrice);
    } else {
      handleCancel(row.id);
    }
  };

  return (
    <div className="cell-actions display-center">
      <BootstrapTooltip title={url} placement="top">
        <button className="button-icon" onClick={() => handleCellInfo(row)}>
          <InfoRoundedIcon style={{ fill: "#392198" }} />
          <span>View CELL</span>
        </button>
      </BootstrapTooltip>
      <button className="button-icon" onClick={() => handleCellBuyCancel(row)}>
        <ReactSVG src={binanceIcon} />
        <span>{account !== row?.seller ? "buy" : "cancel"}</span>
      </button>
    </div>
  );
}

export function CellID({ id }) {
  return (
    <>
      <span className="cell-table-id-label">{id}</span>
    </>
  );
}

const sortingOptions = [
  { value: "latest", label: "Latest" },
  { value: "price", label: "Price" },
];

const gradeFilterOptions = [
  { value: "all", label: "All" },
  { value: "perfect", label: "Perfect" },
  { value: "deluxe", label: "Deluxe" },
  { value: "premium", label: "Premium" },
  { value: "standard", label: "Standard" },
];
