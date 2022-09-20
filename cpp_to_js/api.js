RADIUS = 1; // 돌의 반지름
SIZE_H = 20;// 바둑판의 높이
SIZE_W = 20;// 바둑판의 너비

TIME_UNIT = 0.001;// 짧은 시간 간격
MAX_VEL = 1;// 이분탐색시 적용할 최대 속도
SEARCH_CNT = 36; // 각도를 몇 개의 경우로 분해할 것인지
BS_CNT = 10;// 실수 이분탐색을 몇 번 진행할 것인지 
INF = 100000;// 적당히 매우 큰 값

class co{// 벡터의 단위
    constructor(x,y){
        this.x = x;
        this.y = y;
    }

    Norm(){ return Math.sqrt(x*x + y*y); }
    UnitVector(){ return new co(x/this.Norm, y/this.Norm);}

    add(source){
        this.x += source.x;
        this.y += source.y;
    }
    sub(source){
        this.x -= source.x;
        this.y -= source.y;
    }
    mul(scalar){
        this.x *= scalar;
        this.y *= scalar;
    }
    div(scalar){
        this.x /= scalar;
        this.y /= scalar;
    }
}

function add(a, b){ return new co(a.x + b.x, a.y + b.y); }
function sub(a, b){ return new co(a.x - b.x, a.y - b.y); }
function mul(k, u){ return new co(k*u.x, k*u.y); }
function prod(a, b){ return (a.x*b.x + a.y*b.y); } // dot product, 내적
function div(k, u){ return new co(u.x/k, u.y/k); }

class piece{// 바둑알 구조체
    constructor(type){// black(0) or white(1)
        this.type = type;
        this.active = false;
        this.vel = new co(0,0);// velocity of piece
        this.loc = new co(0,0); // location of piece
    }
    SetVel(vel){ this.vel = vel; }
    SetLoc(loc){ this.loc = loc; }
    CheckOutOfBounds(){
        return (this.loc.x < 0 || SIZE_W < this.loc.x || this.loc.y < 0 || SIZE_H < this.loc.y);
    }
}

class state{
    constructor(){
        this.p = new piece(1);
        this.point = 0; // 쓰러뜨린 백돌의 개수
        this.outOfBounds = false;// 흑돌이 밖으로 나갔는지 판별
    }
}
