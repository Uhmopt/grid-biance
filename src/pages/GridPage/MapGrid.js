import React, { useEffect, useRef, useState } from "react";
import CellInfoModal from "components/dialog/CellInfoModal";
import Config from "utils/Config.json";
import { MobileCellInfoModal } from "components/dialog/CellInfoModal";
import { useSelector } from "react-redux";

let canvasContext;
let selected_cell = {
  clickX: null,
  clickY: null,
  x: null,
  y: null,
  cell_id: null,
  coordinates: null,
  price: null,
};

//draw text in the canvas
const drawFillText = (
  ctx,
  fillStyle,
  font,
  text = "",
  positionX,
  positionY
) => {
  ctx.fillStyle = fillStyle ?? "#ffffff";
  ctx.font = font ?? "14px Kanit, sans-serif";
  ctx.fillText(text, positionX, positionY);
};
//draw the rounded rectangle
const roundRectangle = (
  ctx,
  x,
  y,
  radius = 8,
  width,
  height,
  strokeStyle,
  lineWidth,
  fillStyle
) => {
  if (typeof radius === "undefined") {
    radius = 4;
  }
  if (typeof radius === "number") {
    radius = { tl: radius, tr: radius, br: radius, bl: radius };
  } else {
    var defaultRadius = { tl: 0, tr: 0, br: 0, bl: 0 };
    for (var side in defaultRadius) {
      radius[side] = radius[side] || defaultRadius[side];
    }
  }
  ctx.beginPath();
  ctx.moveTo(x + radius.tl, y);
  ctx.lineTo(x + width - radius.tr, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
  ctx.lineTo(x + width, y + height - radius.br);
  ctx.quadraticCurveTo(
    x + width,
    y + height,
    x + width - radius.br,
    y + height
  );
  ctx.lineTo(x + radius.bl, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
  ctx.lineTo(x, y + radius.tl);
  ctx.quadraticCurveTo(x, y, x + radius.tl, y);
  ctx.closePath();
  if (fillStyle) {
    ctx.fillStyle = fillStyle;
    ctx.fill();
  }
  if (strokeStyle) {
    ctx.strokeStyle = strokeStyle;
  }
  if (lineWidth) {
    ctx.lineWidth = lineWidth;
    ctx.stroke();
  }
};
//draw rounded rectangle with icon
const roundRectCell = (
  positionX,
  positionY,
  ctx,
  x,
  y,
  width,
  height,
  radius,
  mapData,
  fillStyle,
  account,
  focusCell
) => {
  roundRectangle(ctx, x, y, radius, width, height, null, null, fillStyle);
  if (mapData?.cells[positionX][positionY]?.grade === "4") {
    let icon = document.getElementById("perfect-icon");
    ctx.drawImage(icon, x + 5, y + 5, 15, 15);
  }
  if (mapData?.cells[positionX][positionY]?.grade === "2") {
    let icon = document.getElementById("premium-icon");
    ctx.drawImage(icon, x + 5, y + 5, 15, 15);
  }
  if (mapData?.cells[positionX][positionY]?.grade === "3") {
    let icon = document.getElementById("deluxe-icon");
    ctx.drawImage(icon, x + 5, y + 5, 15, 15);
  }
  const text = `${positionX + mapData.min_x}, ${positionY + mapData.min_y}`;

  drawFillText(ctx, "#ffffff", null, text, x + 5, y + height - 5);
  const cellInfo = mapData?.cells[positionX][positionY] ?? {};
  if (Number(cellInfo?.price || "") > 0) {
    let icon = document.getElementById("sale-icon");
    ctx.drawImage(icon, x + 35, y + 5, 35, 20);
  }
  if (String(cellInfo?.owner) === String(account)) {
    ctx.lineWidth = "4";
    ctx.strokeStyle = "#392298";
    ctx.stroke();
  }
  //focus cell stroke
  if (focusCell) {
    ctx.lineWidth = "4";
    ctx.strokeStyle = "#26ff12";
    ctx.stroke();
  }
};

//drawing rounded rectangle with animation
// const animateRoundRect = (ctx, x, y, width, height, radius, delay) => {
//   console.log("animateRoundRect");
//   let commands = [
//     ["moveTo", x, y + radius],
//     ["lineTo", x, y + height - radius],
//     ["quadraticCurveTo", x, y + height, x + radius, y + height],
//     ["lineTo", x + width - radius, y + height],
//     ["quadraticCurveTo", x + width, y + height, x + width, y + height - radius],
//     ["lineTo", x + width, y + radius],
//     ["quadraticCurveTo", x + width, y, x + width - radius, y],
//     ["lineTo", x + radius, y],
//     ["quadraticCurveTo", x, y, x, y + radius],
//   ];
//   function draw() {
//     var args = commands.shift();
//     var method = args.shift();
//     ctx[method].apply(ctx, args);
//     // console.log(args, method, "mentod");
//     ctx.lineWidth = 4;
//     ctx.strokeStyle = "#26ff12";
//     ctx.stroke();
//     if (commands.length) {
//       // setTimeout(draw, delay);
//       draw();
//     }
//   }
//   ctx.beginPath();
//   draw();
// };

//check if we've registered a new click and lock in this cell
const checkClickCell = (
  clickX,
  clickY,
  destination_x,
  destination_y,
  selected_cell_info,
  cell_width,
  cell_height,
  current_cell_id
) => {
  if (
    clickX !== false &&
    clickX > (document.getElementById("grid-page-sidebar")?.offsetWidth ?? 0) &&
    clickX -
      (document.getElementById("grid-page-sidebar")?.offsetWidth ?? 0) -
      10 >=
      destination_x &&
    clickX -
      (document.getElementById("grid-page-sidebar")?.offsetWidth ?? 0) -
      10 <=
      destination_x + cell_width - 5 &&
    clickY !== false &&
    clickY <
      window.innerHeight -
        (document.getElementById("footer")?.offsetHeight ?? 0) -
        10 &&
    clickY - document.getElementById("header").offsetHeight >= destination_y &&
    clickY - document.getElementById("header").offsetHeight <=
      destination_y + cell_height &&
    selected_cell_info.clickX !== clickX &&
    selected_cell_info.clickY !== clickY
  ) {
    selected_cell = {
      clickX: clickX,
      clickY: clickY,
      cell_id: current_cell_id,
    };
  }
};
//draw selected cell info
const drawSelectedCellInfo = (ctx, x, y, radius = 8, width, height) => {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + width, y, x + width, y + height, radius);
  ctx.arcTo(x + width, y + height, x, y + height, radius);
  ctx.arcTo(x, y + height, x, y, radius);
  ctx.arcTo(x, y, x + width, y, radius);
  ctx.moveTo(x + 15, y + height);
  ctx.lineTo(x + 25, y + 10 + height);
  ctx.lineTo(x + 35, y + height);
  ctx.closePath();
  ctx.fillStyle = "rgba(f, f, f, 0.3)";
  ctx.fill();
  const font = "18px Kanit, sans-serif";
  const fillStyle = "#333";
  drawFillText(ctx, fillStyle, font, "owner :", x + 10, y + 30);
  drawFillText(ctx, fillStyle, font, "0x4b...647f", x + 100, y + 30);
  drawFillText(ctx, fillStyle, font, "Price :", x + 10, y + 60);
  drawFillText(ctx, fillStyle, font, "3.2451BNB", x + 100, y + 60);
  drawFillText(ctx, fillStyle, font, "Earnings: ", x + 10, y + 90);
  drawFillText(ctx, fillStyle, font, "123.75BNB", x + 100, y + 90);
};

function MapGrid({
  mapData,
  updateMapLimits,
  worldX,
  worldY,
  clickX,
  clickY,
  canvasRef,
  onClearClickCell,
  linkX,
  linkY,
  focus,
  dragStatus,
  ...props
}) {
  const [canvasWidth, setCanvasWidth] = useState(0);
  const [canvasHeight, setCanvasHeight] = useState(0);
  const [num_columns, setNum_columns] = useState(0);
  const [num_rows, setNum_rows] = useState(0);
  const [cell_height, setCell_height] = useState(0);
  const [cell_width, setCell_width] = useState(0);
  const [selCellPosition, setSelCellPosition] = useState(null);
  const [selCellInfo, setSelCellInfo] = useState(selected_cell);
  const account = useSelector((state) => state?.app ?? {})?.account ?? null;
  const [linkedCell, setLinkedCell] = useState({});
  const [centerModalView, setCenterModalView] = useState(false);
  const resizeCanvas = () => {
    canvasRef.current.style.marginTop = `${
      document.getElementById("header").offsetHeight + 10
    }px`;
    //ADD DEBOUNCING LOGIC
    const canvasWidth =
      window.innerWidth -
      (document.getElementById("grid-page-sidebar")?.offsetWidth ?? 0) -
      20;
    const canvasHeight =
      window.innerHeight -
      document.getElementById("header").offsetHeight -
      document.getElementById("footer").offsetHeight -
      20;

    setCanvasWidth(canvasWidth);
    setCanvasHeight(canvasHeight);
    let num_columns = mapData?.max_x - mapData.min_x + 1;
    let num_rows = mapData?.max_y - mapData.min_y + 1;

    setNum_columns(mapData?.max_x - mapData.min_x + 1);
    setNum_rows(mapData?.max_y - mapData?.min_y + 1);
    //stretch cell size if the grid is very small
    let cell_width = 80;
    let cell_height = 80;
    if (canvasWidth < 500) {
      cell_width = 60;
      cell_height = 60;
    }
    let max_cells_x = Math.floor(canvasWidth / cell_width);
    let max_cells_y = Math.floor(canvasHeight / cell_height);

    setCell_width(cell_width);
    setCell_height(cell_height);

    updateMapLimits(
      max_cells_x,
      max_cells_y,
      num_rows,
      num_columns,
      cell_width,
      cell_height,
      canvasWidth,
      canvasHeight
    );
  };

  const renderGrid = () => {
    let highlight = false;
    canvasContext.clearRect(0, 0, canvasWidth, canvasHeight);
    for (var x = 0; x < num_columns; x++) {
      for (var y = 0; y < num_rows; y++) {
        let current_cell = { id: null, color: "ffffff" };
        if (typeof mapData?.cells[x][y] !== "undefined") {
          current_cell = mapData?.cells[x][y];
        }
        //where on the map to start drawing this tile
        let lower_x = parseFloat(x * cell_width),
          lower_y = parseFloat(y * cell_height),
          //where on the map to finish drawing this tile
          upper_x = parseFloat(lower_x + cell_width),
          upper_y = parseFloat(lower_y + cell_height),
          //where in the viewport to draw the tile
          destination_x = parseFloat(lower_x - worldX),
          destination_y = parseFloat(lower_y - worldY);
        //only draw everything if the cell actually exists
        if (current_cell.id) {
          if (
            clickX !== false &&
            clickX >
              (document.getElementById("grid-page-sidebar")?.offsetWidth ??
                0) &&
            clickX -
              (document.getElementById("grid-page-sidebar")?.offsetWidth ?? 0) -
              10 >=
              destination_x &&
            clickX -
              (document.getElementById("grid-page-sidebar")?.offsetWidth ?? 0) -
              10 <=
              destination_x + cell_width - 5 &&
            clickY !== false &&
            clickY <
              window.innerHeight -
                (document.getElementById("footer")?.offsetHeight ?? 0) -
                10 &&
            clickY - document.getElementById("header").offsetHeight >=
              destination_y &&
            clickY - document.getElementById("header").offsetHeight <=
              destination_y + cell_height &&
            selected_cell.clickX !== clickX &&
            selected_cell.clickY !== clickY
          ) {
            //check cell position with viewport
            if (
              destination_y < -(cell_height / 2) ||
              destination_x < -(cell_width / 2) ||
              destination_x + cell_width / 2 > canvasWidth ||
              destination_y + cell_height / 2 > canvasHeight
            ) {
              setCenterModalView(true);
            } else {
              setCenterModalView(false);
            }
            // console.log(
            //   "destinationX:",
            //   destination_x,
            //   "destination_y: ",
            //   destination_y
            // );
            selected_cell = {
              clickX: clickX,
              clickY: clickY,
              cell_id: current_cell.id,
              owner: current_cell?.owner ?? "",
              x: destination_x,
              y: destination_y,
              coordinates: `${x + mapData.min_x}, ${y + mapData.min_y}`,
              price: current_cell?.price ?? "0.00",
            };
            setSelCellInfo((prev) => ({ ...selected_cell }));
          }
          //if this cell was the last one clicked on, we will highlight it, even if the canvas has moved since that click
          if (current_cell.id == selected_cell.cell_id) {
            highlight = {
              x: destination_x,
              y: destination_y,
            };
          }
          let focusCell = false;
          if (
            linkX === Number(x + Number(mapData?.min_x)) &&
            linkY === Number(y + Number(mapData?.min_y)) &&
            focus
          ) {
            focusCell = true;
            // roundRectangle(
            //   canvasContext,
            //   x,
            //   y,
            //   8,
            //   cell_width - 5,
            //   cell_height - 5,
            //   null,
            //   4,
            //   null
            // );
            // const linkedCell = { ...current_cell, x: x, y: y };
            // setLinkedCell((prev) => linkedCell);
            // linkedCell = {
            //   ...current_cell,
            //   x: destination_x,
            //   y: destination_y,
            // };
          }

          roundRectCell(
            x,
            y,
            canvasContext,
            destination_x,
            destination_y,
            cell_width - 5,
            cell_height - 5,
            8,
            mapData,
            Config.team[current_cell.team].color,
            account,
            focusCell
          );
        } else {
          roundRectangle(
            canvasContext,
            destination_x,
            destination_y,
            8,
            cell_width - 5,
            cell_height - 5,
            null,
            null,
            "#eeeeee"
          );
        }
      }
    }
    //draw highlight last
    if (highlight) {
      roundRectangle(
        canvasContext,
        highlight.x,
        highlight.y,
        8,
        cell_width - 5,
        cell_height - 5,
        "#ff0def",
        4
      );
      const headerHeight = document.getElementById("header")?.offsetHeight ?? 0;
      const sideWidth =
        document.getElementById("grid-page-sidebar")?.offsetWidth ?? 0;
      setSelCellPosition({
        x: highlight.x + sideWidth + (cell_width * 3) / 5,
        y: highlight.y + headerHeight + cell_height,
      });
    }
  };

  const handleCloseCellInfoModal = () => {
    selected_cell = {
      clickX: null,
      clickY: null,
      cell_id: null,
      coordinates: null,
      price: null,
      owner: null,
    };
    setSelCellInfo({ ...selected_cell });
    onClearClickCell();
  };

  // const drawLinkedCellStroke = () => {
  //   canvasContext = canvasRef.current.getContext("2d");
  //   if (linkedCell?.id && focus) {
  //     let lower_x = parseFloat(linkedCell?.x * cell_width),
  //       lower_y = parseFloat(linkedCell?.y * cell_height),
  //       destination_x = parseFloat(lower_x - worldX),
  //       destination_y = parseFloat(lower_y - worldY);
  //     // console.log(linkedCell, "hello");
  //     animateRoundRect(
  //       canvasContext,
  //       destination_x,
  //       destination_y,
  //       cell_width - 5,
  //       cell_height - 5,
  //       8,
  //       1000
  //     );
  //   } else {
  //   }
  // };

  // useEffect(() => {
  //   drawLinkedCellStroke();
  // }, [linkedCell, worldX, worldY, cell_width, focus]);

  useEffect(() => {
    canvasContext = canvasRef.current.getContext("2d");
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();
    renderGrid();
    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  useEffect(() => {
    renderGrid();
  }, [
    canvasHeight,
    canvasWidth,
    cell_width,
    cell_height,
    worldX,
    worldY,
    clickY,
    clickX,
    selected_cell,
    focus,
  ]);

  useEffect(() => {
    if (dragStatus) {
      selected_cell = {};
      onClearClickCell();
    }
  }, [dragStatus]);

  return (
    <>
      <div className="canvas-div" style={{ zIndex: 2 }}>
        <canvas
          id="canvas-grid"
          ref={canvasRef}
          className="canvas-grid"
          width={canvasWidth}
          height={canvasHeight}
        />
      </div>
      {selected_cell?.cell_id && (
        <>
          {canvasWidth > 576 ? (
            <CellInfoModal
              centerModalView={centerModalView}
              position={selCellPosition}
              cellWidth={cell_width}
              cellHeight={cell_height}
              cellInfo={selected_cell}
              onClose={handleCloseCellInfoModal}
            />
          ) : (
            <MobileCellInfoModal
              position={selCellPosition}
              cellInfo={selected_cell}
              cellWidth={cell_width}
              cellHeight={cell_height}
              onClose={handleCloseCellInfoModal}
            />
          )}
        </>
      )}
    </>
  );
}

export default MapGrid;
