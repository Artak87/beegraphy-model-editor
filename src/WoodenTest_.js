import makerjs from "makerjs";


function getValues(maxValue, count) {
  const step = Math.floor((maxValue - 1) / (count - 1));
  const list = [];

  for (let i = count - 1; i >= 0; i--) {
    list.push(Math.round(1+step*i));
  }

  return list;
}

function getPositions(values, gap){
  const positionsY = [];
  let height = 0;

  for (const value of values) {
    positionsY.push(height + value);
    height += 2 * value + gap;
  }

  return positionsY;
}

function Circles(maxRadius, gap, count) {
  const radius = getValues(maxRadius, count);
  const points = getPositions(radius, gap);

  const Line = new makerjs.paths.Line([20, 0], [20, 100]);
  const Cir1 = new makerjs.paths.Circle([20, points[0]], radius[0]);
  const Cir2 = new makerjs.paths.Circle([20, points[1]], radius[1]);
  const Cir3 = new makerjs.paths.Circle([20, points[2]], radius[2]);
  const Cir4 = new makerjs.paths.Circle([20, points[3]], radius[3]);
  const Cir5 = new makerjs.paths.Circle([20, points[4]], radius[4]);

  this.paths = {
    Line,
    Cir1,
    Cir2,
    Cir3,
    Cir4,
    Cir5
  };

  this.models = {
    // Cir,
  };
}

function Rectangles(maxRadius, gap, count) {
  const values = getValues(maxRadius, count);
  const points = getPositions(values, gap);

  const Line = new makerjs.paths.Line([50, 0], [50, 100]);
  const Rect1 = new makerjs.models.Rectangle(values[0]*2, values[0]*2);
  makerjs.model.move(Rect1, [50, points[0]]);
  const Rect2 = new makerjs.models.Rectangle(values[1]*2, values[1]*2);
  makerjs.model.move(Rect2, [50, points[1]]);
  const Rect3 = new makerjs.models.Rectangle(values[2]*2, values[2]*2);
  makerjs.model.move(Rect3, [50, points[2]]);
  const Rect4 = new makerjs.models.Rectangle(values[3]*2, values[3]*2);
  makerjs.model.move(Rect4, [50, points[3]]);
  const Rect5 = new makerjs.models.Rectangle(values[4]*2, values[4]*2);
  makerjs.model.move(Rect5, [50, points[4]]);

  this.paths = {
    Line,
  };

  this.models = {
    Rect1,
    Rect2,
    Rect3,
    Rect4,
    Rect5,
  };
}

function WoodenTest(
  textData,
  width,
  length,
  rectRadius,
  circleRadius,
  step
) {
  const circleCount = 5;

  // const textModel = new makerjs.models.Text(
  //   textData.font,
  //   textData.text,
  //   textData.size
  // );
  const rect = new makerjs.models.RoundRectangle(
    width,
    length,
    rectRadius
  );


  const circles = new Circles(rectRadius, step, circleCount);
  const rectangles = new Rectangles(rectRadius, step, circleCount);

  this.paths = {
    // Circle,
  };
  this.models = {
    rect,
    // textModel,
    circles,
    rectangles,
  };

}


TextModel.metaParameters = [
  {
    title: "թեստ",
    type: "group",
    parameters: [
      { title: "false", type: "bool", value: false },
      { title: "true", type: "bool", value: true },
      { title: "select", type: "select", options: [
          {value: "test1", label: "Test1"},
          {value: "test2", label: "Test2"},
          {value: "test3", label: "Test3"},
        ], value: "test2" },
      {
        title: "rect_radius",
        type: "range",
        min: 5,
        max: 20,
        value: 10,
      },
      {
        title: "թեստ",
        type: "group",
        parameters: [
          { title: "false", type: "bool", value: false },
          { title: "true", type: "bool", value: true },
          { title: "select", type: "select", options: [
              {value: "test1", label: "Test1"},
              {value: "test2", label: "Test2"},
              {value: "test3", label: "Test3"},
            ], value: "test2" },
          {
            title: "rect_radius",
            type: "range",
            min: 5,
            max: 20,
            value: 10,
          },
          {
            title: "թեստ",
            type: "group",
            parameters: [
              { title: "false", type: "bool", value: false },
              { title: "true", type: "bool", value: true },
              { title: "select", type: "select", options: [
                  {value: "test1", label: "Test1"},
                  {value: "test2", label: "Test2"},
                  {value: "test3", label: "Test3"},
                ], value: "test2" },
              {
                title: "rect_radius",
                type: "range",
                min: 5,
                max: 20,
                value: 10,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    title: "xz",
    type: "text",
    font: "ArTarumianHamagumar-Regular",
    value: "Ձեր Տեքստը Այստեղ",
    size: 5,
  },
  { title: "width", type: "range", min: 50, max: 150, value: 75},
  { title: "length", type: "range", min: 100, max: 300, value: 100 },
  {
    title: "rect_radius",
    type: "range",
    min: 5,
    max: 20,
    value: 10,
  },
  {
    title: "cirvle_radius",
    type: "range",
    min: 5,
    max: 20,
    value: 10,
  },
  { title: "step", type: "range", min: 1, max: 3, value: 1},
];


export default WoodenTest;