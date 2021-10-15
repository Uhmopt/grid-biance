import MapGrid from "pages/GridPage/MapGrid";
import React, { useEffect, useRef, useState } from "react";
import { getAxios } from "store/actions/appAction";
import perfectIcon from "assets/img/perfect-icon.svg";
import deluxeIcon from "assets/img/deluxe-icon.svg";
import premiumIcon from "assets/img/premium-icon.svg";
import saleIcon from "assets/img/sale.svg";
import info from "assets/img/info.svg";
import { useSelector } from "react-redux";
import { ReactSVG } from "react-svg";
import { useParams } from "react-router-dom";

const API_URL = process.env.REACT_APP_BACKEND_URL;

export default function GridMap(props) {
  const canvasRef = useRef();
  const toogleSidebar =
    useSelector((state) => state?.app)?.toogleSidebar ?? false;
  const [processedMapData, setProcessedMapData] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [clickX, setClickX] = useState(false);
  const [clickY, setClickY] = useState(false);
  const [worldX, setWorldX] = useState(0);
  const [worldY, setWorldY] = useState(0);
  const [cellWH, setCellWH] = useState({ width: 80, height: 80 });
  const [center, setCenter] = useState({});
  const [focus, setFocus] = useState(false);

  const linkX = Number(useParams()?.x) ?? 0;
  const linkY = Number(useParams()?.y) ?? 0;
  const [dragStatus, setDragStatus] = useState(false);

  const [movement, setMovement] = useState({
    updateTime: 30,
    up: false,
    down: false,
    left: false,
    right: false,
    mouseDrag: false,
    mouseLastX: 0,
    mouseLastY: 0,
    mouseClick: false,
    mouseClickX: 0,
    mouseClickY: 0,
    mouseMoveX: 0,
    mouseMoveY: 0,
  });

  const [limits, setLimits] = useState({
    max_cells_x: 0,
    max_cells_y: 0,
    num_rows: 0,
    num_columns: 0,
    cell_width: 0,
    cell_height: 0,
    screen_width: 0,
    screen_height: 0,
  });

  const handleKeyDown = (event) => {
    console.log(event, "envent");
    if (event.keyCode === 38) {
      //up
      setMovement((prev) => ({
        ...(prev ?? {}),
        up: true,
      }));
    }
    if (event.keyCode === 40) {
      //down
      setMovement((prev) => ({
        ...(prev ?? {}),
        down: true,
      }));
    }
    if (event.keyCode === 37) {
      //left
      setMovement((prev) => ({
        ...(prev ?? {}),
        left: true,
      }));
    }
    if (event.keyCode === 39) {
      //right
      setMovement((prev) => ({
        ...(prev ?? {}),
        right: true,
      }));
    }
  };

  const handleKeyUp = (event) => {
    console.log("hello world, handle Key Up");
    if (event.keyCode === 38) {
      setMovement((prev) => ({
        ...(prev ?? {}),
        up: false,
      }));
    }
    if (event.keyCode === 40) {
      //down
      setMovement((prev) => ({
        ...(prev ?? {}),
        down: false,
      }));
    }
    if (event.keyCode === 37) {
      //left
      setMovement((prev) => ({
        ...(prev ?? {}),
        left: false,
      }));
    }
    if (event.keyCode === 39) {
      //right
      setMovement((prev) => ({
        ...(prev ?? {}),
        right: false,
      }));
    }
  };

  const handleMouseDown = (event) => {
    event.preventDefault();
    setMovement((prev) => ({
      ...(prev ?? {}),
      mouseDrag: true,
      mouseClick: true,
      mouseLastX: event.clientX,
      mouseLastY: event.clientY,
    }));
    setDragStatus(true);
    // setFocus(false);
  };

  const handleMouseUp = (event) => {
    event.preventDefault();
    setMovement((prev) => {
      if (Boolean(prev?.mouseClick)) {
        setClickX(event.clientX);
        setClickY(event.clientY);
      }
      return { ...(prev ?? {}), mouseClick: false, mouseDrag: false };
    });
    setFocus(false);
    setDragStatus(false);
  };

  const handleMouseOut = (event) => {
    event.preventDefault();
    setMovement((prev) => {
      if (Boolean(prev?.mouseClick)) {
        setClickX(event.clientX);
        setClickY(event.clientY);
      }
      return { ...(prev ?? {}), mouseClick: false, mouseDrag: false };
    });
  };

  const handleDrag = (event) => {
    event.preventDefault();
    // if (Boolean(movement?.mouseDrag)) {
    setMovement((prev) => {
      if (prev?.mouseDrag) {
        return {
          ...(prev ?? {}),
          mouseClick: false,
          // mouseMoveX: Math.round((movement?.mouseLastX - event.clientX) * 4),
          // mouseMoveY: Math.round((movement?.mouseLastY - event.clientY) * 4),
          mouseMoveX: Math.round(prev?.mouseLastX - event.clientX),
          mouseMoveY: Math.round(prev?.mouseLastY - event.clientY),
          mouseLastX: event.clientX,
          mouseLastY: event.clientY,
        };
      } else {
        return prev;
      }
    });
    // }
  };

  const updateMapLimits = (
    max_cells_x,
    max_cells_y,
    num_rows,
    num_columns,
    cell_width,
    cell_height,
    screen_width,
    screen_height
  ) => {
    setLimits((prev) => ({
      ...(prev ?? {}),
      screen_width: screen_width,
      screen_height: screen_height,
      max_cells_x: max_cells_x,
      max_cells_y: max_cells_y,
      num_rows: num_rows,
      num_columns: num_columns,
      cell_width: cell_width,
      cell_height: cell_height,
    }));
    console.log("Map limits changed");
  };

  const updateMovement = () => {
    if (!loaded || !limits.max_cells_x || !limits.screen_height) {
      return;
    }
    var speed = 15,
      x_movement = movement?.mouseMoveX ?? 0,
      y_movement = movement?.mouseMoveY ?? 0,
      x_position = worldX,
      y_position = worldY;

    if (movement.up) {
      y_movement -= speed;
    }

    if (movement.down) {
      y_movement += speed;
    }

    if (movement.left) {
      x_movement -= speed;
    }

    if (movement.right) {
      x_movement += speed;
    }

    x_position += x_movement;

    //bound lower x camera position
    if (x_position <= 0) {
      x_position = 0;
    }

    //bound upper x camera position
    var x_upper_bound =
      limits.num_columns * limits.cell_width - limits.screen_width;
    if (x_position >= x_upper_bound) {
      x_position = x_upper_bound;
    }

    y_position += y_movement;

    //bound lower y camera position
    if (y_position <= 0) {
      y_position = 0;
    }

    //bound upper y camera position
    var y_upper_bound =
      limits.num_rows * limits.cell_height - limits.screen_height;
    if (y_position >= y_upper_bound) {
      y_position = y_upper_bound;
    }
    if (x_position !== worldX || y_position !== worldY) {
      setWorldX(x_position);
      setWorldY(y_position);
    }

    setMovement((prev) => {
      if (prev.mouseMoveX !== 0 || prev.mouseMoveY !== 0) {
        return { ...(prev ?? {}), mouseMoveX: 0, mouseMoveY: 0 };
      } else {
        return prev;
      }
    });
  };

  const loadmapData = async () => {
    try {
      const loadmapDataRes = await getAxios(API_URL + "/map/get/");
      if (loadmapDataRes.output.total_cells == 0) {
        console.log("Map is empty");
        return;
      }
      loadmapDataRes.output.min_x = parseInt(loadmapDataRes.output.min_x);
      loadmapDataRes.output.max_x = parseInt(loadmapDataRes.output.max_x);
      loadmapDataRes.output.min_y = parseInt(loadmapDataRes.output.min_y);
      loadmapDataRes.output.max_y = parseInt(loadmapDataRes.output.max_y);
      setProcessedMapData(loadmapDataRes.output);
      // setLoaded(true);
    } catch (error) {
      console.log("Map parsing failed", error);
    }
  };

  const calcuDragPosition = () => {
    if (!processedMapData?.max_x || !center?.x || !cellWH?.width) {
      return;
    }
    if (processedMapData?.max_x) {
      let num_columns = processedMapData?.max_x - processedMapData.min_x + 1;
      let num_rows = processedMapData?.max_y - processedMapData.min_y + 1;
      for (var x = 0; x < num_columns; x++) {
        for (var y = 0; y < num_rows; y++) {
          const cell = processedMapData?.cells?.[x]?.[y];
          let num_columns =
            processedMapData?.max_x - processedMapData.min_x + 1;
          if (
            linkX === Number(x + Number(processedMapData?.min_x)) &&
            linkY === Number(y + Number(processedMapData?.min_y))
          ) {
            let lower_x = parseFloat(x * cellWH?.width ?? 0),
              lower_y = parseFloat(y * cellWH?.height ?? 0);

            const mouseMoveX = Math.round(
              lower_x + cellWH?.width / 2 - center?.x || 0
            );
            const mouseMoveY = Math.round(
              lower_y + cellWH?.height / 2 - center?.y || 0
            );

            setMovement((prev) => ({
              ...prev,
              mouseMoveX: mouseMoveX,
              mouseMoveY: mouseMoveY,
            }));
            setLoaded(true);
          }
        }
      }
      setFocus(true);
    }
  };

  useEffect(() => {
    updateMovement();
  }, [movement, limits, loaded]);

  useEffect(() => {
    loadmapData();
  }, []);

  useEffect(() => {
    const canvasSection = canvasRef.current;
    if (loaded) {
      canvasSection.addEventListener("keydown", handleKeyDown);
      canvasSection.addEventListener("keyup", handleKeyUp);
      canvasSection.addEventListener("mousedown", handleMouseDown);
      canvasSection.addEventListener("mousemove", handleDrag);
      canvasSection.addEventListener("mouseup", handleMouseUp);
      canvasSection.addEventListener("mouseleave", handleMouseOut);
    }
    return () => {
      if (loaded) {
        canvasSection.removeEventListener("keydown", handleKeyDown);
        canvasSection.removeEventListener("keyup", handleKeyUp);
        canvasSection.removeEventListener("mousedown", handleMouseDown);
        canvasSection.removeEventListener("mousemove", handleDrag);
        canvasSection.removeEventListener("mouseup", handleMouseUp);
        canvasSection.removeEventListener("mouseleave", handleMouseOut);
      }
    };
  }, [loaded]);

  useEffect(() => {
    calcuDragPosition();
  }, [cellWH, processedMapData, center]);

  useEffect(() => {
    const headerHeight = document.getElementById("header").offsetHeight;
    const canvasDiv = document
      .getElementById("grid-map")
      .getBoundingClientRect();
    if (processedMapData?.total_cells) {
      const centerX = (canvasDiv?.right - canvasDiv?.left) / 2;
      const centerY = (canvasDiv?.bottom - headerHeight) / 2;
      setCenter((prev) => ({ ...prev, x: centerX, y: centerY }));
    }
  }, [processedMapData]);

  return (
    <div
      className="grid-map"
      id="grid-map"
      style={{
        paddingTop: `${document.getElementById("header")}`,
        width: `${!toogleSidebar ? "100%" : "calc(100% - 280px)"}`,
      }}
    >
      {loaded && (
        <MapGrid
          worldX={worldX}
          worldY={worldY}
          clickX={clickX}
          clickY={clickY}
          updateMapLimits={updateMapLimits}
          mapData={processedMapData}
          canvasRef={canvasRef}
          linkX={linkX}
          linkY={linkY}
          focus={focus}
          dragStatus={dragStatus}
          onClearClickCell={() => {
            setClickX(false);
            setClickY(false);
            setFocus(false);
          }}
          {...props}
        />
      )}
      <div className="info-item">
        <ReactSVG src={info} />
      </div>
      <div className="grade-info">
        <div className="grade-content">
          <div className="item">
            <ReactSVG src={perfectIcon} />
            <p>Perfect Grade</p>
          </div>
          <div className="item">
            <ReactSVG src={deluxeIcon} />
            <p>Deluxe Grade</p>
          </div>
          <div className="item">
            <ReactSVG src={premiumIcon} />
            <p>Premium Grade</p>
          </div>
          <div className="item">
            <ReactSVG src={saleIcon} />
            <p>CELL For Sale</p>
          </div>
        </div>
      </div>
      <img
        id="premium-icon"
        src={premiumIcon}
        alt="perfectIcon"
        style={{ display: "none" }}
      />
      <img
        id="perfect-icon"
        src={perfectIcon}
        alt="perfectIcon"
        style={{ display: "none" }}
      />
      <img
        id="deluxe-icon"
        src={deluxeIcon}
        alt="perfectIcon"
        style={{ display: "none" }}
      />
      <img
        id="sale-icon"
        src={saleIcon}
        alt="sale-icon"
        style={{ display: "none" }}
      />
    </div>
  );
}
