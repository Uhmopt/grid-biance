import React from "react";
import { ReactSVG } from "react-svg";
import premiumIcon from "assets/img/premium-icon.svg";
import unlockIcon from "assets/img/sale.svg";
import { getTeamColor } from "./Widget";

export default function CellRect({
  color = "#DCF4FF",
  title = "",
  team,
  type,
  width = 120,
  height = 120,
  ...props
}) {
  const { teamLabel } = getTeamColor(team);

  return (
    <div
      className={`back-color-${teamLabel} cell-rect`}
      {...props}
      style={{ width: `${width}px`, height: `${height}px` }}
    >
      <div className="cell-rect-icons">
        <ReactSVG className="premium" src={premiumIcon} />
        {type === "auction" && (
          <div className="sellable-icon">
            <ReactSVG src={unlockIcon} />
          </div>
        )}
      </div>
      <div className="cell-rect-title">
        <span>{title}</span>
      </div>
    </div>
  );
}
