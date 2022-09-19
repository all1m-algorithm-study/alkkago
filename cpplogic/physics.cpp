#include "api.cpp"
#include <cmath>

namespace physics {
    co AngleToUnitVec(unit angle); // 각도를 해당 단위벡터로 변환
    unit ABSVec(co v); // 속도벡터의 절댓값

    unit GetCrushDist(piece &p1, piece &p2); // 초기 충돌시 충돌 위치까지의 거리를 얻기
    void PutFirstCrush(piece &object, piece &target); // 초기 충돌 이후 갱신
    void PutFricEffect(piece &p); // 단위시간이 지난 후 속도 감소를 적용
    bool CheckCrush(piece &p1, piece &p2); // 위치 이동 후 충돌했는지 판단
    void PutCrushEffect(piece &p1, piece &p2); // 두 피스가 충돌한 후의 변화를 적용



    unit ABSVec(co v) {
        return sqrt(v.x * v.x + v.y * v.y);
    }

    co AngleToUnitVec(unit angle) {
        unit ux = cos(angle * M_PI / 180);
        unit uy = sin(angle * M_PI / 180);
        return {ux, uy};
    }

    unit GetCrushDist(piece &p1, piece &p2) {
        unit r = sqrt((p1.loc.x - p2.loc.x) * (p1.loc.x - p2.loc.x) + (p1.loc.x - p2.loc.x) * (p1.loc.x - p2.loc.x));
        unit r2_squre = RADIUS*2;
        unit angle;

        // 두 변과 각도를 알 때 나머지 변 길이 구하기
        return 0.0;
    }

    void PutFricEffect(piece &p) {

    }

    void PutFirstCrush(piece &object, piece &target) {
        // 최초 충돌 상황에서 속도가 어떻게 바뀌는지
    }

    bool CheckCrush(piece &p1, piece &p2) {
        unit dist = (p1.loc.x - p2.loc.x) * (p1.loc.x - p2.loc.x) + (p1.loc.x - p2.loc.x) * (p1.loc.x - p2.loc.x);
        unit radius = RADIUS * RADIUS * 4;
        return (dist <= radius);
    }

    void PutCrushEffect(piece &p1, piece &p2) {
        // 일반 충돌 상황에서 속도가 어떻게 바뀌는지
    }

}
