import paper from "paper";
import queryString from "query-string";
import dat from "./dat.gui.min.js";
import Tone from "tone";

import Polygon from "./Polygon";
import Grid from "./Grid";

if (process.env.NODE_ENV !== 'production') {
    require("./index.html");
}

window.Tone = Tone;
window.paper = paper;

const PI = Math.PI;
const {Rectangle, Circle, Line} = paper.Path;
const {Point} = paper;

paper.setup(document.getElementById("tile-canvas"));

const INFER_LENGTH = "inferLength";

const params = getParams();

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

function getParams () {
    const defaults = {
        radius: 100,
        theta: 90,
        length: 100,
        [INFER_LENGTH]: false,
        delta: 0.1,
        polygonSides: 4
    };

    if (window.location.search) {
        const queryParams = window.location.search.slice(1).split("&").reduce((acc, s) => {
            return Object.assign({}, acc, parseParam(s));
        }, {});

        return Object.assign({}, defaults, queryParams);
    } else {
        return defaults;
    }
}

function parseParam (s) {
    const [key, val] = s.split("=");
    let v;
    if (key === INFER_LENGTH) {
        v = val === "true";
    } else {
        v = parseFloat(val);
    }
    return {[key]: v};
}

function createGUIControls () {
    const gui = new dat.GUI();
    const sizeController = gui.add(params, "radius", 1, 400);
    const hankinAngleController = gui.add(params, "theta", 90, 270);
    const hankinDistanceController = gui.add(params, "delta", 0, 1);
    const hankinLengthController = gui.add(params, "length", 0, 500);
    const inferLengthController = gui.add(params, INFER_LENGTH);
    const polygonSidesController = gui.add(params, "polygonSides", 3, 30);
    sizeController.onChange(paramChange);
    hankinAngleController.onChange(paramChange);
    hankinDistanceController.onChange(paramChange);
    hankinLengthController.onChange(paramChange);
    inferLengthController.onChange(paramChange);
    polygonSidesController.onChange(paramChange);

    const gridFolder = gui.addFolder("Grid");
    const gridXController = gridFolder.add(grid, "x", 5, 500);
    const gridYController = gridFolder.add(grid, "y", 5, 500);
    const gridColorController = gridFolder.addColor(grid, "color");
    const gridOpacityController = gridFolder.add(grid, "opacity", 0, 1);
    gridXController.onChange(paramChange);
    gridYController.onChange(paramChange);
    gridColorController.onChange(paramChange);
    gridOpacityController.onChange(paramChange);
}

function paramChange () {
    history.replaceState(null, null, "?" + queryString.stringify(params));
    render();
};

function render () {
    paper.project.clear();

    const polygons = [];
    let x = 0;
    let y = 0;
    const length = !params.inferLength ? params.length : undefined;
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
createGUIControls();
// Grid.draw()
