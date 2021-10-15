import React from "react";
import { Switch } from "react-router-dom";
import Route from "./route";
import "./assets/scss/style.scss";
import "react-select-me/lib/ReactSelectMe.css";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { GridThemeProvider } from "./components/Theme";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import WebsitePage from "components/WebsitePage";

const theme = createMuiTheme({
  palette: {
    primary: {
      // Purple and green play nicely together.
      main: "#214298",
    },
    secondary: {
      // This is green.A700 as hex.
      main: "#392298",
    },
    darkGray: {
      main: "#333",
    },
    lightGray: {
      main: "#777",
    },
  },
});

export default function BSCGrid() {
  return (
    <ThemeProvider theme={theme}>
      <GridThemeProvider>
        <ToastContainer limit={5} />
        <WebsitePage>
          <Header />
          <Switch>
            <Route />
          </Switch>
          <Footer />
        </WebsitePage>
      </GridThemeProvider>
    </ThemeProvider>
  );
}
