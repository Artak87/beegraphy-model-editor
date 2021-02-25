import makerjs from "makerjs";

const {BezierCurve, Rectangle} = makerjs.models
const {Line} = makerjs.paths
const {fillet} = makerjs.path
const {move, combineUnion, combineSubtraction, rotate, mirror, zero, center} = makerjs.model
const combineUnionAll = (first, ...others) => others.reduce((acc, model) => combineUnion(acc, model), first);

function Heart(width, height, origin = [0, 0]) {
    const [x, y] = origin;
    const calc = ([dx, dy]) => [x + width * dx / 100, y + height * dy / 82.5];

    const a = new BezierCurve([[0, 0], [0, 30], [50, 30], [50, 0]].map(calc));
    const b = new BezierCurve([[50, 0], [50, -30], [0, -35], [0, -60]].map(calc));
    const c = new BezierCurve([[0, -60], [0, -35], [-50, -30], [-50, 0]].map(calc));
    const d = new BezierCurve([[-50, 0], [-50, 30], [0, 30], [0, 0]].map(calc));

    this.models = {a, b, c, d};
}


function Lip(side, height, mirrorX = false, mirrorY = false) {
    const smallSide = side * 0.15;
    const sheet  = new Rectangle(smallSide, height);
    const small  = new Rectangle(2*smallSide, smallSide);
    rotate(small, -20, [2*smallSide, smallSide])
    move(small, [-smallSide, -smallSide])
    let lip = combineSubtraction(sheet, small);
    lip = mirror(lip, mirrorX, mirrorY);
    zero(lip);
    !mirrorX && move(lip, [-smallSide, lip.origin[1]]);

    this.models = {lip};
}

function InnerBox(side, height) {

    const side1 = new Rectangle(side, height);
    const side2 = new Rectangle(height, side);
    const side3 = new Rectangle(side, height);
    const side4 = new Rectangle(height, side);
    const bottom = new Rectangle(side, side);
    const lip1 = new Lip(side, height, false, false);
    const lip2 = new Lip(side, height, true, false);
    const lip3 = new Lip(side, height, false, true);
    const lip4 = new Lip(side, height, true, true);
    const line1 = new Line([height, 0], [height, side + 2*height]);
    const line2 = new Line([height + side, 0], [height + side, side + 2*height]);
    const line3 = new Line([height, height], [height +side, height]);
    const line4 = new Line([height, height+side], [height +side, height+side]);
    line1.layer = 'green'
    line2.layer = 'green'
    line3.layer = 'green'
    line4.layer = 'green'

    move(side1, [height, 0]);
    move(side2, [0, height]);
    move(side3, [height, height + side]);
    move(side4, [height + side, height]);
    move(bottom, [height, height]);
    move(lip1, [height, height + side]);
    move(lip2, [height+side, height + side]);
    move(lip3, [height, 0]);
    move(lip4, [height+side, 0]);

    const box = combineUnionAll(bottom, side1, side2, side3, side4, lip1, lip2, lip3, lip4);

    this.paths = {line1, line2, line3, line4};
    this.models = {box};
}

function Leaf(width, height, padding = 0) {
    const round = height * 0.3;

    const line1 = new Line([padding, 0], [0, height]);
    const line2 = new Line([0, height], [width, height]);
    const line3 = new Line([width, height], [width-padding, 0]);
    const line4 = new Line([width-padding, 0], [padding, 0]);

    const arc1 = fillet(line1, line4, round);
    const arc2 = fillet(line3, line4, round);
    this.paths = {
        line1,
        line2,
        line3,
        line4,
        arc1,
        arc2,
    };
}

function OuterBox (originalSide, height) {
    const delta = 0.3;
    const side = originalSide + delta;
    const leaf = originalSide * (3/5);

    const side1 = new Rectangle(side, height);
    const side2 = new Rectangle(side, height);
    const side3 = new Rectangle(side, height);
    const side4 = new Rectangle(side, height);
    const lip = new Lip(side, height, true);

    const leaf1 = new Leaf(side, leaf,1);
    const leaf2 = new Leaf(side, leaf, Math.round(side * 0.05));
    const leaf3 = new Leaf(side, leaf,1);
    const leaf4 = new Leaf(side, leaf, Math.round(side * 0.05));

    move(side1, [0, leaf]);
    move(side2, [side, leaf]);
    move(side3, [2*side, leaf]);
    move(side4, [3*side, leaf]);
    move(leaf1, [0, 0]);
    move(leaf2, [side, 0]);
    move(leaf3, [2*side, 0]);
    move(leaf4, [3*side, 0]);
    move(lip, [4*side, leaf]);

    const line1 = new Line([side, leaf], [side, leaf + height]);
    const line2 = new Line([2*side, leaf], [2*side, leaf + height]);
    const line3 = new Line([3*side, leaf], [3*side, leaf + height]);
    const line4 = new Line([4*side, leaf], [4*side, leaf + height]);
    const line5 = new Line([0, leaf], [4*side, leaf]);
    line1.layer = 'green'
    line2.layer = 'green'
    line3.layer = 'green'
    line4.layer = 'green'
    line5.layer = 'green'

    const heart1 = new Heart(side / 4, side / 4);
    const heart2 = new Heart(side / 4, side / 4);
    const heart3 = new Heart(side / 4, side / 4);
    const heart4 = new Heart(side / 4, side / 4);
    move(heart1, [side/2, leaf + height / 2])
    move(heart2, [side + side/2, leaf + height / 2])
    move(heart3, [2*side + side/2, leaf + height / 2])
    move(heart4, [3*side + side/2, leaf + height / 2])

    const sheet = combineUnionAll(side1, side2, side3, side4, lip, leaf1, leaf2, leaf3, leaf4)

    this.paths = {line1, line2, line3, line4, line5};
    this.models = {sheet, heart1, heart2, heart3, heart4};
}

function PaperBox(side, height) {
    const innerBox = new InnerBox(side, height);
    move(innerBox, [0, (2*side)+height]);
    const outerBox = new OuterBox(side, height);
    this.models = {innerBox, outerBox};
}

PaperBox.metaParameters = [
    {title: "side", type: "range", min: 0, max: 1000, value: 50 },
    {title: "height", type: "range", min: 15, max: 1000, value: 50 },
];

export default PaperBox