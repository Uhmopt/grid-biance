import { makeStyles, Tooltip } from "@material-ui/core";
import cancelAuction from "assets/img/cancel-auction.svg";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { ReactSVG } from "react-svg";
import { toastMessage } from "store/actions/appAction";
import { BuyCell, CancelCell } from "store/actions/cellsAction";
import binanceIcon from "../assets/img/binance-icon.svg";
import detailDarkBack from "../assets/img/detail-back-dark.svg";
import detailBack from "../assets/img/detail-back.svg";
import flagIcon from "../assets/img/flag-icon.svg";
import Container from "./Container";
import {
  CellCoordinates,
  CellGrade,
  CellOwner,
  FormatPrice,
  getTeamColor,
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
  return <Tooltip arrow classes={classes} {...props} leaveTouchDelay={2000} />;
};

export default function DetailBanner({
  gridCellId,
  coordinate,
  grade,
  team,
  owner,
  earnings,
  sellable,
  theme,
  account,
  connector,
  ...cellInfo
}) {
  const { teamLabel, teamName, cellIcon } = getTeamColor(team);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const history = useHistory();

  const handleBuyAndCancel = (type) => {
    setLoading(true);
    if (type === "cancel") {
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
    } else {
      BuyCell(
        Number(gridCellId),
        cellInfo?.auction?.bidPrice,
        account,
        connector,
        (result) => {
          if (result.status) {
            toastMessage(dispatch, "Success", result.msg);
            setLoading(false);
            history.push("/my-cells");
          } else {
            toastMessage(dispatch, "Error", result.msg);
            setLoading(false);
          }
        }
      );
    }
  };
  return (
    <>
      {loading ? (
        <SubPageLoading theme={theme} />
      ) : (
        <div
          className="detail-banner"
          style={{
            backgroundImage: `url(${
              theme === "light" ? detailBack : detailDarkBack
            })`,
          }}
        >
          <Container>
            <div className="detail-banner-cell">
              <div className="cell-img display-center position-relative">
                <h2>
                  CELL ID: <span>#{gridCellId}</span>
                </h2>
                <div className="cell-img-origin position-relative">
                  <ReactSVG src={cellIcon} />
                  {sellable && <div className="cell-img-ribbon">Buy me!</div>}
                </div>
              </div>
              <div className="banner-cell-detail">
                <div className="cell-detail-item">
                  <label>Coordinates:</label>
                  <BootstrapTooltip
                    title={
                      <h4
                        style={{
                          fontSize: "14px",
                          margin: 0,
                          padding: "3px 5px",
                        }}
                      >
                        View on Grid
                      </h4>
                    }
                    placement="top"
                  >
                    <div
                      className="display-center"
                      onClick={() =>
                        history.push(`/grid/${coordinate[0]}/${coordinate[1]}`)
                      }
                    >
                      <CellCoordinates
                        position={`${coordinate[0]}, ${coordinate[1]}`}
                      />
                    </div>
                  </BootstrapTooltip>
                </div>
                <div className="cell-detail-item">
                  <label>Grade:</label>
                  <CellGrade grade={cellInfo?.gradeId} />
                </div>
                <div className="cell-detail-item">
                  <label>Owner:</label>
                  <CellOwner name={owner} />
                </div>
                <div className="cell-detail-item">
                  <label>Earnings:</label>
                  <h5>
                    {FormatPrice(earnings)}
                    <span>BNB</span>
                  </h5>
                </div>
                <div className="cell-detail-item">
                  <label>Team:</label>
                  <div className="display-center">
                    <ReactSVG
                      src={flagIcon}
                      className={`back-fill-${teamLabel} display-center`}
                    />
                    <h5 className={`color-${teamLabel}`}>{teamName}</h5>
                  </div>
                </div>
                {/* <div className="cell-detail-item">
                  <div
                    className="view-gird"
                    onClick={() =>
                      history.push(`/grid/${coordinate[0]}/${coordinate[1]}`)
                    }
                  >
                    <ReactSVG src={gridIcon} />
                    <span>View on Gird</span>
                  </div>
                </div> */}
              </div>
            </div>
            <div className="price-history-panel">
              {Boolean(cellInfo?.auction?.seller) ? (
                <div className="price-box">
                  <div className="display-center">
                    <label>PRICE:</label>
                    <h3>
                      {FormatPrice(cellInfo?.auction.currentPrice)}
                      <span>BNB</span>
                    </h3>
                  </div>
                  <button
                    onClick={() =>
                      handleBuyAndCancel(
                        Boolean(
                          account === cellInfo?.auction?.seller?.toLowerCase()
                        )
                          ? "cancel"
                          : "buy"
                      )
                    }
                  >
                    <ReactSVG
                      src={
                        Boolean(
                          account === cellInfo?.auction?.seller?.toLowerCase()
                        )
                          ? cancelAuction
                          : binanceIcon
                      }
                    />
                    <span>
                      {Boolean(
                        account === cellInfo?.auction?.seller?.toLowerCase()
                      )
                        ? "Cancel Auction"
                        : "Buy Now!"}
                    </span>
                  </button>
                </div>
              ) : null}
            </div>
          </Container>
        </div>
      )}
    </>
  );
}
