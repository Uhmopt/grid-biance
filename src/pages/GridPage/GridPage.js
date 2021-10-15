import React from "react";
import { useSelector } from "react-redux";
import GridMap from "../../components/GridMap.js";
import { Sidebar } from "../../components/GridSidebar.js";
export default function GridPage(props) {
  const toogleSidebar =
    useSelector((state) => state?.app)?.toogleSidebar ?? false;
  return (
    <div className="grid-page">
      <div className="grid-page-content">
        {toogleSidebar && <Sidebar {...props} />}
        <GridMap {...props} />
      </div>
    </div>
  );
}
