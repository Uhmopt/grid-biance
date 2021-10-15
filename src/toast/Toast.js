import error from "assets/img/error.svg";
import success from "assets/img/success.svg";
import warning from "assets/img/warning.svg";
import { ReactSVG } from "react-svg";
import "./Toast.scss";

export default function ToastMessage() {
  const msg = JSON.parse(localStorage.getItem("store"))?.msg || "";
  const msgType =
    JSON.parse(localStorage.getItem("store"))?.msgType || "Success";
  return (
    <>
      {msgType === "Success" && (
        <div className="success-msg">
          <ReactSVG
            className="message-img"
            src={success}
            width={"100%"}
            height={"100%"}
          />
          <div className="msg-type">
            <span>Success!</span>
          </div>
          <div className="message-content">{msg}</div>
        </div>
      )}
      {msgType === "Error" && (
        <div className="error-msg">
          <ReactSVG
            className="message-img"
            src={error}
            width={"100%"}
            height={"100%"}
          />
          <div className="msg-type">
            <span>Error!</span>
          </div>
          <div className="message-content">{msg}</div>
        </div>
      )}
      {msgType === "Warning" && (
        <div className="success-msg">
          <ReactSVG
            className="message-img"
            src={warning}
            width={"100%"}
            height={"100%"}
          />
          <div className="msg-type">
            <span>Warning!</span>
          </div>
          <div className="message-content">{msg}</div>
        </div>
      )}
    </>
  );
}
