export const RADIUS = 0.5; // 돌이 반지름
export const SIZE_H = 20; // 바둑판의 높이
export const SIZE_W = 20; // 바둑판의 너비

export const TIME_UNIT = 1./64.; // 짧은 시간 간격
export const MIN_VELOCITY   = 1./64.; // 실수 오차를 없앵기 위해 이 값 이하는 절사
export const MAX_VELOCITY   = 16; // 이분탐색시 적용할 최대 속도
export const FRICTION_CONST = 1./64.; // 마찰력

export const SEARCH_CNT = 360; // 각도를 몇 개의 경우로 분해할 것인지
export const BS_INTERVAL = 1./64.; // 실수 이분탐색을 몇 번 진행할 것인지

export const INF = 100000.0; // 적당히 매우 큰 값

export class Co { // 벡터의 단위
    constructor(public x: number, public y: number) {}

    getNorm(): number {
        return Math.sqrt(this.x*this.x + this.y*this.y);
    }

    getUnitVector(): Co {
        return new Co(this.x/this.getNorm(), this.y/this.getNorm());
    }

    addVector(source: Co): Co {
        return new Co(
            this.x + source.x,
            this.y + source.y
        );
    }

    subVector(source: Co): Co {
        return new Co(
            this.x - source.x,
            this.y - source.y
        );
    }

    mulScalar(scalar: number): Co {
        return new Co(
            this.x * scalar,
            this.y * scalar
        );
    }

    getInnerProduct(source: Co): number {
        return this.x * source.x + this.y * source.y;
    }

    divScalar(scalar: number): Co {
        return new Co(
            this.x /= scalar,
            this.y /= scalar
        );
    }

    clone(): Co {
        return new Co(this.x, this.y);
    }
}

export class Piece { // 바둑알 구조체
    public type: number;
    public active: boolean;
    public dead: boolean;
    public vel: Co;
    public loc: Co;

    constructor(type: number) { // black(0) or white(1)
        this.type = type;
        this.active = false;
        this.dead = false;
        this.vel = new Co(0, 0);// velocity of piece
        this.loc = new Co(0, 0); // location of piece
    }

    setVel(vel: Co) {
        this.vel = vel.clone();
    }

    setLoc(loc: Co) {
        this.loc = loc.clone();
    }

    checkOutOfBounds(): boolean {
        return (this.loc.x < 0 || SIZE_W < this.loc.x || this.loc.y < 0 || SIZE_H < this.loc.y);
    }

    clone(): Piece {
        const result = new Piece(this.type);
        result.active = this.active;
        result.dead = this.dead;
        result.setVel(this.vel);
        result.setLoc(this.loc);
        return result;
    }
}

export class State {
    public p: Piece;
    public point: number;
    public outOfBounds: boolean;
    public foul: boolean;

    constructor() {
        this.p = new Piece(1);
        this.point = 0; // 쓰러뜨린 백돌의 개수
        this.outOfBounds = false;// 흑돌이 밖으로 나갔는지 판별
        this.foul = false; // 흑돌이 백돌을 저격하지 못하고 떨어지는 경우
    }

    clone(): State {
        const result = new State();
        result.p = this.p.clone();
        result.point = this.point;
        result.outOfBounds = this.outOfBounds;
        result.foul = this.foul;
        return result;
    }
}
