import React from "react";
import { ReactSVG } from "react-svg";
import perfectIcon from "../assets/img/perfect-icon.svg";
import deluxeIcon from "../assets/img/deluxe-icon.svg";
import premiumIcon from "../assets/img/premium-icon.svg";
import locationIcon from "../assets/img/location.svg";
import defaultAvatar from "../assets/img/default-avatar.svg";
import EventNoteIcon from "@material-ui/icons/EventNote";
import Skeleton from "@material-ui/lab/Skeleton";
import lightLoadingImg from "assets/img/bsc-grid-text-loading.gif";
import darkLoadingImg from "assets/img/bsc-grid-loading@dark.gif";
import { makeStyles, Tooltip } from "@material-ui/core";
import cellaquaIcon from "../assets/img/cells/cell-aqua.svg";
import cellblueIcon from "../assets/img/cells/cell-blue.svg";
import cellgreenIcon from "../assets/img/cells/cell-green.svg";
import cellorangeIcon from "../assets/img/cells/cell-orange.svg";
import cellpinkIcon from "../assets/img/cells/cell-pink.svg";
import cellpurpleIcon from "../assets/img/cells/cell-purple.svg";
import cellredIcon from "../assets/img/cells/cell-red.svg";
import cellyellowIcon from "../assets/img/cells/cell-yellow.svg";
import bombImage from "../assets/img/bomb-icon.png";
import shieldImage from "../assets/img/shield-icon.png";
import moment from "moment";

export function FormatPrice(price, include_suffix = false) {
  var decimals = price.split(".")[1],
    output_decimals =
      decimals.length < 3 || decimals.substr(2) === "0000000000000000" ? 2 : 4,
    output_price = Number(price).toFixed(output_decimals);

  return include_suffix ? output_price + " BNB" : output_price;
}

const useStylesBootstrap = makeStyles((theme) => ({
  arrow: {
    color: theme.palette.common.black,
  },
  tooltip: {
    backgroundColor: theme.palette.common.black,
  },
}));

export const PageLoading = ({ theme }) => {
  return (
    <div className="page-loading">
      <img
        src={theme === "light" ? lightLoadingImg : darkLoadingImg}
        alt="loading"
      />
    </div>
  );
};

export const SubPageLoading = ({ theme }) => {
  return (
    <div
      className="sub-page-loading"
      style={{ backgroundColor: theme === "light" ? "#fff" : "#333" }}
    >
      <img
        src={theme === "light" ? lightLoadingImg : darkLoadingImg}
        alt="loading"
      />
    </div>
  );
};

export const GridMapSideAbilities = () => {
  return (
    <div className="abilities-box">
      <span className="abilities-box-title">ABILITIES</span>
      <div className="abilities-box-button">
        <button>
          <img src={bombImage} alt="" />
          <label>Colour Bomb</label>
          <span>5</span>
        </button>
        <button>
          <img src={shieldImage} alt="" />
          <label>Colour Shield</label>
          <span>2</span>
        </button>
      </div>
    </div>
  );
};

export function SkeletonCell({ count = 1, width = 90 }) {
  const useStyles = makeStyles({
    root: {
      width: width,
    },
  });
  const classes = useStyles();
  return (
    <>
      <div className={classes.root}>
        <Skeleton animation="wave" variant="rect" />
      </div>
    </>
  );
}

export function CellCoordinates({ position, border }) {
  return (
    <div
      className="cell-coordinates display-center pointer"
      style={{ border: `${border ? border : "1px solid #ccc"}` }}
    >
      <ReactSVG src={locationIcon} />
      <span>{position?.split(", ")[0]}</span>
      <span>,</span>
      <span>{position?.split(", ")[1]}</span>
    </div>
  );
}

export function CellPrice({ price }) {
  return (
    <div className="cell-price">
      <span>{price}</span>
      <span> BNB</span>
    </div>
  );
}

export function CellOwner({ name, avatar }) {
  return (
    <div className="cell-seller display-center">
      <img src={avatar ? avatar : defaultAvatar} alt="" />
      <span>
        {name
          ? name.length > 12
            ? name.substr(0, 4) + "..." + name.substr(38, 4)
            : name
          : "-"}
      </span>
    </div>
  );
}

export function CellGrade({ grade }) {
  const BootstrapTooltip = (props) => {
    const classes = useStylesBootstrap();
    return <Tooltip arrow classes={classes} {...props} />;
  };

  let gradeLabel = "Standard";
  let gradeIcon = "Standard";
  let gradeToolip = "Standard CELLs earn the default amount of GRID tokens";
  if (grade === 4) {
    gradeLabel = "Perfect";
    gradeIcon = perfectIcon;
    gradeToolip =
      "This CELL earns TEN TIMES more GRID tokens than a Standard CELL. Only one Perfect grade CELL will ever exist.";
  } else if (grade === 3) {
    gradeLabel = "Deluxe";
    gradeIcon = deluxeIcon;
    gradeToolip =
      "CELLs of this grade earn FIVE TIMES as many GRID tokens as Standard grade CELLs.";
  } else if (grade === 2) {
    gradeLabel = "Premium";
    gradeIcon = premiumIcon;
    gradeToolip =
      "CELLs of this grade earn TWO TIMES as many GRID tokens as Standard grade CELLs.";
  }
  return (
    <BootstrapTooltip title={gradeToolip} placement="top">
      <div className="cell-table-grade">
        {gradeIcon !== "Standard" ? (
          <ReactSVG src={gradeIcon || ""} />
        ) : (
          <div style={{ width: 18, height: 18, marginRight: 10 }}></div>
        )}
        <span className="cell-table-id-label">{gradeLabel}</span>
      </div>
    </BootstrapTooltip>
  );
}

export function CellTeam({ team, teamId, width, align }) {
  const { teamLabel, teamName } = getTeamColor(teamId);
  return (
    <div
      className="cell-team display-center"
      style={{
        width: width ? width : "auto",
        justifyContent: align ? align : "flex-start",
      }}
    >
      <span className={`back-color-${teamLabel}`}></span>
      <label className={`color-${teamLabel}`}>{teamName}</label>
    </div>
  );
}

export function CellFlagTeam({ team }) {}

export function ForSaleChart({ data, axes }) {
  return (
    <div className="for-sale-chart">
      <Chart data={data} axes={axes} tooltip />
    </div>
  );
}

export function IconDate({ date }) {
  return (
    <div className="icon-date">
      <EventNoteIcon />
      <span>{date}</span>
    </div>
  );
}

export function TopTabButton({ children, ...props }) {
  return (
    <button className="top-tab-button" onClick={props.onClick}>
      <div className="top-tab-button-content">
        <span>{children}</span>
      </div>
    </button>
  );
}

export const getTeamColor = (teamId = 1) => {
  let teamLabel = "Standard";
  let teamName = "";
  let cellIcon = cellaquaIcon;
  if (Number(teamId) === 0) {
    teamLabel = "red";
    teamName = "Red Rocketeers";
    cellIcon = cellredIcon;
  } else if (Number(teamId) === 1) {
    teamLabel = "pink";
    teamName = "Pink Princesses";
    cellIcon = cellpinkIcon;
  } else if (Number(teamId) === 2) {
    teamLabel = "purple";
    teamName = "Purple Pirates";
    cellIcon = cellpurpleIcon;
  } else if (Number(teamId) === 3) {
    teamLabel = "blue";
    teamName = "Blue Ballers";
    cellIcon = cellblueIcon;
  } else if (Number(teamId) === 4) {
    teamLabel = "green";
    teamName = "Green Goblins";
    cellIcon = cellgreenIcon;
  } else if (Number(teamId) === 5) {
    teamLabel = "aqua";
    teamName = "Lavender Llamas";
    cellIcon = cellaquaIcon;
  } else if (Number(teamId) === 6) {
    teamLabel = "orange";
    teamName = "Orange Outlaws";
    cellIcon = cellorangeIcon;
  } else if (Number(teamId) === 7) {
    teamLabel = "yellow";
    teamName = "Mustard Magicians";
    cellIcon = cellyellowIcon;
  }
  return { teamLabel, teamName, cellIcon };
};

export const getActionTitle = (history) => {
  let actionText = "",
    dateText = "";
  switch (history?.action) {
    case "discovered":
      var username =
        (history?.owner).substr(0, 4) + "..." + (history?.owner).substr(38, 4);
      actionText = `Cell discovered by ${username}`;
      dateText = moment.unix(Number(history?.timestamp)).format("MMM DD YYYY");
      break;
    case "auction_created":
      var start_price = FormatPrice(history?.price_start, true),
        final_price = FormatPrice(history?.price_end, true),
        duration = Number(history?.duration) / 86400 + " days";

      if (history?.price_start === history?.price_end) {
        actionText = `Auction started for ${start_price}`;
      } else {
        actionText = `Auction started from ${start_price} to ${final_price} over ${duration}`;
      }

      dateText = moment.unix(Number(history?.timestamp)).format("MMM DD YYYY");
      break;
    case "auction_cancelled":
      actionText = "Auction cancelled";
      dateText = moment.unix(Number(history?.timestamp)).format("MMM DD YYYY");
      break;
    case "auction_successful":
      var username =
          (history?.winner).substr(0, 4) +
          "..." +
          (history?.winner).substr(38, 4),
        final_price = FormatPrice(history?.price, true);
      actionText = `Bought by ${username} for ${final_price}`;
      dateText = moment.unix(Number(history?.timestamp)).format("MMM DD YYYY");
      break;
    default:
      var team_old = getTeamColor(Number(history?.team_old))?.teamName,
        team_new = getTeamColor(Number(history?.team_new))?.teamName;
      actionText = `Team changed from ${team_old} to ${team_new}`;
      dateText = moment.unix(Number(history?.timestamp)).format("MMM DD YYYY");
      break;
  }
  return {
    actionText,
    dateText,
  };
};
