import React, { Component } from "react";
import Config from "../utils/Config.json";

class MapCanvas extends Component {
  constructor(props) {
    super(props);

    this.state = {
      canvasWidth: 0,
      canvasHeight: 0,
    };

    this.num_columns = 0;
    this.num_rows = 0;
    this.cell_width = 0;
    this.cell_height = 0;
    this.selected_cell = {
      clickX: null,
      clickY: null,
      cell_id: null,
    };

    this.canvasRef = React.createRef();
  }

  componentDidMount() {
    this.canvasContext = this.canvasRef.current.getContext("2d");
    window.addEventListener("resize", this.resizeCanvas);

    setTimeout(() => {
      this.resizeCanvas();
      this.renderGrid();
    }, 100);
  }

  componentWillUnmount = () => {
    window.removeEventListener("resize", this.resizeCanvas);
  };

  componentDidUpdate = (previousProps) => {
    this.renderGrid();
  };

  resizeCanvas = () => {
    //ADD DEBOUNCING LOGIC
    this.setState({
      canvasWidth: window.innerWidth,
      canvasHeight:
        window.innerHeight - document.getElementById("navigation").offsetHeight,
    });

    this.num_columns = this.props.mapData.max_x - this.props.mapData.min_x + 1;
    this.num_rows = this.props.mapData.max_y - this.props.mapData.min_y + 1;

    var max_cells_x =
        this.num_columns < Config.map.maxCellsX
          ? this.num_columns
          : Config.map.maxCellsX,
      max_cells_y =
        this.num_rows < Config.map.maxCellsY
          ? this.num_rows
          : Config.map.maxCellsY;

    //stretch cell size if the grid is very small
    this.cell_width = parseFloat(this.state.canvasWidth / max_cells_x);
    this.cell_height = parseFloat(this.state.canvasHeight / max_cells_y);

    this.props.updateMapLimits(
      max_cells_x,
      max_cells_y,
      this.num_rows,
      this.num_columns,
      this.cell_width,
      this.cell_height,
      this.state.canvasWidth,
      this.state.canvasHeight
    );
  };

  renderGrid = () => {
    this.canvasContext.clearRect(
      0,
      0,
      this.state.canvasWidth,
      this.state.canvasHeight
    );
    var highlight = false;

    for (var x = 0; x < this.num_columns; x++) {
      for (var y = 0; y < this.num_rows; y++) {
        var current_cell = {
          id: null,
          colour: "FFFFFF",
        };

        if (typeof this.props.mapData.cells[x][y] !== "undefined") {
          current_cell = this.props.mapData.cells[x][y];
        }

        //where on the map to start drawing this tile
        var lower_x = parseFloat(x * this.cell_width),
          lower_y = parseFloat(y * this.cell_height),
          //where on the map to finish drawing this tile
          upper_x = parseFloat(lower_x + this.cell_width),
          upper_y = parseFloat(lower_y + this.cell_height),
          //where in the viewport to draw the tile
          destination_x = parseFloat(lower_x - this.props.worldX),
          destination_y = parseFloat(lower_y - this.props.worldY);

        //check if this tile is within the viewport and needs to be drawn
        /*if (!((
                        (lower_x > this.props.worldX && lower_x < this.props.worldX + this.state.canvasWidth) ||
                        (upper_x > this.props.worldX && upper_x < this.props.worldX + this.state.canvasWidth)
                    ) && (
                        (lower_y > this.props.worldY && lower_y < this.props.worldY + this.state.canvasHeight) ||
                        (upper_y > this.props.worldY && upper_y < this.props.worldY + this.state.canvasHeight)
                    ))) {
                    return;
                }*/

        //only draw everything if the cell actually exists
        if (current_cell.id) {
          //draw cell
          this.canvasContext.fillStyle =
            "#" + Config.team[current_cell.team].colour;
          this.canvasContext.fillRect(
            destination_x,
            destination_y,
            this.cell_width,
            this.cell_height
          );

          //check if we've registered a new click and lock in this cell
          if (
            this.props.clickX !== false &&
            this.props.clickX >= destination_x &&
            this.props.clickX <= destination_x + this.cell_width &&
            this.props.clickY !== false &&
            this.props.clickY -
              document.getElementById("navigation").offsetHeight >=
              destination_y &&
            this.props.clickY -
              document.getElementById("navigation").offsetHeight <=
              destination_y + this.cell_height &&
            this.selected_cell.clickX !== this.props.clickX &&
            this.selected_cell.clickY !== this.props.clickY
          ) {
            this.selected_cell = {
              clickX: this.props.clickX,
              clickY: this.props.clickY,
              cell_id: current_cell.id,
            };
          }

          //if this cell was the last one clicked on, we will highlight it, even if the canvas has moved since that click
          if (current_cell.id == this.selected_cell.cell_id) {
            highlight = {
              x: destination_x,
              y: destination_y,
            };
          }

          //draw border
          this.canvasContext.strokeStyle = "#000000";
          this.canvasContext.lineWidth = 2;
          this.canvasContext.strokeRect(
            destination_x,
            destination_y,
            this.cell_width,
            this.cell_height
          );

          //draw co-ordinates
          this.canvasContext.font = "14px Work Sans";
          this.canvasContext.lineWidth = 1;
          this.canvasContext.fillStyle = "#000000";
          this.canvasContext.strokeText(
            "[" +
              (x + this.props.mapData.min_x) +
              ", " +
              (y + this.props.mapData.min_y) +
              "]",
            destination_x + 5,
            destination_y + 20
          );
        } else {
          this.canvasContext.strokeStyle = "#CCCCCC";
          this.canvasContext.lineWidth = 1;
          this.canvasContext.strokeRect(
            destination_x,
            destination_y,
            this.cell_width,
            this.cell_height
          );
        }
      }
    }

    //draw highlight last
    if (highlight) {
      this.canvasContext.strokeStyle = "#FF0000";
      this.canvasContext.lineWidth = 4;
      this.canvasContext.strokeRect(
        highlight.x,
        highlight.y,
        this.cell_width,
        this.cell_height
      );
    }
  };

  render() {
    return (
      <canvas
        id="gridMap"
        ref={this.canvasRef}
        width={this.state.canvasWidth}
        height={this.state.canvasHeight}
      />
    );
  }
}

export default MapCanvas;
