import makerjs from "makerjs";

const {Line, Circle} = makerjs.paths;
const {moveRelative, combineUnion, combineIntersection, combineSubtraction, zero} = makerjs.model;
const {modelExtents} = makerjs.measure;
const {Rectangle} = makerjs.models;

function ArcTangle(width, height, radius) {
    const circle1 = new Circle([0, 0], radius);
    const circle2 = new Circle([0, 0], radius - height);

    const line1 = new Line([0, 0], [width / 2, radius + 1]);
    const line2 = new Line([0, 0], [-width / 2, radius + 1]);
    const line3 = new Line([width / 2, radius + 1], [-width / 2, radius + 1]);

    const model1 = {paths: {circle1, circle2}};
    const model2 = {paths: {line1, line2, line3}};

    const {models, paths} = combineIntersection(model1, model2)

    this.models = models;
    this.paths = paths;

    zero(this);
}

function Hole(holeDiameter, length) {
    const circle = new Circle([0, 0], holeDiameter / 2);
    const rectangle = new Rectangle(holeDiameter, length / 2);

    const m = {paths: {circle}}
    moveRelative(rectangle, [-holeDiameter / 2, -length / 2])
    const {models, paths} = combineUnion(m, rectangle);

    this.paths = paths;
    this.models = models;
}

function FrameHanger(slopeDiameter, holeDiameter, width, length) {
    const holeGape = holeDiameter * 5 / 6;
    const gape = 10;
    const smallSheetWidth = (width - 2 * holeGape) / 2;
    const mainSheet = new ArcTangle(width, length, slopeDiameter / 2);
    const smallSheetLeft = new ArcTangle(smallSheetWidth, length, slopeDiameter / 2);
    const smallSheetRight = new ArcTangle(smallSheetWidth, length, slopeDiameter / 2);
    const hole = new Hole(holeDiameter, length);

    const measure = modelExtents(mainSheet);
    moveRelative(smallSheetLeft, [0, -(length + gape)]);
    moveRelative(smallSheetRight, [width - smallSheetWidth, -(length + gape)]);
    moveRelative(hole, [measure.width / 2, measure.height - holeDiameter / 2 - length / 2]);

    const sheet = combineSubtraction(mainSheet, hole);
    this.models = {
        sheet,
        smallSheetLeft,
        smallSheetRight,
    };
}

FrameHanger.metaParameters = [
    {title: "diameter of slope", type: "range", min: 250, max: 340, value: 286},
    {title: "diameter of hole", type: "range", min: 3, max: 10, value: 6},
    {title: "width", type: "range", min: 20, max: 200, value: 40},
    {title: "length", type: "range", min: 5, max: 20, value: 10},
];

export default FrameHanger;
