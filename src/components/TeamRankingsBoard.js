import React, { useEffect, useState } from "react";
import teamIcon1 from "../assets/img/leaderboard/teamicon-1.svg";
import teamIcon2 from "../assets/img/leaderboard/teamicon-2.svg";
import teamIcon3 from "../assets/img/leaderboard/teamicon-3.svg";
import teamIcon4 from "../assets/img/leaderboard/teamicon-4.svg";
import teamIcon5 from "../assets/img/leaderboard/teamicon-5.svg";
import teamIcon6 from "../assets/img/leaderboard/teamicon-6.svg";
import teamIcon7 from "../assets/img/leaderboard/teamicon-7.svg";
import teamIcon8 from "../assets/img/leaderboard/teamicon-8.svg";
import flagIcon from "../assets/img/leaderboard/flag-motion.svg";
import { ReactSVG } from "react-svg";
import { getTeamColor } from "./Widget";

export default function TeamRankinsBoard({ teamsOrder }) {
  const [teams, setTeams] = useState([]);

  const setFlagOrderTeam = () => {
    let team = [];
    teamsOrder.forEach((item) => {
      let { teamLabel, teamName } = getTeamColor(Number(item.teamId));

      team.push({
        label: teamLabel,
        name: teamName
      });
    });

    setTeams(team);
  };

  useEffect(() => {
    if (teamsOrder.length > 0) {
      setFlagOrderTeam();
    }
  }, [teamsOrder]);

  return (
    <div className="team-rankins-board">
      <div className="team-rankins-board-content">
        <div className="team-item">
          <div className="team-item-icons">
            <ReactSVG src={teamIcon1} />
            <ReactSVG
              src={flagIcon}
              className={`team-flag back-fill-${teams[0]?.label}`}
            />
          </div>
          <span>{teams[0]?.name}</span>
        </div>
        <div className="team-item">
          <div className="team-item-icons">
            <ReactSVG src={teamIcon2} />
            <ReactSVG
              src={flagIcon}
              className={`team-flag back-fill-${teams[1]?.label}`}
            />
          </div>
          <span>{teams[1]?.name}</span>
        </div>
        <div className="team-item">
          <div className="team-item-icons">
            <ReactSVG src={teamIcon3} />
            <ReactSVG
              src={flagIcon}
              className={`team-flag back-fill-${teams[2]?.label}`}
            />
          </div>
          <span>{teams[2]?.name}</span>
        </div>
        <div className="team-item">
          <div className="team-item-icons">
            <ReactSVG src={teamIcon4} />
            <ReactSVG
              src={flagIcon}
              className={`team-flag back-fill-${teams[3]?.label}`}
            />
          </div>
          <span>{teams[3]?.name}</span>
        </div>
        <div className="team-item">
          <div className="team-item-icons">
            <ReactSVG src={teamIcon5} />
            <ReactSVG
              src={flagIcon}
              className={`team-flag back-fill-${teams[4]?.label}`}
            />
          </div>
          <span>{teams[4]?.name}</span>
        </div>
        <div className="team-item">
          <div className="team-item-icons">
            <ReactSVG src={teamIcon6} />
            <ReactSVG
              src={flagIcon}
              className={`team-flag back-fill-${teams[5]?.label}`}
            />
          </div>
          <span>{teams[5]?.name}</span>
        </div>
        <div className="team-item">
          <div className="team-item-icons">
            <ReactSVG src={teamIcon7} />
            <ReactSVG
              src={flagIcon}
              className={`team-flag back-fill-${teams[6]?.label}`}
            />
          </div>
          <span>{teams[6]?.name}</span>
        </div>
        <div className="team-item">
          <div className="team-item-icons">
            <ReactSVG src={teamIcon8} />
            <ReactSVG
              src={flagIcon}
              className={`team-flag back-fill-${teams[7]?.label}`}
            />
          </div>
          <span>{teams[7]?.name}</span>
        </div>
      </div>
    </div>
  );
}
