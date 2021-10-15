import { Grid, Paper } from "@material-ui/core";
import AutorenewIcon from "@material-ui/icons/Autorenew";
import { getTeamColor } from "components/Widget";
import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ReactSVG } from "react-svg";
import { getAxios, toastMessage } from "store/actions/appAction";
import ToastMessage from "toast/Toast";
import { ThemeContext } from "./Theme";
import { SubPageLoading } from "./Widget";
import perfectIcon from "assets/img/perfect-icon.svg";

export function ListTeamSection({
  team,
  teamId,
  gridCellId,
  stake,
  recommendTeam,
  ...item
}) {
  let { teamLabel, teamName } = getTeamColor(Number(item[1]?.team));
  const connector = useSelector((state) => state?.app)?.connector || null;
  const [loading, setLoading] = useState(false);
  const themeContext = useContext(ThemeContext);
  const theme = themeContext.theme;
  const dispatch = useDispatch();
  const handleChangeTeam = (team) => {
    setLoading(true);
    connector
      .getSignedContract("core")
      .setTeam(gridCellId, team)
      .then((result) => {
        console.log("SET TEAM RESULT");
        console.log(result);
      })
      .catch((error) => {
        //ADD ERROR HANDLING
        console.log(error);
        toastMessage(dispatch, "Error", error.data.message);
        setLoading(false);
      });
    //event TeamChange(uint256 indexed cellId, uint8 teamOld, uint8 indexed teamNew, uint64 timestamp)
    var filter = connector.getContract("gridCell").filters.TeamChange(
      gridCellId, //cellId
      null, //teamOld
      team, //teamNew
      null //timestamp
    );

    connector
      .getContract("gridCell")
      .on(filter, (cellId, teamOld, teamNew, timestamp, event) => {
        console.log(
          `Cell ID ${cellId} team changed from ${teamOld} to ${teamNew}`
        );
        setLoading(false);
        toastMessage(
          dispatch,
          "Success",
          `Cell ID ${cellId} team changed from ${teamOld} to ${teamNew}`
        );

        setTimeout(() => {
          window.location.reload();
        }, [2000]);
      });
  };

  return (
    <>
      {loading ? (
        <SubPageLoading theme={theme} />
      ) : (
        <Grid item xs={12} md={6}>
          <Paper>
            <div
              className={
                `change-team-section border-hover-${teamLabel}` +
                (team === Number(item[1]?.team) ? ` border-${teamLabel}` : "")
              }
            >
              <div className="team-label">
                <>
                  <span className={`back-color-${teamLabel}`}></span>
                  <label className={`color-${teamLabel}`}>{teamName}</label>
                </>
                {recommendTeam?.team === item[1]?.team && (
                  <div className="recommended">
                    <ReactSVG src={perfectIcon} />
                  </div>
                )}
              </div>
              <div className="team-detail">
                <div className="team-detail-item">
                  <label>Last Earnings Rank:</label>
                  <span>{item[1]?.rank}</span>
                </div>
                <div className="team-detail-item">
                  <label>Last Team Earnings:</label>
                  <span>{parseFloat(item[1]?.tokens_earned).toFixed(4)}</span>
                </div>
                <div className="team-detail-item">
                  <label>Total Stake:</label>
                  <span>{item[1].total_stake}</span>
                </div>
                <div className="team-detail-item">
                  <label>Your Potential Share:</label>
                  <span>
                    {(
                      Number(item[1]?.tokens_earned_per_stake) * Number(stake)
                    ).toFixed(4)}
                  </span>
                </div>
                {team !== Number(item[1]?.team) && (
                  <div
                    className="action-button display-center"
                    onClick={() => handleChangeTeam(team)}
                  >
                    <button className="button-icon">
                      <AutorenewIcon style={{ fill: "#392198" }} />
                      <span>Change Team</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </Paper>
        </Grid>
      )}
    </>
  );
}
export default function ChangeTeam({ team, gridCellId, stake = 1 }) {
  const API_URL = process.env.REACT_APP_BACKEND_URL;
  const [teamInfo, setTeamInfo] = useState(null);
  const [recommendTeam, setRecommendTeam] = useState(null);

  const getTeamInfo = async () => {
    try {
      const teams = await getAxios(API_URL + "/earning/teams/");
      if (teams.status === "OK") {
        const teamInfo = Object.values(teams?.output);
        setTeamInfo(teamInfo);
        setRecommendTeam(
          (prev) =>
            teamInfo.sort(
              (a, b) =>
                Number(b.tokens_earned_per_stake) -
                Number(a.tokens_earned_per_stake)
            )[0]
        );
      } else {
        setTeamInfo([]);
      }
    } catch (error) {
      setTeamInfo([]);
    }
  };

  useEffect(() => {
    getTeamInfo();
    return () => {
      getTeamInfo();
    };
  }, []);

  return (
    <div className="change-team">
      {/* <h2>
          <ReactSVG src={titleIcon} />
          <span>Change a Team</span>
        </h2> */}
      <Grid container spacing={3}>
        {teamInfo &&
          Boolean(Object.entries(teamInfo)?.length > 0) &&
          Object.entries(teamInfo).map((item, index) => (
            <ListTeamSection
              team={team}
              teamId={Number(team)}
              gridCellId={Number(gridCellId)}
              key={index}
              stake={stake}
              recommendTeam={recommendTeam}
              {...item}
            />
          ))}
      </Grid>
    </div>
  );
}
