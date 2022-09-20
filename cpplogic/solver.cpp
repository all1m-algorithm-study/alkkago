#include "simulator.cpp"
#include <iostream>
#include <cassert>

class Solver {

private:
    Simulator Sim;

    state answer;
    steps answer_with_steps;

    piece object{1};

public:
    void AddPiece(piece &p) {
        Sim.AddPiece(p);
    };

    void ScanBlackPiece() {
        unit x, y;
        std::cin >> x >> y;

        piece p(1);
        p.loc = {x,y};
        object = p;

        AddPiece(p);
    };

    void ScanWhitePiece() {
        unit x, y;
        std::cin >> x >> y;

        piece p(1);
        p.loc = {x,y};

        AddPiece(p);
    };

    void PrintAnswer() {
        std::cout << "point: " << answer.point << std::endl;
        std::cout << "outOfBounds: " << answer.outOfBoudns << std::endl;
        std::cout << "vector: " << answer.p.vel.x <<' '<< answer.p.vel.y << std::endl;
    };

    void PrintAnswerStep() {
        Sim.UpdatePieceState(answer.p);
        Sim.RunWithStep(answer, answer_with_steps);
    };



    /*
    result에 결과를 담아 리턴하기
    매개변수나 리턴값 등 폭넓게 건드려도 됨
    속도를 단위벡터로 전달한 후 곱하는 상수값을 이분탐색
    실수 이분탐색을 잘 구현해야 하며 BS_CNT 만큼 반복
    */

    state MaxValNotCrossedOut(unit low, unit high, co unitVec) {
        /*
        밖으로 빠지지 않는 경우중 속도가 최대인 경우를 찾는 이분탐색 구현
        유효 오차가 특정 간격 이하가 될 때까지 반복
        */

        state result;

        while (high - low > BS_INTERVAL) {
            unit mid = (high + low) / 2;
            state candidate;
            piece p = object;
            p.vel = unitVec * mid;

            Sim.UpdatePieceState(p);
            Sim.Run(result);

            if (result.outOfBoudns == true) {
                high = mid;
            } else {
                low = mid;
                result = candidate;
            }
        }

        return result;
    };

    state MinVeMaxPoint(unit low, unit high, co unitVec, int point) {
        //밖으로 안빠지며 포인트가 최대인 경우중 속도가 최소를 찾는 이분탐색 구현
        state result;

        while (high - low > BS_INTERVAL) {
            unit mid = (high + low) / 2;
            state candidate;
            piece p = object;
            p.vel = unitVec * mid;

            Sim.UpdatePieceState(p);
            Sim.Run(result);

            assert(!result.outOfBoudns);
            assert(result.point <= point);

            if (result.point == point) {
                high = mid;
                result = candidate;
            } else {
                low = mid;
            }
        }

        return result;
    }

    void FindOptimal() {
        /*
        각도 브루트포스, 이분 탐색을 통해 최적을 찾아
        정답을 전역 변수 answer 에 저장
        */
        state result;

        for (int i=0; i<SEARCH_CNT; i++) {
            unit axis = (unit)i / SEARCH_CNT * 360;
            co unitVec = PHYSICS::UnitVector(axis);

            // 두 번의 binary search 를 통해 최적의 경우를 찾기
            result = MaxValNotCrossedOut(MIN_VEL, MAX_VEL, unitVec);
            unit max_vel = result.p.vel.Norm();
            result = MinVeMaxPoint(MIN_VEL, max_vel, unitVec, result.point);
        }

        answer = result;
    };
};

