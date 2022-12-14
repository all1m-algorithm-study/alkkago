#include "physics.cpp"
#include <iostream>
#include <cassert>


class Simulator {

private:
    pieces field;

    bool record = false;
    steps recorded_field;

public:
    void AddPiece(piece &p) {
        field.push_back(p);
    };

    void UpdatePieceState(piece &p) {
        /*
        단순화를 위해 field[0] 이 black piece 이며 input 도 이 순서로 받음
        */
        field[0] = p;
    }

    bool CheckOutOfBounds(piece p) {
        return !(0 <= p.loc.x && p.loc.x <= SIZE_W && 0 <= p.loc.y && p.loc.y <= SIZE_H);
    }

    bool CheckAllInactive(pieces ps) {
        for (auto p: ps) if (p.active) return false;
        return true;
    }

    void PrintPiece(piece p) {
        std::cout << "piece color: " << p.type << std::endl;
        std::cout << "piece loc: " << p.loc.x <<' '<< p.loc.y << std::endl; 
        std::cout << "piece vel: " << p.vel.x <<' '<< p.vel.y << std::endl;
        std::cout << std::endl;
    }

    void PrintField(pieces f) {
        for (auto p: f) PrintPiece(p);
    }

    void Run(state &answer) {

        // 시뮬레이션에서 사용할 필드를 초기화
        pieces curField(field);
        curField[0].active = true;

        // 만약 record 중이라면 기록
        if (record) {
            recorded_field.push_back(pieces(curField.begin(), curField.end()));
        }

        /*
        충돌 위치까지의 거리가 가장 짧은 piece 의 번호를 얻음.
        이 물체와 충돌하는 것으로부터 시뮬레이션 시작
        */
        std::vector<unit> crush_dist(field.size(), 0);
        for (int i=1; i<field.size(); i++) {
            crush_dist[i] = PHYSICS::FindCollisionDistance(curField[0], curField[i]);
        }

        /*
        만약 아무 피스와도 충돌하지 않는다면 (거리가 INF) 시뮬레이션이 무의미함
        foul 판정을 하고 시뮬레이션을 종료
        */
        int crush_idx = min_element(crush_dist.begin()+1, crush_dist.end()) - crush_dist.begin();
        if (crush_dist[crush_idx] == INF) {
            answer.outOfBoudns = true;
            answer.foul = true;
            return;
        }

        // 충돌 위치로 이동을 시킨 후 충돌 효과를 적용
        PHYSICS::Initialize(curField[0], crush_dist[crush_idx]);
        PHYSICS::UpdateCollision(curField[0], curField[crush_idx]);

        if (record) {
            recorded_field.push_back(pieces(curField.begin(), curField.end()));
        }

        while (!CheckAllInactive(curField)) {
            /*
            실수 오차를 막기 위해 마찰력 고려 함수에 의해 vel 이 0 이하가 될 경우 active = false 가 됨.
            CheckAllInactive 는 모든 piece 의 active 가 false 인지를 체크하여 시뮬레이션 종료
            */

            // 마찰에 의한 감속 적용하기
            for (auto &p: curField) PHYSICS::UpdateMovement(p, TIME_UNIT);

            // 모든 쌍에 대해 충돌 판정하기
            for (int i=0; i<field.size(); i++) {
                for (int j=i+1; j<field.size(); j++) {
                    piece &p1 = curField[i];
                    piece &p2 = curField[j];
                    if (p1.dead || p2.dead) continue;

                    PHYSICS::UpdateCollision(p1, p2);
                }
            }

            // 경계를 넘어간 말이 있는지 체크
            for (auto &p: curField) {
                if (!p.dead && p.active && CheckOutOfBounds(p)) {
                    switch (p.type) {
                        case 0:
                            answer.point++;
                            break;
                        case 1:
                            answer.outOfBoudns = true;
                            break;
                    }
                    p.dead = true;
                    p.active = false;
                }
            }

            if (record) {
                recorded_field.push_back(pieces(curField.begin(), curField.end()));
            }
        }
    }

    void RunWithStep(state &answer, steps &steps) {
        //record 를 true 로 만들어서 Run 에서 step을 기록할 수 있게 함
        record = true;
        recorded_field.clear();
        Run(answer);
        steps = recorded_field;
        record = false;
    };
};


