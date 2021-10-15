import React, { useEffect, useState } from "react";
import { ReactSVG } from "react-svg";
import Container from "./Container";
import teamIcon from "../assets/img/leaderboard/team-rankings.svg";
import pattern1 from "../assets/img/leaderboard/ranker-pattern-2.svg";
import pattern2 from "../assets/img/leaderboard/ranker-pattern-3.svg";
import TeamRankinsBoard from "./TeamRankingsBoard";
import TeamRankedTable from "./TeamRankedTable";
import TeamPieChart from "./TeamPieChart";
import { getLeaderboardTeams } from "store/actions/leaderboardAction";
import Config from "utils/Config.json";

export default function TeamTab({ type = "all" }) {
  const [teams, setTeams] = useState([]);
  const [grid, setGrid] = useState({ cells: 0 });
  const [loading, setLoading] = useState(true);
  const handleGetLeaderboard = (type = "") => {
    getLeaderboardTeams(
      type,
      (leaderboardRes) => {
        // console.log(leaderboardRes);
        if (
          leaderboardRes.total_cell === 0 ||
          typeof leaderboardRes.team === "undefined"
        ) {
          console.log("No leaderboard data to display");
          return;
        }
        let teamData = [];

        for (let i = 0; i < leaderboardRes.team.length; i++) {
          var currentTeamData = {
            rank: leaderboardRes.team[i].rank,
            teamId: leaderboardRes.team[i].team,
            name: Config.team[leaderboardRes.team[i].team].name,
            colour: Config.team[leaderboardRes.team[i].team].colour,
            color: Config.team[leaderboardRes.team[i].team].color,
            cellCount: leaderboardRes.team[i].cell_count,
            gridShare: leaderboardRes.team[i].stake,
            miningTotal: leaderboardRes.team[i]?.total_earnings,
            className:
              "teamLeaderboard team" +
              (parseInt(leaderboardRes.team[i].team) + 1) +
              "Background",
          };

          teamData[i] = currentTeamData;
        }
        //update our auction interface
        setTeams(teamData);
        setGrid({ cells: leaderboardRes.total_cells });
        setLoading(false);
      },
      (error) => {
        console.log("error", error);
        setLoading(false);
      }
    );
  };

  useEffect(() => {
    handleGetLeaderboard(type);
  }, [type]);

  return (
    <div className="team-tab">
      <Container>
        <ReactSVG
          src={teamIcon}
          className="display-center pt-50 pb-50 position-relative z-index-10 margin-fullwidth"
        />
        <div className="team-tab-content">
          <TeamRankinsBoard teamsOrder={teams.slice()} />
          <div className="team-ranked-content">
            <div className="team-pie-chart">
              <TeamPieChart teamOrder={teams} loading={loading} />
            </div>
            <div className="team-ranked-table">
              <TeamRankedTable
                teamsOrder={teams}
                loading={loading}
                type={type}
              />
            </div>
          </div>
        </div>
        <div className="leaderboard-patterns">
          <ReactSVG src={pattern1} />
          <ReactSVG src={pattern2} />
        </div>
      </Container>
    </div>
  );
}
