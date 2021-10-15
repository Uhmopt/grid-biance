import { getAxios } from "./appAction";

const API_URL = process.env.REACT_APP_BACKEND_URL + "/leaderboard/";

export const getLeaderboardTeams = async (type, onFinish, onError) => {
  try {
    const url =
      type === "all" ? API_URL + "teams/" : API_URL + `teams/${type}/`;
    const leaderboardRes = await getAxios(url);
    if (leaderboardRes.status === "OK") {
      console.log(leaderboardRes.output);
      onFinish(leaderboardRes.output);
    }
  } catch (error) {
    console.log(error, "getLeaderboard");
    onError(error);
  }
};

export const getCurrentUserRank = async (
  type = "all",
  account = "",
  onFinish,
  onError
) => {
  try {
    const url =
      type === "all"
        ? API_URL + `player/${account}`
        : API_URL + `player/${type}/${account}`;
    const accountRank = await getAxios(url);
    if (accountRank.status === "OK") {
      onFinish(accountRank.output);
    }
  } catch (error) {
    console.log(error, "currentUserRanking");
    onError(error);
  }
};

export const getTopPlayerLists = async (
  type = "all",
  pagenum,
  onFinish,
  onError
) => {
  try {
    const url =
      type === "all"
        ? API_URL + `players/${pagenum}`
        : API_URL + `players/${type}/${pagenum}`;
    const topPlayerRes = await getAxios(url);
    if (topPlayerRes.status === "OK") {
      onFinish(topPlayerRes.output);
    }
  } catch (error) {
    console.log(error, "getTopPlayers");
    onError(error);
  }
};
