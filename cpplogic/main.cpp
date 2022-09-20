#include "solver.cpp"



int main() {
    Solver solver;
    /*
    Black piece 의 개수는 1,
    White piece 의 개수는 사용자 입력을 받음
    이와 같은 상황에서 최적의 방법이 무엇인지를 알려주는 것
    */

    int B = 1, W;
    std::cin >> W;

    for (int i=0; i<B; i++) solver.ScanBlackPiece();
    for (int i=0; i<W; i++) solver.ScanWhitePiece();

    solver.FindOptimal();
    solver.PrintAnswer();
};

