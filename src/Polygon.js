import paper from "paper";

function Polygon (params) {
    this.params = params;
}

Polygon.prototype.draw = function (theta, delta, length) {
    this.drawShape();
    drawHankins(this.shape.segments, theta, length, delta);
};

Polygon.prototype.drawShape = function () {
    this.shape = new paper.Path.RegularPolygon(this.params);
};

Polygon.prototype.hankin = function (p1, p2) {

};

function drawHankins (segments, hankinAngle, hankinLength, hankinDistance) {
    for (let i = 0; i < segments.length; i++) {
        drawHankin(segments[i].point, segments[(i + 1) % segments.length].point, hankinAngle, hankinLength, hankinDistance);
    }
}

/*
 * @param p1 {Point} - Surface point 1.
 * @param p2 {Point} - Surface point 2.
 * @param theta - Angle (degrees) of rays.
 */
function drawHankin (p1, p2, theta, hankinLength, hankinDistance) {
    const dir = p2.subtract(p1).divide(2);
    const root = p1.add(dir);
    const norm = dir.normalize();
    const to = perpendicular(norm.multiply(hankinLength));
    const l1 = paper.Path.Line({
        from: root,
        to: root.subtract(to),
        strokeColor: "#000"
    });
    const l2 = paper.Path.Line({
        from: root,
        to: root.subtract(to),
        strokeColor: "#000"
    });
    const dist = p2.getDistance(p1) / 2;
    l1.rotate(theta, root);
    l2.rotate(-theta, root);
    l1.translate(norm.multiply(dist * hankinDistance));
    l2.translate(norm.multiply(dist * -hankinDistance));
}


function perpendicular (point) {
    return new paper.Point(point.y, -point.x);
}

export default Polygon;
