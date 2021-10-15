import {
  makeStyles,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from "@material-ui/core";
import EventNoteIcon from "@material-ui/icons/EventNote";
import Skeleton from "@material-ui/lab/Skeleton";
import React, { useContext, useEffect, useState } from "react";
import { getCellAuctionHitory } from "store/actions/cellsAction";
import { ThemeContext } from "./Theme";
import { getActionTitle } from "./Widget";

export default function DetailHistory({ gridCellId }) {
  const themeContext = useContext(ThemeContext);
  const theme = themeContext.theme;
  const [cellHistory, setCellHistory] = useState(null);
  const [historyLoading, setHistoryLoading] = useState(true);

  const useStyles = makeStyles({
    table: {
      fontFamily: "Kanit",
      minWidth: 400,
    },
    root: {
      fontFamily: "Kanit",
      fontSize: 18,
      padding: 12,
      color: theme === "light" ? "#333" : "#eee",
      "@media(max-width: 768px)": {
        fontSize: 14,
        padding: 10,
      },
    },
    description: {
      fontFamily: "Kanit",
      fontSize: 16,
      maxWidth: 300,
    },
  });

  const classes = useStyles();

  const handleGetCellHistory = () => {
    getCellAuctionHitory(
      gridCellId,
      (cellHistory) => {
        setCellHistory(cellHistory);
        setHistoryLoading(false);
      },
      (error) => {
        setHistoryLoading(false);
      }
    );
  };

  useEffect(() => {
    setHistoryLoading(true);
    handleGetCellHistory();
  }, [gridCellId]);

  return (
    <div className="detail-history">
      {/* <div className="detail-history-title">
        <ReactSVG src={historyIcon} />
        <h3>History</h3>
      </div> */}
      <div className="detail-history-table">
        <TableContainer>
          <Table className={classes.table}>
            <TableBody>
              {historyLoading
                ? Array.from(Array(7).keys()).map((i) => (
                    <TableRow key={i}>
                      {Array.from(Array(5).keys()).map((j) => (
                        <TableCell align="center" key={j}>
                          <Skeleton
                            animation="wave"
                            variant="rect"
                            height={20}
                          />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                : Boolean(cellHistory.length)
                ? cellHistory.map((history, key) => {
                    const { actionText, dateText } = getActionTitle(history);
                    return (
                      <TableRow key={key}>
                        <TableCell className={classes.root} color="darkGray">
                          {actionText}
                        </TableCell>
                        <TableCell className={classes.root}>
                          <p className="display-center">
                            <EventNoteIcon />
                            &nbsp;{dateText}
                          </p>
                        </TableCell>
                      </TableRow>
                    );
                  })
                : null}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
}
