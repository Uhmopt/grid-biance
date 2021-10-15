import React from "react";
import backImage from "../assets/img/what-is-token.svg";
import backImageDark from "../assets/img/what-is-token-dark.svg";
import { ReactSVG } from "react-svg";
import Container from "./Container";

export default function WhatIsToken({ theme }) {
  return (
    <div className="what-is-token-section">
      <Container>
        <div className="what-is-token">
          <div className="what-token-img">
            <ReactSVG src={theme === "light" ? backImage : backImageDark} />
          </div>
          <div className="what-token-content">
            <h2>What are GRID tokens?</h2>
            <p>
              GRID tokens are used to buy profile upgrades (such as cool Avatar
              NFTs!) and power ups which can affect your CELLs or others. These
              power ups can be advantages to help you and your team... or even
              to make things harder for other teams!
            </p>
            <p>
              GRID tokens are also used for the governance of BSC-Grid, giving
              proportional representation to each owner to vote for new features
              or changes in how BSC-Grid operates.
            </p>
          </div>
        </div>
      </Container>
    </div>
  );
}
