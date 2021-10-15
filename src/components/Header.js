import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Collapse } from "@material-ui/core";
import HamburgerMenu from "react-hamburger-menu";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { ReactSVG } from "react-svg";
import logoSimple from "../assets/img/logo-simple.svg";
import logo from "../assets/img/logo.svg";
import logoDark from "../assets/img/logo@white.svg";
import Connection from "./Connection";
import { ThemeContext } from "./Theme";
import ThemeSelector from "./ThemeSelector";
import Switch from "react-switch";
import { changeToogleSidebar, setPageLoading } from "store/actions/appAction";

export default function Header() {
  const history = useHistory();
  const dispatch = useDispatch();
  const [gridMap, setGridMap] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const themeContext = useContext(ThemeContext);
  const theme = themeContext.theme;

  const toogleSidebar =
    useSelector((state) => state?.app)?.toogleSidebar ?? false;

  const handleLink = (url) => {
    history.push(url);
    setMobileMenu(false);
  };

  const handleChangeWidth = () => {
    if (window.innerWidth < 992) {
      setPageLoading(dispatch, { toogleSidebar: false });
    } else {
      setPageLoading(dispatch, { toogleSidebar: true });
    }
  };

  useEffect(() => {
    mobileMenu
      ? (document.body.style.overflowY = "hidden")
      : (document.body.style.overflowY = "auto");
  }, [mobileMenu]);

  //check the grid page pathname,
  useEffect(() => {
    return history.listen((location) => {
      if (String(location?.pathname).includes("grid")) {
        setGridMap(true);
        document.getElementById("footer").style.display = "none";
      } else {
        setGridMap(false);
        document.getElementById("footer").style.display = "block";
      }
    });
  }, [history]);

  //check the location when refresh.
  useEffect(() => {
    if (String(location?.pathname).includes("grid")) {
      setGridMap(true);
      document.getElementById("footer").style.display = "none";
    } else {
      setGridMap(false);
      document.getElementById("footer").style.display = "block";
    }
    handleChangeWidth();
    window.addEventListener("resize", handleChangeWidth);
    return () => {
      window.removeEventListener("resize", handleChangeWidth);
    };
  }, []);

  return (
    <>
      {/* {pageLoading && <PageLoading />} */}
      <header
        id="header"
        className={`header ${theme}`}
        style={{ position: `${mobileMenu ? "fixed" : "absolute"}` }}
      >
        <div className="header-content">
          <div className="header-nav display-center">
            <div className="header-logo display-center">
              <nav onClick={() => handleLink("/")}>
                <ReactSVG src={theme === "light" ? logo : logoDark} />
              </nav>
            </div>
            <div className="header-nav-menu">
              {menus.map((item, key) => (
                <div className="nav-item" key={key}>
                  {item.title === "docs" ? (
                    <a
                      href={item.url}
                      target="_blank"
                      style={{ textDecoration: "none" }}
                    >
                      <nav>{item.title}</nav>
                    </a>
                  ) : (
                    <Link to={item.url} onClick={() => setMobileMenu(false)}>
                      {item.title}
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="header-user">
            <ThemeSelector />
            <div className="user-connect">
              {/* <button className="button-round"> */}
              <Connection history={history} theme={theme} />
              {/* </button> */}
            </div>
          </div>
        </div>
        <div className="mobile-header">
          <div className="mobile-menu">
            <div className="display-center">
              <nav onClick={() => handleLink("/")}>
                <ReactSVG src={logoSimple} />
              </nav>
              {gridMap && (
                <nav style={{ marginLeft: "10px" }}>
                  <Switch
                    onChange={() =>
                      changeToogleSidebar(dispatch, {
                        toogleSidebar: !toogleSidebar,
                      })
                    }
                    checked={toogleSidebar}
                    checkedIcon={false}
                    uncheckedIcon={false}
                    onColor="#FFA959"
                    offColor="#ccc"
                  />
                </nav>
              )}
            </div>
            <div className="mobile-header-setting">
              <ThemeSelector />
              <HamburgerMenu
                isOpen={mobileMenu}
                menuClicked={() => setMobileMenu(!mobileMenu)}
                width={24}
                height={15}
                strokeWidth={1}
                rotate={0}
                color={theme === "light" ? "black" : "white"}
                borderRadius={0}
                animationDuration={0.5}
                className="pointer"
              />
            </div>
          </div>
          <div className="collapse-menu">
            <Collapse in={mobileMenu}>
              <div className="mobile-menu-nav">
                {menus.map((item, key) => (
                  <div className="mobile-menu-item" key={key}>
                    {item.title === "docs" ? (
                      <a
                        href={item.url}
                        target="_blank"
                        style={{ textDecoration: "none" }}
                      >
                        <nav>{item.title}</nav>
                      </a>
                    ) : (
                      <Link to={item.url} onClick={() => setMobileMenu(false)}>
                        {item.title}
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </Collapse>
          </div>
        </div>
      </header>
    </>
  );
}

const menus = [
  {
    title: "my cells",
    url: "/my-cells",
    // url: "#",
  },
  {
    title: "the grid",
    url: "/grid/0/0",
  },
  {
    title: "marketplace",
    url: "/market/1",
  },
  {
    title: "leaderboard",
    url: "/leaderboard/top-players/1",
  },
  {
    title: "docs",
    url: "https://bscgrid.gitbook.io/bsc-grid/",
  },
];
