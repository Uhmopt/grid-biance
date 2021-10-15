import { ThemeContext } from "components/Theme";
import React, { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";
import { getCurrentUserRank } from "store/actions/leaderboardAction";
import LeaderboardBanner from "../../components/LeaderboardBanner";
import PageContent from "../../components/PageContent";
import PlayerTab from "../../components/PlayerTab";
import TeamTab from "../../components/TeamTab";
import { SubPageLoading, TopTabButton } from "../../components/Widget";

export default function LeaderboardTeamRankingsWeeklyPage() {
  const themeContext = useContext(ThemeContext);
  const theme = themeContext.theme;
  const selected = false; //player => true, team => false
  const [type, setType] = useState("week");
  const history = useHistory();
  const account = useSelector((state) => state?.app)?.account || null;
  const [accountRank, setAccountRank] = useState({});
  const [loading, setLoading] = useState(false);

  const getAccountInfoRank = (account, type) => {
    getCurrentUserRank(
      type,
      account,
      (accountRank) => {
        // console.log(accountRank, "accountRank")
        setAccountRank(accountRank);
      },
      (error) => {
        console.log(error);
      }
    );
  };

  useEffect(() => {
    if (account) {
      getAccountInfoRank(account, type);
    }
  }, [account, type]);

  return (
    <PageContent>
      {loading ? (
        <SubPageLoading theme={theme} />
      ) : (
        <>
          <LeaderboardBanner {...accountRank} />
          <div className="leader-board-content">
            <div
              className={`leader-board-tab-control display-center ${selected ? "tab-player" : "tab-team"
                }`}
            >
              <TopTabButton
                onClick={() => history.push("/leaderboard/top-players/1")}
              >
                Top Players
              </TopTabButton>
              <TopTabButton
                onClick={() => history.push("/leaderboard/team-rankings")}
              >
                Team Rankings
              </TopTabButton>
            </div>
            {selected ? (
              <PlayerTab />
            ) : (
              <TeamTab type={type} handleChange={(value) => setType(value)} />
            )}
          </div>
        </>
      )}
    </PageContent>
  );
}
