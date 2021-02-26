import makerjs from "makerjs";

const { Line } = makerjs.paths;
const { Text, Rectangle, Ellipse } = makerjs.models;
const { move, combineUnion } = makerjs.model;
const { modelExtents } = makerjs.measure;

function WoodenRulerWithName(nameData, width, length, rulerFontData) {
  this.paths = {};
  this.models = {};

  const fullWidth = width + 10;
  const rectangle = new Rectangle(fullWidth, length);
  const ellipse = new Ellipse(fullWidth / 2, length / 2);
  move(ellipse, [fullWidth/2, 0])
  const sheet = combineUnion(rectangle, ellipse);
  move(sheet, [0, length / 2]);
  this.models.sheet = sheet;

  for (let i = 0; i <= width; ++i) {
    const height = i % 10 === 0 ? 10 : i % 5 === 0 ? 7.5 : 5;
    const x = i + 5;
    const y = length + length / 2;
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
  { title: "Name", type: "text", font: "Mardoto-Bold", size: 3.5, value: "Vasak" },
  { title: "width", type: "range", min: 100, max: 450, value: 200, step: 10 },
  { title: "length", type: "range", min: 20, max: 50, value: 25, step: 1 },
  { title: "ruler fonts", type: "text", font: "Mardoto-Thin", size: 3.5, value: false },
];

export default WoodenRulerWithName;
