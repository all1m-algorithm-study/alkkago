#include "simulator.cpp"
#include <iostream>

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
        // c++ 에서는 테스트 출력
    };

    void PrintAnswerStep() {
        Sim.PutPieceState(answer.p);
        Sim.RunWithStep(answer, answer_with_steps);
    };



    /*
    result에 결과를 담아 리턴하기
    매개변수나 리턴값 등 폭넓게 건드려도 됨
    속도를 단위벡터로 전달한 후 곱하는 상수값을 이분탐색
    실수 이분탐색을 잘 구현해야 하며 BS_CNT 만큼 반복
    */

    state MaxValNotCrossedOut(unit low, unit high) {
        //밖으로 빠지지 않는 경우중 속도가 최대인 경우를 찾는 이분탐색 구현

        state result;
        piece p = object;
        p.vel = {0,0}; // 이분탐색을 통해 결정된 v 값을 입력
        Sim.PutPieceState(p);
        Sim.Run(result);

        return result;
    };

    state MinVeMaxPoint(unit low, unit high) {
        //밖으로 안빠지며 포인트가 최대인 경우중 속도가 최소를 찾는 이분탐색 구현

        state result;
        piece p = object;
        p.vel = {0,0}; // 이분탐색을 통해 결정된 v 값을 입력
        Sim.PutPieceState(p);
        Sim.Run(result);

        return result;
    }

    void FindOptimal() {
        /*
        각도 브루트포스, 이분 탐색을 통해 최적을 찾아
        정답을 전역 변수 answer 에 저장
        */
        state result;

        for (int i=0; i<SEARCH_CNT; i++) {
            float axis = (unit)i / SEARCH_CNT * 360;
            auto[x,y] = physics::AngleToUnitVec(axis);

            // 두 번의 binary search 를 통해 최적의 경우를 찾기
            result = MaxValNotCrossedOut(0, MAX_VEL);
            unit max_val = physics::ABSVec(result.p.vel);
            result = MinVeMaxPoint(0, max_val);

            // 갱신할 만하다고 생각되는 경우 답을 갱신
            if (answer.point < result.point) {
                answer = result;
            }
        }
    };
};

