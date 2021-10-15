import CellDetailHistory from "pages/CellPage/CellDetailHistory";
import LeaderboardTeamRankingsMonthlyPage from "pages/Leaderboard/LeaderboardTeamRankingsMonthlyPage";
import LeaderboardTeamRankingsPage from "pages/Leaderboard/LeaderboardTeamRankingsPage";
import LeaderboardTeamRankingsWeeklyPage from "pages/Leaderboard/LeaderboardTeamRankingsWeeklyPage";
import LeaderboardTopPlayersMonthlyPage from "pages/Leaderboard/LeaderboardTopPlayersMonthlyPage";
import LeaderboardTopPlayersWeeklyPage from "pages/Leaderboard/LeaderboardTopPlayersWeeklyPage";
import Admin from "../../components/Admin";
import CellDetail from "../../pages/CellPage/CellDetail";
import GridPage from "../../pages/GridPage/GridPage";
import HomePage from "../../pages/Homepage/HomePage";
import LeaderboardTopPlayersPage from "../../pages/Leaderboard/LeaderboardTopPlayersPage";
import MarketplacePage from "../../pages/Marketplace/MarketplacePage";
import MyCells from "../../pages/MyCells/MyCells";

const routeMaps = [
  {
    path: "/",
    exact: true,
    auth: false,
    component: HomePage,
  },
  // my-cells
  {
    path: "/my-cells",
    exact: true,
    auth: false,
    component: MyCells,
  },
  // The Grid
  {
    path: "/grid/:x/:y",
    exact: true,
    auth: false,
    component: GridPage,
  },
  // marketplace
  {
    path: "/market/:pagenum",
    exact: true,
    auth: false,
    component: MarketplacePage,
  },
  // cell detail
  {
    path: "/cell/:gridCellId/",
    exact: true,
    auth: false,
    component: CellDetailHistory,
  },
  // cell detail
  {
    path: "/cell/:gridCellId/:type",
    exact: true,
    auth: false,
    component: CellDetail,
  },
  //leaderboard page top players
  {
    path: "/leaderboard/top-players/:pagenum",
    exact: true,
    auth: false,
    component: LeaderboardTopPlayersPage,
  },
  //leaderboard page top players weekly
  {
    path: "/leaderboard/top-players/weekly/:pagenum",
    exact: true,
    auth: false,
    component: LeaderboardTopPlayersWeeklyPage,
  },
  //leaderboard page top players Monthly
  {
    path: "/leaderboard/top-players/monthly/:pagenum",
    exact: true,
    auth: false,
    component: LeaderboardTopPlayersMonthlyPage,
  },
  // leaderboard teamRankings.
  {
    path: "/leaderboard/team-rankings",
    exact: true,
    auth: false,
    component: LeaderboardTeamRankingsPage,
  },
  // leaderboard teamRankingsWeekly.
  {
    path: "/leaderboard/team-rankings/weekly",
    exact: true,
    auth: false,
    component: LeaderboardTeamRankingsWeeklyPage,
  },
  // leaderboard teamRankingsMonthly.
  {
    path: "/leaderboard/team-rankings/monthly",
    exact: true,
    auth: false,
    component: LeaderboardTeamRankingsMonthlyPage,
  },
  // admin
  {
    path: "/admin",
    exact: true,
    auth: false,
    component: Admin,
  },
];

export default routeMaps;
