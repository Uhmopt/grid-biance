import React from "react";
import { Link } from "react-router-dom";
import gridBack from "../assets/img/hero-grid-back.png";
import gridBackDark from "../assets/img/hero-grid-back-dark.png";
import cloud1 from "../assets/img/cloud1.png";
import cloud2 from "../assets/img/cloud2.png";
import cloud3 from "../assets/img/cloud3.png";

import Container from "./Container";
export default function HeroBanner({ theme }) {
  return (
    <div className="hero-banner">
      <Container>
        <div className="hero-simbole-text">
          <div className="hero-simbole-text-item aqua-color">
            <span>B</span>
          </div>
          <div className="hero-simbole-text-item green-color">
            <span>S</span>
          </div>
          <div className="hero-simbole-text-item pink-color">
            <span>C</span>
          </div>
          <div className="hero-simbole-text-item purple-color">
            <span>-</span>
          </div>
          <div className="hero-simbole-text-item red-color">
            <span>G</span>
          </div>
          <div className="hero-simbole-text-item blue-color">
            <span>R</span>
          </div>
          <div className="hero-simbole-text-item orange-color">
            <span>I</span>
          </div>
          <div className="hero-simbole-text-item yellow-color">
            <span>D</span>
          </div>
        </div>
        <p className="p-text mt-50 mb-50">
          Every CELL on The Grid is a Non-Fungible Token (NFT). Each CELL has
          its own coordinates and unique properties. Buy a CELL from the
          Marketplace and immediately start earning GRID tokens which power
          BSC-Grid.
        </p>
        <div className="text-align-center">
          <Link to="/market/1">
            <button className="button-big-round button-cta mb-50">
              choose your cell
            </button>
          </Link>
        </div>
        <div className="hero-banner-back">
          <img
            src={theme === "light" ? gridBack : gridBackDark}
            alt="bsc grid banner"
          />
        </div>
        <div className="motion-clouds">
          <img src={cloud1} alt="" className="motion-cloud-1" />
          <img src={cloud2} alt="" className="motion-cloud-2" />
          <img src={cloud3} alt="" className="motion-cloud-3" />
        </div>
        <div className="hero-banner-guide">
          <Container>
            <p>
              Need some help?
              <span>
                {" "}
                Check out the{" "}
                <a
                  href="https://bscgrid.gitbook.io/bsc-grid/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  step-by-step guide
                </a>{" "}
                which explains everything you need to know. From BSC to BNB to
                NFT and BEP-20, we'll explain it all!
              </span>
            </p>
          </Container>
        </div>
      </Container>
    </div>
  );
}
