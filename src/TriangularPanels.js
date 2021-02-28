import makerjs from "makerjs";

const {Line, Circle} = makerjs.paths;
const {expand} = makerjs.path;
const {Star, Polygon} = makerjs.models;
const {move, expandPaths, clone, rotate, moveRelative} = makerjs.model;
const {cloneToBrick} = makerjs.layout;
const {modelExtents} = makerjs.measure;


function Triangle(point1, point2, point3) {
  const line1 = new Line(point1, point2);
  const line2 = new Line(point2, point3);
  const line3 = new Line(point3, point1);

  this.paths = { line1, line2, line3 };
}

function OffsetTriangle(points, center, distance) {
  const offsets = calculateTriangleOffsets(points, center, distance);
  this.models = {};
  offsets.forEach((offset,i) => {
    this.models[`triangle_${i}`] = new Triangle(...offset);
  });
}

function calculateTriangleOffsets(points, center, distance) {
  const tan15 = Math.tan(15 * Math.PI / 180);
  const tan30 = Math.tan(30 * Math.PI / 180);
  const sin60 = Math.sin(60 * Math.PI / 180);
  const a = distance / (Math.sqrt(2) * tan15);
  const [top, left, right] = points;
  const offset = distance / tan15;

  const triangle1 = [
    [center[0], center[1] - distance / sin60],
    [left[0] + offset, left[1] + distance],
    [right[0] - offset, right[1] + distance],
  ];

  const triangle2 = [
    [center[0] - distance, center[1] + distance * tan30],
    [top[0] - distance, top[1] - offset],
    [left[0] + a, left[1] + a],
  ];

  const triangle3 = [
    [center[0] + distance, center[1] + distance * tan30],
    [right[0] - a, right[1] + a],
    [top[0] + distance, top[1] - offset],
  ];

  return [triangle1, triangle2, triangle3];
}

function getTriangularPoints(radius) {
  const polygon = new Polygon(3, radius, 90);
  const points = Object.values(polygon.paths).map(shapeLine => [...shapeLine.origin]);
  const center = [0, 0];
  const measure = modelExtents(polygon)

  return { points, center, measure };
}

function makeOffsetTrianglePanels(radius, points, center, measure, xCount, yCount, minDistance, maxDistance) {
  const top = measure.height;
  const left = measure.width / 2;
  const distance = maxDistance - minDistance;
  const distanceStep = distance / yCount;
  // const model2 = moveRelative(rotate(clone(model), 180, [0, model.radius]), [0, -measure.height]);
  // const model1 = model;

  const models = {};

  for (let i = 0; i < yCount; i++) {
    const delta = i % 2 ? -1 : 0;
    for (let j = delta; j < xCount + delta; j++) {
      let m = new OffsetTriangle(points, center, minDistance + i * distanceStep);
      if (j % 2) {
        m = rotate(m, 180, [0, radius]);
        moveRelative(m, [0, -measure.height]);
      }
      // const m = clone(j % 2 ? model2 : model1);
      // m.models.triangular = expandPaths(m.models.triangular, maxExpand - i * expandStep, 1);
      // delete m.models.polygon;
      // delete m.models.triangular.models.straightcaps
      // delete m.models.triangular.models.expansions.models.ShapeLine1.paths.ShapeLine1_Bottom;
      // delete m.models.triangular.models.expansions.models.ShapeLine2.paths.ShapeLine2_Bottom;
      // delete m.models.triangular.models.expansions.models.ShapeLine3.paths.ShapeLine3_Bottom;
      moveRelative(m, [(i % 2 ? left : 0) + j * left, i * top]);
      models[`model_${i}_${j}`] = m;
    }
  }

  return models;
}

function TriangularPanels(radius, xCount, yCount, minDistance, maxDistance) {
  const {points, center, measure} = getTriangularPoints(radius);

  this.models = makeOffsetTrianglePanels(radius, points, center, measure, xCount, yCount, minDistance, maxDistance)
}

TriangularPanels.metaParameters = [
  { title: "radius", type: "range", min: 1, max: 20, value: 10 },
  { title: "X Count", type: "range", min: 1, max: 20, value: 8 },
  { title: "Y Count", type: "range", min: 1, max: 20, value: 5 },
  { title: "min distance", type: "range", min: 0, max: 2, value: 1, step: 0.01 },
  { title: "max distance", type: "range", min: 0, max: 2, value: 1.5, step: 0.01 },
  // { title: "Length", type: "range", min: 50, max: 150, value: 125 },
];

export default TriangularPanels;