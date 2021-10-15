import React from "react";
import { Link } from "react-router-dom";
import { ReactSVG } from "react-svg";
import Container from "./Container";
import buttonIcon from "../assets/img/buy-cell-icon.svg";
import DarkJoinTeamImg from "../assets/img/dark-buy-cell.svg";
import LightJoinTeamImg from "../assets/img/light-buy-cell.svg";
import Config from '../utils/Config.json';

export default function JoinTeamSection({ theme }) {
  return (
    <div className="join-team-section display-center">
      <Container>
        <div className="join-team-content">
          <h2>Join a Team!</h2>
          <p>
            Each CELL can join one of 8 different coloured teams. Once every hour, 
            GRID tokens are distributed to each team's CELL owners based on which teams 
            have the biggest representations on the grid. 
            The team in 1st place will receive the most tokens ({Config.mining.rewards[0]}%), 
            down to the team in 8th place which receives the fewest tokens ({Config.mining.rewards[7]}%). 
            You can always change teams to maximise your earnings!
          </p>
          <Link to="/market/1">
            <button className="button-join-team button-cta">
              <span className="button-hover-effect"></span>
              <ReactSVG src={buttonIcon} />
              <span>get started</span>
            </button>
          </Link>
          <div className="join-team-back">
            <ReactSVG
              src={theme === "light" ? LightJoinTeamImg : DarkJoinTeamImg}
            />
          </div>
        </div>
      </Container>
    </div>
  );
}
