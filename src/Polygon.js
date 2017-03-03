import paper from "paper";
import {flatten, minBy, sortBy} from "lodash";

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

function calculateHankins (p1, p2, theta, delta) {
    const dir = p2.subtract(p1).divide(2);
    const root = p1.add(dir);
    const norm = dir.normalize();
    const dist = p2.getDistance(p1) / 2;
    const vec = perpendicular(dir);
    const h1root = root.subtract(norm.multiply(dist * delta));
    const h2root = root.add(norm.multiply(dist * delta));
    const h1vec = vec.clone().rotate(theta).normalize();
    const h2vec = vec.clone().rotate(-theta).normalize();

    return [{root: h1root, vec: h1vec}, {root: h2root, vec: h2vec}];
};

function drawHankins (segments, hankinAngle, hankinLength, hankinDistance) {
    const hankins = [];
    for (let i = 0; i < segments.length; i++) {
        // drawHankin(segments[i].point, segments[(i + 1) % segments.length].point, hankinAngle, hankinLength, hankinDistance);
        hankins[i] = calculateHankins(segments[i].point, segments[(i + 1) % segments.length].point, hankinAngle, hankinDistance);
        calculateLengths(hankins);
    }

}

function calculateLengths (hankins) {
    const length = paper.view.bounds.width;
    const paths = hankins.map(([h1, h2]) => {
        const p1 = paper.Path.Line({
            from: h1.root,
            to: h1.root.add(h1.vec.multiply(length)),
            // strokeColor: "#000"
            opacity: 0
        });
        const p2 = paper.Path.Line({
            from: h2.root,
            to: h2.root.add(h2.vec.multiply(length)),
            // strokeColor: "#000"
            opacity: 0
        });
        return [p1, p2];
    });

    for (let i = 0; i < paths.length; i++) {
        const [p1, p2] = paths[i];
        const others = flatten([...paths.slice(0, i), ...paths.slice(i+1)]);
        // const l1 = [];
        // const l2 = [];
        const pairs = [];
        const lengths = others.map(path => {
            const i1 = p1.getIntersections(path)[0];
            const i2 = p2.getIntersections(path)[0];
            if (i1) {
                const pathCost = path.segments[0].point.getDistance(i1.point);
                const cost = p1.segments[0].point.getDistance(i1.point) + pathCost;
                // new paper.Path.Circle({
                //     center: i1.point,
                //     fillColor: "#f00",
                //     radius: 4
                // });
                // l1.push({hankins: [p1, path], intersection: i1, cost});
                pairs.push({hankins: [p1, path], intersection: i1, cost});
            }

            if (i2) {
                const pathCost = path.segments[0].point.getDistance(i2.point);
                const cost = p2.segments[0].point.getDistance(i2.point) + pathCost;
                // new paper.Path.Circle({
                //     center: i2.point,
                //     fillColor: "#0f0",
                //     radius: 4
                // });
                // l2.push({intersection: i2, length});
                pairs.push({hankins: [p2, path], intersection: i2, cost});
            }
        });

        const sorted = sortBy(pairs, "cost");

        // const length1 = minBy(l1, ({length}={}) => length);
        // const length2 = minBy(l2, ({length}={}) => length);


        // draw the lines
        for (let i = 0; i < pairs.length; i++) {
            const [h1, h2] = pairs[i].hankins;
            // FIXME: Currently drawing every pair
            // if (!h1.used && !h2.used) {
                paper.Path.Line({
                    from: h1.segments[0].point,
                    to: pairs[i].intersection.point,
                    strokeColor: "#000"
                });
                paper.Path.Line({
                    from: h2.segments[0].point,
                    to: pairs[i].intersection.point,
                    strokeColor: "#000"
                });
                h1.used = true;
                h2.used = true;
            // }
        }
        // console.log(flatten(paths).map(p => p.used));
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
