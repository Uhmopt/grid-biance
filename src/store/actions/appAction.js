import axios from "axios";
import { toast } from "react-toastify";
import ToastMessage, { SuccessMsg } from "toast/Toast";

export const setAuthentication = (dispatch, state = { account: null }) => {
  return dispatch({ type: "SET_ACCOUNT_INFO", payload: state });
};

export const setPageLoading = (dispatch, state = { pageLoading: false }) => {
  return dispatch({ type: "SET_PAGE_LOADING", payload: state });
};

export const changeToogleSidebar = (
  dispatch,
  state = { toogleSidebar: true }
) => {
  return dispatch({ type: "TOGGLE_SIDEBAR", payload: state });
};

export const setConnectorInjection = (
  dispatch,
  connector = { connector: null }
) => {
  return dispatch({ type: "SET_CONNECTOR", payload: connector });
};

export const getAxios = (url, body = {}, header = {}) => {
  return new Promise((resolve, reject) => {
    axios
      .get(url, body, { headers: header })
      .then((res) => {
        if (res.status === 200) {
          resolve(res.data);
        }
      })
      .catch((error) => {
        console.log(error, url);
        reject(error);
      });
  });
};

export const toastMessage = (dispatch, type = "Warning", msg = "") => {
  dispatch({ type: "TOAST_MESSAGE", payload: { msg: msg, msgType: type } });
  switch (type) {
    case "Success":
      toast.success(ToastMessage);
      break;
    case "Error":
      toast.error(ToastMessage);
      break;
    case "Warning":
      toast.warning(ToastMessage);
      break;
    default:
      break;
  }
};
