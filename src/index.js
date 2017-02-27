import "./index.html";
import paper from "paper";
import dat from "./dat.gui.min.js";

const PI = Math.PI;
const {Rectangle, Circle, Line, RegularPolygon} = paper.Path;
const {Point} = paper;

paper.setup(document.getElementById("tile-canvas"));

const params = {
    tileSize: 200,
    hankinAngle: 30,
    hankinDistance: 0.1
};

const self = {
    render
};

const gui = new dat.GUI();
const sizeController = gui.add(params, "tileSize", 1, 400);
const hankinAngleController = gui.add(params, "hankinAngle", 0, 360);
const hankinDistanceController = gui.add(params, "hankinDistance", 0, 1);
sizeController.onChange(render);
hankinAngleController.onChange(render);
hankinDistanceController.onChange(render);
gui.add(self, "render");

function render () {
    paper.project.clear();

    const octagon = new RegularPolygon({
        center: paper.view.center,
        sides: 8,
        radius: params.tileSize,
        strokeColor: "#000"
    });

    // const tile1 = new Rectangle({
    //     strokeColor: "#000",
    //     center: paper.view.center,
    //     size: [params.tileSize, params.tileSize]
    // });

    drawHankins(octagon.segments);
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
        to: root.subtract(perpendicular(norm.multiply(100))),
        strokeColor: "#000"
    });
    const l2 = paper.Path.Line({
        from: root,
        to: root.subtract(perpendicular(norm.multiply(100))),
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

function drawCircle (center) {
    new Circle({
        center,
        radius: 4,
        fillColor: "#f00"
    });
}

function perpendicular (point) {
    return new Point(point.y, -point.x);
}
