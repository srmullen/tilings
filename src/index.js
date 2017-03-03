import "./index.html";
import paper from "paper";
import dat from "./dat.gui.min.js";
import Tone from "tone";

import Polygon from "./Polygon";

window.Tone = Tone;

const PI = Math.PI;
const {Rectangle, Circle, Line} = paper.Path;
const {Point} = paper;

paper.setup(document.getElementById("tile-canvas"));
window.paper = paper;

const params = {
    tileSize: 100,
    hankinAngle: 90,
    hankinLength: 100,
    hankinDistance: 0.1,
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
const sizeController = gui.add(params, "tileSize", 1, 400);
const hankinAngleController = gui.add(params, "hankinAngle", 90, 270);
const hankinLengthController = gui.add(params, "hankinLength", 0, 500);
const hankinDistanceController = gui.add(params, "hankinDistance", 0, 1);
const polygonSidesController = gui.add(params, "polygonSides", 3, 30);
sizeController.onChange(render);
hankinAngleController.onChange(render);
hankinLengthController.onChange(render);
hankinDistanceController.onChange(render);
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


// function render () {
//     paper.project.clear();
//
//     const polygons = [];
//     let x = 0;
//     let y = 0;
//     for (let i = 0; x < paper.view.bounds.width; i++) {
//         polygons[i] = [];
//         x = i * grid.x;
//         for (let j = 0; y < paper.view.bounds.height; j++) {
//             y = j * grid.y;
//             const polygon = new Polygon({
//                 center: [x, y],
//                 sides: Math.round(params.polygonSides),
//                 radius: params.tileSize,
//                 fillColor: grid.color,
//                 opacity: grid.opacity
//             });
//             polygon.draw(params.hankinAngle, params.hankinDistance, params.hankinLength);
//             polygons[i][j] = polygon;
//         }
//         y = 0;
//     }
// }

function render () {
    paper.project.clear();
    const polygon = new Polygon({
        center: [paper.view.bounds.width/2, paper.view.bounds.height/2],
        sides: Math.round(params.polygonSides),
        radius: params.tileSize,
        fillColor: grid.color,
        opacity: grid.opacity
    });
    polygon.draw(params.hankinAngle, params.hankinDistance, params.hankinLength);
}

render();
