import React from "react";
import rankerBoardImage from "../assets/img/leaderboard/ranker-boards.svg";
import { ReactSVG } from "react-svg";
import defaultAvatar from "../assets/img/default-avatar.svg";
import goldMedal from "assets/img/gold-medal.svg";
import sliveMedal from "assets/img/siver-medal.svg";
import bronzeMedal from "assets/img/bronze-medal.svg";
import { CellOwner, getTeamColor } from "./Widget";

export default function PlayerRankerBoard({ firstTopPlayers }) {
  return (
    <div className="player-ranker-board">
      <div className="player-ranker-board-content">
        {/* <ReactSVG src={rankerBoardImage} /> */}
        {firstTopPlayers.length > 0 && (
          <>
            <div
              className="player-ranker-card"
              style={{
                background: `${
                  getTeamColor(firstTopPlayers[0]?.team)?.teamLabel
                }`,
              }}
            >
              <div className="player-ranker-name">
                {/* <img src={firstTopPlayers[0]?.avatar || defaultAvatar} alt="" /> */}
                <CellOwner
                  name={firstTopPlayers[0]?.address}
                  avatar={firstTopPlayers[0]?.avatar}
                />
              </div>
              <h4>Earnings:</h4>
              <h5>
                {firstTopPlayers[0]?.total_earnings
                  ? Number(firstTopPlayers[0]?.total_earnings).toFixed(2) || 0
                  : "0.00"}
                <span>GRID</span>
              </h5>
              <h4>CELLs:</h4>
              <h6>
                {firstTopPlayers[0]?.cell_count
                  ? firstTopPlayers[0]?.cell_count
                  : 0}
              </h6>
              <div className="order-medal">
                <ReactSVG src={goldMedal} />
              </div>
            </div>
            {firstTopPlayers.length > 1 && (
              <div
                className="player-ranker-card second"
                style={{
                  background: `${
                    getTeamColor(firstTopPlayers[1]?.team)?.teamLabel
                  }`,
                }}
              >
                <div className="player-ranker-name">
                  {/* <img src={firstTopPlayers[1]?.avatar || defaultAvatar} alt="" /> */}
                  <CellOwner
                    name={firstTopPlayers[1]?.address}
                    avatar={firstTopPlayers[1]?.avatar}
                  />
                </div>
                <h4>Earnings:</h4>
                <h5>
                  {Number(firstTopPlayers[1]?.total_earnings).toFixed(2) || 0}
                  <span>GRID</span>
                </h5>
                <h4>CELLs:</h4>
                <h6>{firstTopPlayers[1]?.cell_count}</h6>
                <div className="order-medal">
                  <ReactSVG src={sliveMedal} />
                </div>
              </div>
            )}
            {firstTopPlayers.length > 2 && (
              <div
                className="player-ranker-card third"
                style={{
                  background: `${
                    getTeamColor(firstTopPlayers[2]?.team)?.teamLabel
                  }`,
                }}
              >
                <div className="player-ranker-name">
                  {/* <img src={firstTopPlayers[1]?.avatar || defaultAvatar} alt="" /> */}
                  <CellOwner
                    name={firstTopPlayers[2]?.address}
                    avatar={firstTopPlayers[2]?.avatar}
                  />
                </div>
                <h4>Earnings:</h4>
                <h5>
                  {firstTopPlayers[2]?.total_earnings
                    ? Number(firstTopPlayers[2]?.total_earnings).toFixed(2) || 0
                    : "0.00"}
                  <span>GRID</span>
                </h5>
                <h4>CELLs:</h4>
                <h6>
                  {firstTopPlayers[2]?.cell_count
                    ? firstTopPlayers[2]?.cell_count
                    : 0}
                </h6>
                <div className="order-medal">
                  <ReactSVG src={bronzeMedal} />
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
