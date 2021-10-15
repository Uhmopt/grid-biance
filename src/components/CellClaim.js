import { ReactSVG } from "react-svg";
import collectIcon from "assets/img/claim.svg";
import stopWatchIcon from "assets/img/stop-watch.svg";
import binanceIcon from "assets/img/binance-icon.svg";
import { CellTeam, FormatPrice } from "./Widget";
import { useEffect, useState } from "react";
import { getAxios } from "store/actions/appAction";

const CellClaim = ({ handleClaim, team, ...cellInfo }) => {
  const [teamInfo, setTeamInfo] = useState({});
  const API_URL = process.env.REACT_APP_BACKEND_URL;

  const getTeamInfo = async () => {
    try {
      const teams = await getAxios(API_URL + "/earning/teams/");
      if (teams.status === "OK") {
        setTeamInfo(
          () =>
            Object.values(teams?.output).filter(
              (item) => Number(item.team) === team
            )?.[0] ?? {}
        );
      } else {
        setTeamInfo({});
      }
    } catch (error) {
      setTeamInfo({});
    }
  };

  useEffect(() => {
    getTeamInfo();
    return () => {
      getTeamInfo();
    };
  }, []);

  return (
    <>
      <div className="cell-claim">
        <div className="claim-section">
          <div className="claim-pending-token display-center">
            <p>
              Unclaimed Tokens:&nbsp;{" "}
              <span>{FormatPrice(cellInfo?.rewards) ?? 0}</span>
              &nbsp;GRID
            </p>
          </div>
          <div className="next-timer display-center">
            <div className="next-timer-detail display-center">
              <ReactSVG src={stopWatchIcon} />
              <h5>Next token distribution time:</h5>
              <h4>07:54</h4>
            </div>
          </div>
          <div className="cell-claim-info">
            <div>
              <p>Team:</p>
              <span>
                <CellTeam teamId={team} />
              </span>
            </div>
            <p>
              Stake:&nbsp;<span>{cellInfo?.stake ?? ""}</span>
            </p>
            <p>
              Total Team Stake:&nbsp;<span>{teamInfo?.total_stake}</span>
            </p>
            <p>
              Last Team Earnings:&nbsp;
              <span>{parseFloat(teamInfo?.tokens_earned).toFixed(2)} GRID</span>
            </p>
            <p>
              Your Last Earnings:&nbsp;
              <span>
                {Number(teamInfo?.tokens_earned_per_stake).toFixed(2)} GRID
              </span>
            </p>
          </div>
        </div>
        <div className="claim-description">
          <div className="collect-button display-center">
            <button
              className="display-center position-relative"
              disabled={Number(cellInfo?.rewards) === 0 ? true : false}
              onClick={handleClaim}
            >
              <ReactSVG src={collectIcon} />
              <span>CLAIM</span>
              <ReactSVG src={binanceIcon} />
            </button>
          </div>
          <div className="description">
            <h1>Your CELL is earning GRID tokens!</h1>
            <p>
              Once per hour, your team will earn GRID tokens and your share of
              the team's earnings will be available to claim.
            </p>
            <p>
              You do not have to claim straight away, your tokens will
              accumulate until you decide to claim them into your wallet.
            </p>
            <p>
              Always try to maximise your earnings by being on the team that
              will earn you the most tokens.{" "}
              <a
                href="https://bscgrid.gitbook.io/bsc-grid/teams"
                target="_blank"
                rel="noopener noreferrer"
              >
                Learn more.
              </a>{" "}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default CellClaim;
