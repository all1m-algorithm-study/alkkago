import { BS_INTERVAL, Co, MAX_VELOCITY, MIN_VELOCITY, Piece, SEARCH_CNT, State } from "./api";
import { Simulator } from "./simulator";
import * as Physics from "./physics";

export class Solver {
    #sim: Simulator;
    #answer: State;
    #answerWithSteps: Array<Array<Piece>>;
    #object: Piece;

    constructor() {
        this.#sim = new Simulator();
        this.#answer = new State();
        this.#answerWithSteps = [];
        this.#object = new Piece(1);
    }

    addPiece(p: Piece) {
        this.#sim.addPiece(p.clone());
    }

    addBlackPiece(x: number, y: number) {
        const p = new Piece(1);
        p.loc.x = x;
        p.loc.y = y;
        this.#object = p;
        this.addPiece(p);
    }

    addWhitePiece(x: number, y: number) {
        const p = new Piece(0);
        p.loc.x = x;
        p.loc.y = y;
        this.addPiece(p);
    }
    
    printAnswer() {
        console.error(`point: ${this.#answer.point}`);
        console.error(`direction:\nx: ${this.#answer.p.vel.x}, y: ${this.#answer.p.vel.y}`);
        console.error(`outOfBounds: ${this.#answer.outOfBounds ? 'true' : 'false'}`);
    }

    printAnswerStep() {
        this.#sim.updatePieceState(this.#answer.p);
        this.#sim.runWithStep(this.#answer, this.#answerWithSteps);
    }

    findMaxValNotCrossedOut(low: number, high: number, unitVec: Co) {
        let result = new State();

        while (high - low > BS_INTERVAL) {
            const mid = (high + low) / 2;
            const candidate = new State();
            candidate.p = this.#object.clone();
            candidate.p.vel = unitVec.mulScalar(mid);

            this.#sim.updatePieceState(candidate.p);
            this.#sim.run(candidate);

            if (candidate.foul) {
                return candidate;
            }

            if (candidate.outOfBounds) {
                high = mid;
            } else {
                low = mid;
                if (result.point < candidate.point) {
                    result = candidate;
                }
            }
        }

        return result;
    }

    findOptimal() {
        for (let i = 0; i < SEARCH_CNT; ++i) {
            const axis = i * (360 / SEARCH_CNT);
            const unitVec = Physics.getUnitVector(axis);

            const result = this.findMaxValNotCrossedOut(MIN_VELOCITY, MAX_VELOCITY, unitVec);
            
            if (result.outOfBounds) {
                continue;
            }
            if (result.point > this.#answer.point) {
                this.#answer = result.clone();
            }
        }
    }
}