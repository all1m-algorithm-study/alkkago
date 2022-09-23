import { INF, Piece, SIZE_H, SIZE_W, State, TIME_UNIT } from "./api";
import * as Physics from "./physics";

export class Simulator {
    #field: Array<Piece>;         // [Piece]
    #record: boolean;        // boolean
    #recordedField: Array<Array<Piece>>; // [[Piece]]

    constructor() {
        this.#field = [];
        this.#record = false;
        this.#recordedField = [];
    }

    addPiece(p: Piece) {
        this.#field.push(p.clone());
    }

    updatePieceState(p: Piece) {
        this.#field[0] = p.clone();
    }

    checkOutOfBounds(p: Piece): boolean {
        return !(0 <= p.loc.x && p.loc.x <= SIZE_W && 0 <= p.loc.y && p.loc.y <= SIZE_H);
    }

    checkAllInactive(ps: Array<Piece>): boolean {
        return ps.every(p => !p.active);
    }

    printPiece(p: Piece) {
        console.error(`piece color: ${p.type}`);
        console.error(`piece loc: ${p.loc.x} ${p.loc.y}`);
        console.error(`piece vel: ${p.vel.x} ${p.vel.y}`);
        console.error("");
    }

    printField(f: Array<Piece>) {
        f.map(p => this.printPiece(p));
    }

    run(answer: State) {
        const curField = this.#field.map(p => p.clone());
        curField[0].active = true;

        if (this.#record) {
            this.#recordedField.push(curField.map(p => p.clone()));
        }

        const crushDist = curField.slice(1).map(p => {
            return Physics.findCollisionDistance(curField[0], p);
        });

        const minCrushDist = Math.min(...crushDist);
        const crushIdx = crushDist.findIndex(p => p === minCrushDist) + 1;
        console.assert(crushIdx > 0, "crushDist.findIndex was -1.")
        if (minCrushDist === INF) {
            answer.outOfBounds = true;
            answer.foul = true;
            return;
        }

        Physics.initialize(curField[0], minCrushDist);
        Physics.updateCollision(curField[0], curField[crushIdx]);

        if (this.#record) {
            this.#recordedField.push(curField.map(p => p.clone()));
        }

        while (!this.checkAllInactive(curField)) {
            curField.forEach(p => Physics.updateMovement(p, TIME_UNIT));

            for (let i = 0; i < this.#field.length; ++i) {
                for (let j = i+1; j < this.#field.length; ++j) {
                    const p1 = curField[i];
                    const p2 = curField[j];
                    if (p1.dead || p2.dead) {
                        continue;
                    }
                    Physics.updateCollision(p1, p2);
                }
            }

            curField.forEach((p, i, origin) => {
                if (!p.dead && p.active && this.checkOutOfBounds(p)) {
                    switch (p.type) {
                        case 0:
                            answer.point++;
                            break;
                        case 1:
                            answer.outOfBounds = true;
                            break;
                        default:
                            console.assert(false, "p.type was invalid.")
                            break;
                    }
                    p.dead = true;
                    p.active = false;
                    origin[i] = p;
                }
            });

            if (this.#record) {
                this.#recordedField.push(curField.map(p => p.clone()));
            }
        }
    }

    runWithStep(answer: State, steps: Array<Array<Piece>>) {
        this.#record = true;
        this.#recordedField = [];
        this.run(answer);
        
        while (steps.length) {
            steps.pop();
        }
        steps.push(...this.#recordedField.map(ps => ps.map(p => p.clone())));
        this.#record = false;
    }
}