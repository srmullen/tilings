import "./index.html";
import paper from "paper";
import dat from "./dat.gui.min.js";

const PI = Math.PI;
const {Rectangle, Circle, Line} = paper.Path;
const {Point} = paper;

paper.setup(document.getElementById("tile-canvas"));

const params = {
    tileSize: 100,
    hankinAngle: 30
};

const self = {
    render
};

const gui = new dat.GUI();
const sizeController = gui.add(params, "tileSize", 1, 200);
const hankinAngleController = gui.add(params, "hankinAngle", 0, 360);
sizeController.onChange(render);
hankinAngleController.onChange(render);
gui.add(self, "render");

function render () {
    paper.project.clear();
    const tile1 = new Rectangle({
        strokeColor: "#000",
        center: paper.view.center,
        size: [params.tileSize, params.tileSize]
    });

    drawHankin(tile1.bounds.topLeft, tile1.bounds.topRight, params.hankinAngle);
    drawHankin(tile1.bounds.topRight, tile1.bounds.bottomRight, params.hankinAngle);
    drawHankin(tile1.bounds.bottomRight, tile1.bounds.bottomLeft, params.hankinAngle);
    drawHankin(tile1.bounds.bottomLeft, tile1.bounds.topLeft, params.hankinAngle);
}

render();

// const tile2 = Rectangle({
//     strokeColor: "#000",
//     point: [40, 40],
//     size: [100, 100]
// });

/*
 * @param p1 {Point} - Surface point 1.
 * @param p2 {Point} - Surface point 2.
 * @param theta - Angle (degrees) of rays.
 */
function drawHankin (p1, p2, theta) {
    const dist = p2.subtract(p1);
    const root = p1.add(dist.divide(2));
    const norm = dist.normalize().multiply(100);
    const l1 = paper.Path.Line({
        from: root,
        to: root.subtract(perpendicular(norm)),
        strokeColor: "#000"
    });
    const l2 = paper.Path.Line({
        from: root,
        to: root.subtract(perpendicular(norm)),
        strokeColor: "#000"
    });
    l1.rotate(theta, root);
    l2.rotate(-theta, root);
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
