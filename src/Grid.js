import paper from "paper";
import Polygon from "./Polygon";

function Grid () {

}

Grid.draw = function () {
    // const square = new Polygon({
    //     sides: 4,
    //     center: [300, 200],
    //     radius: 20
    // });
    // const pentagon = new Polygon({
    //     sides: 5,
    //     center: [200, 300],
    //     radius: 20
    // });

    // drawPoints(square);
    // drawPoints(pentagon);

    const square = createPolygon(4, new paper.Point(300, 200), new paper.Point(380, 150));
    square.map(drawPoint);
    const pentagon = attach(5, square, 3);
    pentagon.map(drawPoint);
    // const septagon = createPolygon(7, new paper.Point(300, 200), new paper.Point(380, 150));
    // septagon.map(drawPoint);

    // square.attach(0, pentagon);
}

function drawPoint (point) {
    return new paper.Path.Circle({
        center: point,
        radius: 4,
        fillColor: "red"
    });
}

/*
 * @param type {Number} - Number of sides of polygon to attach.
 * @param polygon {Point[]} - Polygon to attach to.
 * @param face {Number} - Polygon side to attach to.
 * @return Point[] - The new polygon.
 */
function attach (type, polygon, face) {
    const p1 = polygon[face];
    const p2 = polygon[(face+1) % polygon.length];
    return createPolygon(type, p2, p1);
}

/*
 * @param sides - Number (greater than 2) of sides the polygon will have.
 * @param p1 - first point the polygon will contain.
 * @param p2 - second point the polygon will contain
 * @return Point[]
 */
function createPolygon (sides, p1, p2) {
    // Polygon angle sum theorem.
    // If a polygon is convex, then the sum of the degree measures of the exterior angles, one at each vertex, is 360°.
    const length = p1.getDistance(p2);
    const vec = p2.subtract(p1).normalize();
    const degreeStep = 360 / sides;
    const points = [p1, p2];
    for (let i = 2; i < sides; i++) {
        const previous = points[i-1];
        const point = previous.add(vec.multiply(length)).rotate(degreeStep * (i-1), previous);
        points.push(point);
    }
    return points;
}

export default Grid;
