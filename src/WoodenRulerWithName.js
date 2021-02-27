import makerjs from "makerjs";

const {Line, Circle} = makerjs.paths;
const {expand, distort, fillet} = makerjs.path;
const {Text, Rectangle, Ellipse, BezierCurve, RoundRectangle} = makerjs.models;
const {move, combineUnion, scale, outline, simplify, clone, combine, combineSubtraction, walkPaths} = makerjs.model;
const {modelExtents} = makerjs.measure;

function WoodenRulerWithName(nameData, width, length, rulerFontData) {
  this.paths = {};
  this.models = {};


  const padding = 10;
  const fullWidth = width + 2 * padding;
  const fullLength = length + 2 * length / 3;
  const round = length / 3;
  const height = 2 * length / 3;
  const y = 2 * length / 3

  const line1 = new Line([0, 0], [0, fullLength]);
  const line2 = new Line([0, fullLength], [fullWidth, fullLength]);
  const line3 = new Line([fullWidth, fullLength], [fullWidth, 0]);
  const line4 = new Line([fullWidth, 0], [0, 0]);
  const arc1 = fillet(line1, line4, round);
  const arc2 = fillet(line3, line4, round);
  line1.layer = "red";
  line2.layer = "red";
  line3.layer = "red";
  line4.layer = "red";
  arc1.layer = "red";
  arc2.layer = "red";

  this.paths = {
    line1, line2, line3, line4, arc1, arc2,
  };

  const roundRectangle = new RoundRectangle(width, height, height / 3);
  move(roundRectangle, [padding, padding]);


  const name = new Text(nameData.font, (nameData.text || "_").toLocaleUpperCase(), padding);
  const nameMeasure = modelExtents(name)
  const scaleRate = Math.min(
    height / (nameMeasure.height + Math.min(...nameMeasure.low)),
    (width - 2 * height / 3) / nameMeasure.width
  );
  scale(name, scaleRate, true);
  move(name, [(fullWidth - modelExtents(name).width) / 2, padding / 2])

  const r1 = clone(roundRectangle);
  const n1 = clone(name);

  const r2 = clone(roundRectangle);
  const n2 = clone(name);

  this.models.xz2 = combineSubtraction(r2, n2);
  this.models.xz2.layer = "red";

  this.models.xz = combineSubtraction(n1, r1);
  this.models.xz.layer = "blue";
  walkPaths(this.models.xz, (parent, name) => {
    if (r1 === parent) {
      delete parent.paths[name];
    }
  })

  // this.models.name = name;

  // const oval = new Oval(fullWidth, 2 * length / 3 - padding);
  // move(oval, [0, y]);

  // const ellipse = new Ellipse(width/ 2, 2 * length / 3);
  // move(ellipse, [fullWidth / 2, y]);

  // const mainEllipse = outline(ellipse, padding);
  // console.log(Math.min(width / 200, 4));

  // move(ellipse, [fullWidth / 2, length / 2 + padding]);
  // const ellipse = new Ellipse(fullWidth / 2, length / 2 + padding);
  // move(ellipse, [fullWidth / 2, length / 2 + padding]);

  // const sheet = combineUnion(rectangle, mainEllipse);
  //
  // this.models.sheet = sheet;
  // this.paths.mainCircle = mainCircle;
  // this.models.sheet = sheet;
  // this.models.mainEllipse = mainEllipse;
  // this.models.oval = oval;
  // this.models.rectangle = rectangle;
  // this.models.mainEllipse = mainEllipse;
  // this.models.ellipse = ellipse;
  // this.models.roundRectangle = roundRectangle;

  for (let i = 0; i <= width; ++i) {
    const height = i % 10 === 0 ? 10 : i % 5 === 0 ? 7.5 : 5;
    const x = i + padding;
    const y = fullLength;
    const line = new Line([x, y - 1], [x, y - height]);
    line.layer = "blue";
    this.paths[`_${i}`] = line;

    if (i % 10 === 0) {
      const text = new Text(rulerFontData.font, (i / 10).toString(), rulerFontData.size);
      text.layer = "blue";
      const measure = modelExtents(text);
      move(text, [x - measure.width / 2, y - 11 - measure.height]);
      this.models[`_${i}`] = text;
    }
  }
}

WoodenRulerWithName.metaParameters = [
  {title: "Name", type: "text", font: "Mardoto-Bold", size: 20, sizeDisabled: true, value: "ՎԱՍԱԿ ԱԽՊԵՐ"},
  {title: "width", type: "range", min: 100, max: 450, value: 200, step: 10},
  {title: "length", type: "range", min: 15, max: 50, value: 25, step: 1},
  {title: "ruler fonts", type: "text", font: "Mardoto-Thin", size: 3.5, value: false},
];

export default WoodenRulerWithName;
