import makerjs from "makerjs";

const {Line, Circle} = makerjs.paths;
const {intersection} = makerjs.path;
const {moveRelative, combineUnion, combineIntersection, combineSubtraction, zero} = makerjs.model;
const {modelExtents} = makerjs.measure;
const {Rectangle} = makerjs.models;

function ArcTangle(width, height, radius, subtractionWidth = 0) {
  const circle1 = new Circle([0, 0], radius);
  const circle2 = new Circle([0, 0], radius - height);

  const getIntersectionPoint = (y) => {
    const line = new Line([y, 0], [y, radius]);
    const {intersectionPoints: [intersectionPoint]} = intersection(circle1, line);
    return intersectionPoint;
  };

  const makeShapeForCombine = (p1, p2) => {
    const point1 = getIntersectionPoint(p1);
    const point2 = getIntersectionPoint(p2);
    const line1 = new Line([0, 0], point1);
    const line2 = new Line([0, 0], point2);
    const point3 = [point1[0], 2 * radius]
    const point4 = [point2[0], 2 * radius]
    const line3 = new Line(point1, point3);
    const line4 = new Line(point2, point4);
    const line5 = new Line(point3, point4);
    return {paths: {line1, line2, line3, line4, line5}};
  };


  const model1 = {paths: {circle1, circle2}};
  const model2 = makeShapeForCombine(-width / 2, width / 2);

  const model = combineIntersection(model1, model2)

  this.models = model.models;
  this.paths = model.paths;

  if (subtractionWidth && width > subtractionWidth) {
    const model3 = makeShapeForCombine(-subtractionWidth / 2, subtractionWidth / 2);
    const {models, paths} = combineSubtraction(model, model3);
    this.models = models;
    this.paths = paths;
  }

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
  const gape = Math.ceil((width + length) / (slopeDiameter / 15));
  const subtractionWidth = holeDiameter + 2 * holeGape;
  const mainSheet = new ArcTangle(width, length, slopeDiameter / 2);
  const parts = new ArcTangle(width, length, slopeDiameter / 2, subtractionWidth);
  const hole = new Hole(holeDiameter, length);

  const measure = modelExtents(mainSheet);
  moveRelative(parts, [0, -(length + gape)]);
  moveRelative(hole, [measure.width / 2, measure.height - holeDiameter / 2 - length / 2]);

  const sheet = combineSubtraction(mainSheet, hole);
  this.models = {
    sheet,
    parts,
  };

  if (subtractionWidth > width) {
    delete this.models.parts;
  }
}

FrameHanger.metaParameters = [
  {title: "diameter of slope", type: "range", min: 250, max: 340, value: 286},
  {title: "diameter of hole", type: "range", min: 3, max: 10, value: 6},
  {title: "width", type: "range", min: 20, max: 200, value: 40},
  {title: "length", type: "range", min: 5, max: 20, value: 10},
];

export default FrameHanger;
