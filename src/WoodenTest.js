import makerjs from "makerjs";

const { Line, Circle } = makerjs.paths;
const { Rectangle, RoundRectangle, Text } = makerjs.models;
const { move } = makerjs.model;
const { modelExtents } = makerjs.measure;

function WoodenTest(textData, width, length) {
  const count = Math.min(5, Math.round(length / 25));
  const padding = 5;
  const contentHeight = length - 4 * padding - 15 - (count - 1) * padding;
  const containerHeight = contentHeight + (count + 1) * padding;
  const step1 = ((2 * contentHeight) / count - 2) / (count - 1);
  const step2 = (width / 2 - 2 * padding - 2) / (count - 1);
  const step = Math.min(step1, step2);
  const sizes = Array(count)
    .fill(1)
    .map((start, i) => start + i * step)
    .reverse();

  const sheet = new RoundRectangle(
    width,
    length,
    Math.max(width, length) * 0.1
  );
  const line = new Line([0, containerHeight], [width, containerHeight]);
  line.layer = "blue";

  this.paths = { line };
  this.models = { sheet };

  const x1 = (width / 2 - 2 * padding) / 2 + padding;
  const x2 = width / 2 + (width / 2 - 2 * padding) / 2 + padding;
  let y = padding;
  sizes.forEach((itemSize, i) => {
    const d = Math.round(itemSize);
    const circle = new Circle([x1, y + itemSize / 2], d / 2);
    const rectangle = new Rectangle(d, d);
    move(rectangle, [x2 - itemSize / 2, y]);

    const note = new Text(textData.font, `${d}mm`, 3);
    const noteMeasure = modelExtents(note);
    move(note, [(width - noteMeasure.width) / 2, y + itemSize / 2]);
    note.layer = "blue";

    y += itemSize + padding;
    this.paths[`circle_${i}`] = circle;
    this.models[`rectangle_${i}`] = rectangle;
    this.models[`note_${i}`] = note;
  });

  const text = new Text(textData.font, "laser cut/engraving", textData.size);
  const textMeasure = modelExtents(text);
  move(text, [(width - textMeasure.width) / 2, containerHeight + padding]);
  text.layer = "blue";
  this.models.text = text;

  const userText = new Text(textData.font, textData.text, textData.size);
  const userTextMeasure = modelExtents(userText);
  move(userText, [
    (width - userTextMeasure.width) / 2,
    containerHeight + 8 + padding,
  ]);
  userText.layer = "blue";
  this.models.userText = userText;
}

WoodenTest.metaParameters = [
  {
    title: "թեստ",
    type: "text",
    font: "Mardoto-Bold",
    value: "Your text here",
    size: 5,
  },
  { title: "width", type: "range", min: 50, max: 150, value: 75 },
  { title: "length", type: "range", min: 50, max: 150, value: 125 },
];

export default WoodenTest;
