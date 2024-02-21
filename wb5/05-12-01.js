let canvas = document.getElementById("canvas1");
if (!(canvas instanceof HTMLCanvasElement))
    throw new Error("Canvas is not an HTML Element");
let context = canvas.getContext("2d");

function calculateControlPoints(points) {
    const controlPoints = [];
    const n = points.length;

    for (let i = 0; i < n; i++) {
        const p0 = points[i > 0 ? i - 1 : n - 1];
        const p1 = points[i];
        const p2 = points[(i + 1) % n];
        const p3 = points[(i + 2) % n];

        const c1 = [
            p1[0] + (p2[0] - p0[0]) / 6,
            p1[1] + (p2[1] - p0[1]) / 6,
        ];
        const c2 = [
            p2[0] - (p3[0] - p1[0]) / 6,
            p2[1] - (p3[1] - p1[1]) / 6,
        ];

        controlPoints.push({ start: p1, c1, c2, end: p2 });
    }

    return controlPoints;
}

const points = [
    [50, 150], [350, 150], [350, 50], [200, 100], [50, 50]
];

const controlPoints = calculateControlPoints(points);

function drawBezierCurve() {
    context.beginPath();
    controlPoints.forEach(cp => {
        context.moveTo(cp.start[0], cp.start[1]);
        context.bezierCurveTo(cp.c1[0], cp.c1[1], cp.c2[0], cp.c2[1], cp.end[0], cp.end[1]);
    });
    context.lineWidth = 3;
    context.stroke();
}

function drawPoint(x, y) {
    context.fillStyle = 'red';
    context.beginPath();
    context.arc(x, y, 3, 0, 2 * Math.PI);
    context.fill();
}

function interpolateBezier(cp, t) {
    const x = Math.pow(1 - t, 3) * cp.start[0] + 3 * Math.pow(1 - t, 2) * t * cp.c1[0] + 3 * (1 - t) * Math.pow(t, 2) * cp.c2[0] + Math.pow(t, 3) * cp.end[0];
    const y = Math.pow(1 - t, 3) * cp.start[1] + 3 * Math.pow(1 - t, 2) * t * cp.c1[1] + 3 * (1 - t) * Math.pow(t, 2) * cp.c2[1] + Math.pow(t, 3) * cp.end[1];
    return [x, y];
}

function sampleAndDrawPoints() {
    const numSamples = 21;
    let tIncrement = 1 / (numSamples - 1);

    for (let i = 0; i < numSamples; i++) {
        let t = i * tIncrement;
        let segmentIndex = Math.floor(t * controlPoints.length);
        let segmentT = (t * controlPoints.length) % 1;

        if (i === numSamples - 1) {
            segmentIndex = controlPoints.length - 1;
            segmentT = 1;
        }

        let cp = controlPoints[segmentIndex];
        let point = interpolateBezier(cp, segmentT);
        drawPoint(point[0], point[1]);
    }
}

drawBezierCurve();
sampleAndDrawPoints();
