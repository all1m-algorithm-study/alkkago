#include "solver.cpp"



int main() {
    Solver solver;

    int B = 1, W;
    std::cin >> W;

    for (int i=0; i<B; i++) solver.ScanBlackPiece();
    for (int i=0; i<W; i++) solver.ScanWhitePiece();

    solver.FindOptimal();
    solver.PrintAnswer();
};

