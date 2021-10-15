import { createStore, combineReducers } from "redux";
import authReducer from "./reducers/authReducer.js";
import appReducer from "store/reducers/appReducer";

export default () => {
  const store = createStore(
    combineReducers({
      auth: authReducer,
      app: appReducer,
    }),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  );

  store.subscribe(() => {
    const storeData = store.getState();
    localStorage.setItem(
      "store",
      JSON.stringify({
        auth: storeData?.auth ?? {},
        account: storeData?.app?.account ?? null,
        msgType: storeData?.app?.msgType ?? "",
        msg: storeData?.app?.msg ?? "",
        toogleSidebar: storeData?.app?.toogleSidebar ?? false,
      })
    );
  });

  return store;
};
