import makerjs from "makerjs";

const { Line } = makerjs.paths;
const { Text, Rectangle } = makerjs.models;
const { move } = makerjs.model;
const { modelExtents } = makerjs.measure;

function WoodenRuler(width, length, textData) {
  this.paths = {};
  this.models = {};

  this.models.sheet = new Rectangle(width + 10, length);

  for (let i = 0; i <= width; ++i) {
    const height = i % 10 === 0 ? 10 : i % 5 === 0 ? 7.5 : 5;
    const x = i + 5;
    const line = new Line([x, length - 1], [x, length - height]);
    line.layer = "blue";
    this.paths[`_${i}`] = line;

    if (i % 10 === 0) {
      const text = new Text(textData.font, (i / 10).toString(), textData.size);
      text.layer = "blue";
      const measure = modelExtents(text);
      move(text, [x - measure.width / 2, length - 11 - measure.height]);
      this.models[`_${i}`] = text;
    }
  }
}

WoodenRuler.metaParameters = [
  { title: "width", type: "range", min: 100, max: 450, value: 300, step: 10 },
  { title: "length", type: "range", min: 20, max: 50, value: 25, step: 1 },
  { title: "Text", type: "text", font: "Mardoto-Thin", size: 3.5, value: false },
];

export default WoodenRuler;
