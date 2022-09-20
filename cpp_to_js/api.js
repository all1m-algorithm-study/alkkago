RADIUS = 1;
SIZE_H = 20;
SIZE_W = 20;

TIME_UNIT = 0.001;
MAX_VEL = 1;
SEARCH_CNT = 36;
BS_CNT = 10;
INF = 100000;

class co{
    constructor(x,y){
        this.x = x;
        this.y = y;
    }

    Norm(){ return Math.sqrt(x*x + y*y); }
    UnitVector(){ return co(x/this.Norm, y/this.Norm);}

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

function add(a, b){ return co(a.x + b.x, a.y + b.y); }
function sub(a, b){ return co(a.x - b.x, a.y - b.y); }
function mul(k, u){ return co(k*c.x, k*c.y); }
function mul(a, b){ return (a.x*b.x + a.y*b.y); }
function div(k, u){ return co(u.x/k, u.y/k); }

class piece{
    constructor(type){
        this.type = type;
        this.active = false;
        this.vel = co(0,0);
        this.loc = co(0,0);
    }
    SetVel(vel){ this.vel = vel; }
    SetLoc(loc){ this.loc = loc; }
    CheckOutOfBounds(){
        return (this.loc.x < 0 || SIZE_W < this.loc.x || this.loc.y < 0 || SIZE_H < this.loc.y);
    }
}

class state{
    constructor(){
        this.p = piece(1);
        this.point = 0;
        this.outOfBounds = false;
    }
}