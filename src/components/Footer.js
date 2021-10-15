import React, { useContext } from "react";
import pattern from "../assets/img/footer-pattern.svg";
import { ReactSVG } from "react-svg";
import twitterIcon from "../assets/img/twitter-icon.svg";
import mediumIcon from "../assets/img/medium-icon.svg";
import discordIcon from "../assets/img/discord-icon.svg";
import { ThemeContext } from "./Theme";

export default function Footer() {
  const themeContext = useContext(ThemeContext);
  const theme = themeContext.theme;

  return (
    <footer className={`footer display-center ${theme}`} id="footer">
      <div className="footer-linker display-center">
        <div className="footer-button">
          <button aria-label="twitter link button" component="span">
            <ReactSVG src={twitterIcon} />
          </button>
        </div>
        <div className="footer-button">
          <button aria-label="medium link button" component="span">
            <ReactSVG src={mediumIcon} />
          </button>
        </div>
        <div className="footer-button">
          <button aria-label="discord link button" component="span">
            <ReactSVG src={discordIcon} />
          </button>
        </div>
      </div>
    </footer>
  );
}
