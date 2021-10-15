import React from "react";
import Container from "./Container";
import defaultAvatar from "../assets/img/default-avatar.svg";
import bitcoinIcon from "../assets/img/leaderboard/bitcoin.svg";
import starIcon from "../assets/img/leaderboard/banner-star.svg";
import pattern from "../assets/img/leaderboard/ranker-banner-pattern.svg";
import { ReactSVG } from "react-svg";

export default function LeaderboardBanner({
  rank,
  avatar,
  total_earnings,
  cell_count,
  total_stake,
}) {
  return (
    <div className="leader-banner">
      <Container>
        <div className="leader-banner-body">
          <div className="display-center">
            <img src={avatar ? avatar : defaultAvatar} alt="" />
            <div className="leader-banner-content">
              <h2>
                <ReactSVG src={starIcon} />
                Your Rank&nbsp;: <span>{rank ?? "Unranked"}</span>
              </h2>
              <div className="display-center">
                <ReactSVG src={bitcoinIcon} style={{ marginRight: 10 }} />
                <h3>
                  Earnings&nbsp;: <span>{total_earnings ? Number(total_earnings).toFixed(2) ?? 0 : 0}</span> GRID
                </h3>
              </div>
            </div>
          </div>
          <ReactSVG src={pattern} className="banner-pattern" />
        </div>
      </Container>
    </div>
  );
}
