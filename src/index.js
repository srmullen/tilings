import paper from "paper";
import dat from "./dat.gui.min.js";
import Tone from "tone";

import Polygon from "./Polygon";
import Grid from "./Grid";

if (process.env.NODE_ENV !== 'production') {
    require("./index.html");
}

window.Tone = Tone;

const PI = Math.PI;
const {Rectangle, Circle, Line} = paper.Path;
const {Point} = paper;

paper.setup(document.getElementById("tile-canvas"));
window.paper = paper;

const params = {
    radius: 100,
    theta: 90,
    length: 100,
    inferLength: false,
    delta: 0.1,
    polygonSides: 4
};

const grid = {
    x: 100,
    y: 100,
    show: false,
    color: "#0f0",
    opacity: 0.1
}

const self = {
    render
};

const gui = new dat.GUI();
const sizeController = gui.add(params, "radius", 1, 400);
const hankinAngleController = gui.add(params, "theta", 90, 270);
const hankinDistanceController = gui.add(params, "delta", 0, 1);
const hankinLengthController = gui.add(params, "length", 0, 500);
const inferLengthController = gui.add(params, "inferLength");
const polygonSidesController = gui.add(params, "polygonSides", 3, 30);
sizeController.onChange(render);
hankinAngleController.onChange(render);
hankinDistanceController.onChange(render);
hankinLengthController.onChange(render);
inferLengthController.onChange(render);
polygonSidesController.onChange(render);

const gridFolder = gui.addFolder("Grid");
const gridXController = gridFolder.add(grid, "x", 5, 500);
const gridYController = gridFolder.add(grid, "y", 5, 500);
const gridColorController = gridFolder.addColor(grid, "color");
const gridOpacityController = gridFolder.add(grid, "opacity", 0, 1);
gridXController.onChange(render);
gridYController.onChange(render);
gridColorController.onChange(render);
gridOpacityController.onChange(render);


function render () {
    paper.project.clear();

    const polygons = [];
    let x = 0;
    let y = 0;
    const length = !params.inferLength ? params.length : undefined;
    console.log(length);
    for (let i = 0; x < paper.view.bounds.width; i++) {
        polygons[i] = [];
        x = i * grid.x;
        for (let j = 0; y < paper.view.bounds.height; j++) {
            y = j * grid.y;
            const polygon = new Polygon({
                center: [x, y],
                sides: Math.round(params.polygonSides),
                radius: params.radius,
                fillColor: grid.color,
                opacity: grid.opacity
            });
            polygon.draw(params.theta, params.delta, length);
            polygons[i][j] = polygon;
        }
        y = 0;
    }
}

// function render () {
//     paper.project.clear();
//     const polygon = new Polygon({
//         center: [paper.view.bounds.width/2, paper.view.bounds.height/2],
//         sides: Math.round(params.polygonSides),
//         radius: params.tileSize,
//         fillColor: grid.color,
//         opacity: grid.opacity
//     });
//     polygon.draw(params.hankinAngle, params.hankinDistance, params.hankinLength);
// }

render();
// Grid.draw()
