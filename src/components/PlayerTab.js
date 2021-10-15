import React, { useState } from "react";
import { ReactSVG } from "react-svg";
import Container from "./Container";
import PlayerRankerBoard from "./PlayerRankerBoard";
import topPlayersIcon from "../assets/img/leaderboard/top-players.svg";
import PlayerRankerTable from "./PlayerRankerTable";
import pattern1 from "../assets/img/leaderboard/ranker-pattern-1.svg";
import pattern2 from "../assets/img/leaderboard/ranker-pattern-2.svg";

export default function PlayerTab({
  type = "all",
  numPages = 1,
  page = 1,
  players,
  accountRank,
  firstTopPlayers = [],
}) {
  return (
    <div className="player-tab">
      <Container>
        <ReactSVG
          src={topPlayersIcon}
          className="display-center pt-50 pb-50 position-relative z-index-10 margin-fullwidth"
        />
        <div className="player-tab-content">
          <PlayerRankerBoard firstTopPlayers={firstTopPlayers} />
          <PlayerRankerTable
            type={type}
            numPages={numPages}
            page={page}
            players={players}
            accountRank={accountRank}
          />
        </div>
        <div className="leaderboard-patterns">
          <ReactSVG src={pattern1} />
          <ReactSVG src={pattern2} />
        </div>
      </Container>
    </div>
  );
}
