import React, { Component } from 'react';
import MapCanvas from './MapCanvas';

class Map extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loaded: false,
            unprocessedMapData: null,
            processedMapData: [],
            clickX: false,
            clickY: false,
            worldX: 0,
            worldY: 0
        }

        this.movement = {
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
            mouseMoveY: 0
        }

        this.limits = {
            max_cells_x: 0,
            max_cells_y: 0,
            num_rows: 0,
            num_columns: 0,
            cell_width: 0,
            cell_height: 0,
            screen_width: 0,
            screen_height: 0
        }

        this.timeout = null;
    }

    componentDidMount = () => {
        // this.props.toggleFooter(false);
        this.loadmapData();

        document.addEventListener('keydown', this.handleKeyDown);
        document.addEventListener('keyup', this.handleKeyUp);
        document.addEventListener('mousedown', this.handleMouseDown);
        document.addEventListener('mousemove', this.handleDrag);
        document.addEventListener('mouseup', this.handleMouseUp);

        this.updateMovement();
    }

    componentWillUnmount = () => {
        document.removeEventListener('keydown', this.handleKeyDown);
        document.removeEventListener('keyup', this.handleKeyUp);
        document.removeEventListener('mousedown', this.handleMouseDown);
        document.removeEventListener('mousemove', this.handleDrag);
        document.removeEventListener('mouseup', this.handleMouseUp);

        clearTimeout(this.timeout);

        this.props.toggleFooter(true);
    }

    async loadmapData() {
        fetch(process.env.REACT_APP_BACKEND_URL + "/map/get/")
            .then((response) => {
                return response.json();
            })
            .then((json) => {
                if (json.status !== "OK") {
                    console.log(json.status + ': ', json.output);
                    return;
                }

                if (json.output.total_cells == 0) {
                    console.log('Map is empty');
                    return;
                }

                json.output.min_x = parseInt(json.output.min_x);
                json.output.max_x = parseInt(json.output.max_x);
                json.output.min_y = parseInt(json.output.min_y);
                json.output.max_y = parseInt(json.output.max_y);

                console.log("Loaded map data", json.output);

                this.setState({
                    processedMapData: json.output,
                    loaded: true
                });
            })
            .catch((exception) => {
                console.log('Map parsing failed', exception);
            });
    }

    handleKeyDown = (event) => {
        if (event.keyCode === 38) { //up
            this.movement.up = true;
        }

        if (event.keyCode === 40) { //down
            this.movement.down = true;
        }

        if (event.keyCode === 37) { //left
            this.movement.left = true;
        }

        if (event.keyCode === 39) { //right
            this.movement.right = true;
        }
    }

    handleKeyUp = (event) => {
        if (event.keyCode === 38) { //up
            this.movement.up = false;
        }

        if (event.keyCode === 40) { //down
            this.movement.down = false;
        }

        if (event.keyCode === 37) { //left
            this.movement.left = false;
        }

        if (event.keyCode === 39) { //right
            this.movement.right = false;
        }
    }

    handleMouseDown = (event) => {
        event.preventDefault();

        this.movement.mouseDrag = true;
        this.movement.mouseClick = true;
        this.movement.mouseLastX = event.clientX;
        this.movement.mouseLastY = event.clientY;
    }

    handleMouseUp = (event) => {
        event.preventDefault();

        if (this.movement.mouseClick) {
            this.setState({
                clickX: event.clientX,
                clickY: event.clientY
            });
        }

        this.movement.mouseClick = false;
        this.movement.mouseDrag = false;
    }

    handleDrag = (event) => {
        event.preventDefault();
        if (this.movement.mouseDrag) {
            //don't fire click events for mouse drags
            this.movement.mouseClick = false;

            this.movement.mouseMoveX = Math.round((this.movement.mouseLastX - event.clientX) * 4);
            this.movement.mouseMoveY = Math.round((this.movement.mouseLastY - event.clientY) * 4);
            this.movement.mouseLastX = event.clientX;
            this.movement.mouseLastY = event.clientY;
        }
    }

    updateMapLimits = (max_cells_x, max_cells_y, num_rows, num_columns, cell_width, cell_height, screen_width, screen_height) => {
        this.limits = {
            max_cells_x: max_cells_x,
            max_cells_y: max_cells_y,
            num_rows: num_rows,
            num_columns: num_columns,
            cell_width: cell_width,
            cell_height: cell_height,
            screen_width: screen_width,
            screen_height: screen_height
        }

        console.log("Map limits changed");
        console.log(this.limits);
    }

    updateMovement = () => {
        if (!this.state.loaded || !this.limits.max_cells_x || !this.limits.screen_height) {
            this.timeout = setTimeout(() => {
                this.updateMovement();
            }, this.movement.updateTime);
            return;
        }

        var speed = 15,
            x_movement = this.movement.mouseMoveX,
            y_movement = this.movement.mouseMoveY,
            x_position = this.state.worldX,
            y_position = this.state.worldY;

        if (this.movement.up) {
            y_movement -= speed;
        }

        if (this.movement.down) {
            y_movement += speed;
        }

        if (this.movement.left) {
            x_movement -= speed;
        }

        if (this.movement.right) {
            x_movement += speed;
        }

        x_position += x_movement;

        //bound lower x camera position
        if (x_position <= 0) {
            x_position = 0;
        }

        //bound upper x camera position
        var x_upper_bound = (this.limits.num_columns * this.limits.cell_width) - this.limits.screen_width;
        if (x_position >= x_upper_bound) {
            x_position = x_upper_bound;
        }

        y_position += y_movement;

        //bound lower y camera position
        if (y_position <= 0) {
            y_position = 0;
        }

        //bound upper y camera position
        var y_upper_bound = (this.limits.num_rows * this.limits.cell_height) - this.limits.screen_height;
        if (y_position >= y_upper_bound) {
            y_position = y_upper_bound;
        }

        if (x_position !== this.state.worldX || y_position !== this.state.worldY) {
            this.setState({
                worldX: x_position,
                worldY: y_position,
            });
        }

        this.movement.mouseMoveX = 0;
        this.movement.mouseMoveY = 0;

        this.timeout = setTimeout(() => {
            this.updateMovement();
        }, this.movement.updateTime);
    }

    render() {
        var renderData = null;
        if (this.state.loaded) {
            renderData = <div id="canvas_container">
                <MapCanvas worldX={this.state.worldX} worldY={this.state.worldY} clickX={this.state.clickX} clickY={this.state.clickY} updateMapLimits={this.updateMapLimits} mapData={this.state.processedMapData} />
            </div>;
        }

        return (
            renderData
        );
    }
}

export default Map;