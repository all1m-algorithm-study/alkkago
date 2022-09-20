#include <vector>
#include <cmath>
#include <iostream>

typedef long double unit; // 통일된 연산 단위

const unit RADIUS = 1; // 돌이 반지름
const unit SIZE_H = 20; // 바둑판의 높이
const unit SIZE_W = 20; // 바둑판의 너비

const unit TIME_UNIT = 0.01; // 짧은 시간 간격
const unit MIN_VELOCITY   = 0.01; // 실수 오차를 없앵기 위해 이 값 이하는 절사
const unit MAX_VELOCITY   = 4; // 이분탐색시 적용할 최대 속도
const unit FRICTION_CONST = 0.01; // 마찰력

const int SEARCH_CNT = 36; // 각도를 몇 개의 경우로 분해할 것인지
const unit BS_INTERVAL = 0.01; // 실수 이분탐색을 몇 번 진행할 것인지


const unit INF = 100'000.0f; // 적당히 매우 큰 값


struct co { // 벡터의 단위

    unit x, y;
    co(unit _x=0, unit _y=0) : x(_x), y(_y) {}

    unit Norm() { return sqrt(x*x + y*y); }
    co UnitVector() { return co(x,y)/Norm(); }

    co operator+(co& source)   { return co(source.x + x, source.y + y); }
    co operator-(co& source)   { return co(x - source.x, y - source.y); }
    co operator*(unit Scalar)  { return co(x * Scalar, y * Scalar); }
    unit operator*(co& source) { return x * source.x + y * source.y; }
    co operator/(unit Scalar)  { return co(x / Scalar, y / Scalar); }

    void operator+=(co& source)  { *this = *this + source; }
    void operator-=(co& source)  { *this = *this - source; }
    void operator*=(unit Scalar) { *this = *this * Scalar; }
    void operator/=(unit Scalar) { *this = *this / Scalar; }
};


struct piece { // 바둑알 구조체
    int type; // black(0) or white(1)
    bool active = false;

    co vel{0,0}; // velocity of piece
    co loc{0,0}; // location of piece

    piece(int _type) :type(_type) {};

    void SetVel(co _vel) {
        vel = _vel;
    }

    void SetLoc(co _loc) {
        loc = _loc;
    }

    bool CheckOutOfBounds() {
        return !(0 <= loc.x && loc.x <= SIZE_W && 0 <= loc.y && loc.y <= SIZE_H);
    }
};



typedef std::vector<piece> pieces; // 바둑알 구조체의 집합
typedef std::vector<pieces> steps; // 시뮬레이션 결과의 집합



struct state {
    piece p{1};
    int point = 0; // 쓰러뜨린 백돌의 개수
    bool outOfBoudns = false; // 흑돌이 밖으로 나갔는지 판별
    bool foul = false; // 흑돌이 백돌을 저격하지 못하고 떨어지는 경우
};