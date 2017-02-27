import "./index.html";
import paper from "paper";
import dat from "./dat.gui.min.js";

const PI = Math.PI;
const {Rectangle, Circle, Line, RegularPolygon} = paper.Path;
const {Point} = paper;

paper.setup(document.getElementById("tile-canvas"));
window.paper = paper;

const params = {
    tileSize: 100,
    hankinAngle: 30,
    hankinLength: 100,
    hankinDistance: 0.1,
    polygonSides: 4
};

const grid = {
    x: 100,
    y: 100,
    show: false,
    color: "#0f0",
    opacity: 0.5
}

const self = {
    render
};

const gui = new dat.GUI();
const sizeController = gui.add(params, "tileSize", 1, 400);
const hankinAngleController = gui.add(params, "hankinAngle", 0, 360);
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
// const showGridController = gridFolder.add(grid, "show");
const gridColorController = gridFolder.addColor(grid, "color");
const gridOpacityController = gridFolder.add(grid, "opacity", 0, 1);
gridXController.onChange(render);
gridYController.onChange(render);
// showGridController.onChange(render);
gridColorController.onChange(render);
gridOpacityController.onChange(render);


function render () {
    paper.project.clear();

    const polygons = [];
    let x = 0;
    let y = 0;
    console.log(grid.color);
    for (let i = 0; x < paper.view.bounds.width; i++) {
        polygons[i] = [];
        x = i * grid.x;
        for (let j = 0; y < paper.view.bounds.height; j++) {
            y = j * grid.y;
            polygons[i][j] = new RegularPolygon({
                center: [x, y],
                sides: Math.round(params.polygonSides),
                radius: params.tileSize,
                fillColor: grid.color,
                opacity: grid.opacity
                // strokeColor: grid.show ? "#000" : null
            });
            drawHankins(polygons[i][j].segments);
        }
        y = 0;
    }
}

render();

/*
 * @param p1 {Point} - Surface point 1.
 * @param p2 {Point} - Surface point 2.
 * @param theta - Angle (degrees) of rays.
 */
function drawHankin (p1, p2, theta) {
    const dir = p2.subtract(p1).divide(2);
    const root = p1.add(dir);
    const norm = dir.normalize();
    const l1 = paper.Path.Line({
        from: root,
        to: root.subtract(perpendicular(norm.multiply(params.hankinLength))),
        strokeColor: "#000"
    });
    const l2 = paper.Path.Line({
        from: root,
        to: root.subtract(perpendicular(norm.multiply(params.hankinLength))),
        strokeColor: "#000"
    });
    const dist = p2.getDistance(p1) / 2;
    l1.rotate(theta, root);
    l2.rotate(-theta, root);
    l1.translate(norm.multiply(dist * params.hankinDistance));
    l2.translate(norm.multiply(dist * -params.hankinDistance));
}

function drawHankins (segments) {
    for (let i = 0; i < segments.length; i++) {
        drawHankin(segments[i].point, segments[(i + 1) % segments.length].point, params.hankinAngle);
    }
}

function perpendicular (point) {
    return new Point(point.y, -point.x);
}
