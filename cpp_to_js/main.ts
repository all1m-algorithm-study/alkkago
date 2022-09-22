import { Solver } from "./algos/solver"

// Test Data
const BLACK_POS = { x: 4, y: 4 };
const WHITE_LIST = [
    { x: 4, y: 1 },
    { x: 1, y: 4 },
    { x: 1, y: 1 },
];

const solver = new Solver();

solver.addBlackPiece(BLACK_POS.x, BLACK_POS.y);
WHITE_LIST.forEach(p => solver.addWhitePiece(p.x, p.y));

solver.findOptimal();
solver.printAnswer();