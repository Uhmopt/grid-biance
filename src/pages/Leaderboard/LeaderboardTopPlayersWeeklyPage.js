import { ThemeContext } from "components/Theme";
import React, { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useHistory, useParams } from "react-router";
import {
  getCurrentUserRank,
  getTopPlayerLists,
} from "store/actions/leaderboardAction";
import LeaderboardBanner from "../../components/LeaderboardBanner";
import PageContent from "../../components/PageContent";
import PlayerTab from "../../components/PlayerTab";
import TeamTab from "../../components/TeamTab";
import { SubPageLoading, TopTabButton } from "../../components/Widget";

export default function LeaderboardTopPlayersWeeklyPage() {
  const themeContext = useContext(ThemeContext);
  const theme = themeContext.theme;
  const selected = true; //player => true, team => false
  let param = useParams()?.pagenum || 1;
  const [type, setType] = useState("week");
  const history = useHistory();
  const account = useSelector((state) => state?.app)?.account || null;
  const [accountRank, setAccountRank] = useState({});
  const [pagenum, setPagenum] = useState(1);
  const [totalPage, setTotalPage] = useState(null);
  const [topPlayers, setTopPlayers] = useState([]);
  const [firstTopPlayers, setFirstTopPlayers] = useState([]);
  const [loading, setLoading] = useState(false);

  const getAccountInfoRank = (account, type) => {
    getCurrentUserRank(
      type,
      account,
      (accountRank) => {
        setAccountRank(accountRank);
      },
      (error) => {
        setLoading(false);

        console.log(error);
      }
    );
  };

  const handleGetTopPlayerLists = (pagenum, type = "all") => {
    getTopPlayerLists(
      type,
      pagenum,
      (topPlayers) => {
        setTotalPage(topPlayers.num_pages);
        setTopPlayers(topPlayers?.players);
        getTopPlayerLists(
          type,
          1,
          (firstPageTopPlayers) => {
            setFirstTopPlayers(firstPageTopPlayers?.players);
            setLoading(false);
          },
          (error) => {
            setLoading(false);
            console.log(error, "firstPage");
          }
        );
      },
      (error) => {
        setLoading(false);

        console.log();
      }
    );
  };

  useEffect(() => {
    setLoading(true);
    handleGetTopPlayerLists(pagenum, type);
    // handleGetTopPlayerListsForFirst(1, type);
  }, [pagenum, type]);

  useEffect(() => {
    if (account) {
      getAccountInfoRank(account, type);
      setPagenum(1);
    }
  }, [account, type]);

  useEffect(() => {
    setPagenum(param);
  }, [param]);

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
              <PlayerTab
                type={type}
                numPages={totalPage}
                page={pagenum}
                players={topPlayers}
                accountRank={accountRank}
                firstTopPlayers={firstTopPlayers}
              />
            ) : (
              <TeamTab />
            )}
          </div>
        </>
      )}
    </PageContent>
  );
}
