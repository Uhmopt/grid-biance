const appState = {
  pageLoading: true,
  connector: null,
  account: JSON.parse(localStorage.getItem("store"))?.account ?? null,
  msgType: JSON.parse(localStorage.getItem("store"))?.app?.msgType || "Success",
  msg: JSON.parse(localStorage.getItem("store"))?.app?.msg || "",
  toogleSidebar: JSON.parse(
    localStorage.getItem("store")?.app?.toogleSidebar || false
  ),
};
const AppReducer = (state = appState, action) => {
  switch (action.type) {
    case "SET_PAGE_LOADING": {
      return {
        ...state,
        ...action.payload,
      };
    }
    case "SET_ACCOUNT_INFO": {
      return {
        ...state,
        ...action.payload,
      };
    }
    case "SET_CONNECTOR": {
      return {
        ...state,
        ...action.payload,
      };
    }
    case "TOAST_MESSAGE": {
      return {
        ...state,
        ...action.payload,
      };
    }
    case "TOGGLE_SIDEBAR": {
      return {
        ...state,
        ...action.payload,
      };
    }
    default:
      return state;
  }
};
export default AppReducer;
