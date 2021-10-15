import ClearIcon from "@material-ui/icons/Clear";
import InfoIcon from "@material-ui/icons/Info";
import { CellCoordinates } from "components/Widget";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

export const CellInfoDetail = ({ handleClose, ...cellInfo }) => {
  const history = useHistory();

  return (
    <>
      <div className="cell-detail">
        <CellCoordinates position={cellInfo?.coordinates} />
        <p>#{cellInfo?.cell_id}</p>
      </div>
      <div className="cell-detail">
        <p>Owner :</p>
        <p>
          {Number(cellInfo?.owner.length) > 12
            ? cellInfo?.owner.substr(0, 4) +
              "..." +
              cellInfo?.owner.substr(38, 4)
            : "0x4b...647f"}
        </p>
      </div>
      {Number(cellInfo?.price) > 0 && (
        <div className="cell-detail">
          <p>Price :</p>
          <p>
            {Number(cellInfo?.price) > 0 ? `${cellInfo?.price}BNB` : "0.00BNB"}
          </p>
        </div>
      )}
      <button
        className="view-cell"
        onClick={() =>
          history.push(`/cell/${Number(cellInfo?.cell_id)}/history`)
        }
      >
        <InfoIcon />
        <span>View CELL</span>
      </button>
      <div className="close-cell-info" onClick={() => handleClose()}>
        <ClearIcon />
      </div>
    </>
  );
};

export default function CellInfoModal({
  onClose,
  cellWidth,
  cellHeight,
  cellInfo,
  centerModalView,
}) {
  const [modalPosition, setModalPosition] = useState(null);
  const [customStyle, setCustomStyle] = useState({});

  useEffect(() => {
    const headerHeight = document.getElementById("header")?.offsetHeight ?? 0;
    const sideWidth =
      document.getElementById("grid-page-sidebar")?.offsetWidth ?? 0;
    const canvasWidth =
      document.getElementById("canvas-grid")?.offsetWidth ?? 0;
    const canvasHeight =
      document.getElementById("canvas-grid")?.offsetHeight ?? 0;
    const cellInfoWidth =
      document.getElementById("selected-cell-grid")?.offsetWidth ?? 0;
    const cellInfoHeight =
      document.getElementById("selected-cell-grid")?.offsetHeight ?? 0;
    let modalPos = {
      top: `${cellInfo?.y + headerHeight + cellHeight}px`,
      left: `${cellInfo?.x + sideWidth + (cellWidth * 2) / 4}px`,
      zIndex: 10,
      transform: "none",
    };
    let customStyle = {
      top: 0,
      left: 0,
      marginLeft: "10px",
      transform: "translateY(-100%)",
      borderTop: 0,
      borderBottom: "8px solid #fff",
    };
    if (cellInfo?.x + cellInfoWidth > canvasWidth) {
      console.log("width:", cellInfo?.x + (cellWidth * 2) / 4);
      modalPos = {
        top: `${cellInfo?.y + headerHeight + cellHeight}px`,
        right: `${canvasWidth - (cellInfo?.x + (cellWidth * 2) / 4)}px`,
        zIndex: 10,
        transform: "none",
      };
      customStyle = {
        top: 0,
        right: 0,
        marginRight: "10px",
        transform: "translateY(-100%)",
        borderTop: 0,
        borderBottom: "8px solid #fff",
      };
      console.log("x overlay");
    }
    if (cellInfo?.y + cellInfoHeight > canvasHeight) {
      console.log("y overlay");
      modalPos = {
        top: `${cellInfo?.y + headerHeight + 10}px`,
        left: `${cellInfo?.x + sideWidth + (cellWidth * 2) / 4}px`,
        zIndex: 10,
        transform: "translateY(-100%)",
      };
      customStyle = {
        bottom: 0,
        left: 0,
        marginLeft: "10px",
        transform: "translateY(100%)",
        borderTop: "8px solid #fff",
        boderBottom: 0,
      };
    }
    if (
      cellInfo?.x + cellInfoWidth > canvasWidth &&
      cellInfo?.y + cellInfoHeight > canvasHeight
    ) {
      modalPos = {
        top: `${cellInfo?.y + headerHeight + 10}px`,
        right: `${canvasWidth - (cellInfo?.x + (cellWidth * 2) / 4)}px`,
        zIndex: 10,
        transform: "translateY(-100%)",
      };
      customStyle = {
        bottom: 0,
        right: 0,
        marginRight: "10px",
        transform: "translateY(100%)",
        borderTop: "8px solid #fff",
        boderBottom: 0,
      };
    }
    setModalPosition(modalPos);
    setCustomStyle(customStyle);
  }, [cellInfo]);

  return (
    <>
      {!centerModalView ? (
        <div
          id="selected-cell-grid"
          className="selected-cell-grid"
          style={modalPosition}
        >
          <CellInfoDetail {...cellInfo} handleClose={onClose} />
          <div className="director" style={customStyle}></div>
        </div>
      ) : (
        <div className="mobile-selected-cell-grid">
          <CellInfoDetail {...cellInfo} handleClose={onClose} />
        </div>
      )}
    </>
  );
}

export const MobileCellInfoModal = ({ onClose, cellInfo }) => {
  const history = useHistory();
  return (
    <div className="mobile-selected-cell-grid">
      <div className="cell-detail">
        <CellCoordinates position={cellInfo?.coordinates} />
        <p>#{cellInfo?.cell_id}</p>
      </div>
      <div className="cell-detail">
        <p>Owner :</p>
        <p>
          {Number(cellInfo?.owner.length) > 12
            ? cellInfo?.owner.substr(0, 4) +
              "..." +
              cellInfo?.owner.substr(38, 4)
            : "0x4b...647f"}
        </p>
      </div>
      {Number(cellInfo?.price) > 0 && (
        <div className="cell-detail">
          <p>Price :</p>
          <p>{cellInfo?.price ? `${cellInfo?.price}BNB` : "5.00BNB"}</p>
        </div>
      )}
      <button
        className="view-cell"
        onClick={() =>
          history.push(`/cell/${Number(cellInfo?.cell_id)}/history`)
        }
      >
        <InfoIcon />
        <span>View CELL</span>
      </button>
      <div className="close-cell-info" onClick={() => onClose()}>
        <ClearIcon />
      </div>
    </div>
  );
};
