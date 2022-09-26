import React, { useRef, useEffect, useMemo } from "react";
import "./Board.css"
import { Solver } from "./algos/solver";
import * as SolverEnv from "./algos/api";
import { BOARD_HEIGHT, BOARD_WIDTH, PIECE_RADIUS, Point } from "./shared/boardSetting";
import * as Painter from "./shared/boardPainter";

type BoardViewerProps = {
  black: Point,
  whites: Point[],
  speed: number,
};

const BoardViewer: React.FC<BoardViewerProps> = ({ black, whites, speed }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>(0);

  const answerWithSteps = useMemo(() => {
    const solver = new Solver();
    solver.addBlackPiece(
      black[0] / BOARD_WIDTH * SolverEnv.SIZE_W,  // normalize coordinates
      black[1] / BOARD_HEIGHT * SolverEnv.SIZE_H
    );
    whites.forEach(p => solver.addWhitePiece(
      p[0] / BOARD_WIDTH * SolverEnv.SIZE_W,      // normalize coordinates
      p[1] / BOARD_HEIGHT * SolverEnv.SIZE_H
    ));
    solver.findOptimal();
    solver.printAnswer();
    const steps = solver.getAnswerSteps();

    steps.map(ps => 
      ps.map(p => {
        p.loc.x *= BOARD_WIDTH / SolverEnv.SIZE_W;  // revert normalization
        p.loc.y *= BOARD_HEIGHT / SolverEnv.SIZE_H;
        return p;
      })
    );
    
    console.log(steps);
    return steps;
  }, [black, whites]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas === null) {
      return;
    }
    const ctx = canvas.getContext("2d");
    if (ctx === null) {
      return;
    }

    Painter.drawBoardBase(ctx, BOARD_WIDTH, BOARD_HEIGHT);
    Painter.drawCircle(ctx, black[0], black[1], PIECE_RADIUS, "black");
    whites.forEach(p => Painter.drawCircle(ctx, p[0], p[1], PIECE_RADIUS, "white"));

  }, [black, whites]);

  useEffect(() => {
    if (!!!answerWithSteps) {
      return;
    }

    let i = 0;
    const frames = answerWithSteps.map(ps => ps.map(p => p.clone()));
    const animate = () => {
      if (i >= frames.length) {
        return;
      }

      const canvas = canvasRef.current;
      if (canvas === null) {
        return;
      }
      const ctx = canvas.getContext("2d");
      if (ctx === null) {
        return;
      }
      Painter.drawBoardBase(ctx, BOARD_WIDTH, BOARD_HEIGHT);
      frames[i].forEach(p => {
        if (p.dead === false) {
          Painter.drawCircle(ctx, p.loc.x, p.loc.y, PIECE_RADIUS,
            (p.type === 1 ? "black" : "white"));
        }
      });

      i += speed // n배속
      if (i >= frames.length) {
        i = 0;
      }
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, [answerWithSteps, speed]);

  return (
    <canvas width={BOARD_WIDTH} height={BOARD_HEIGHT} ref={canvasRef}></canvas>
  )
}

export default BoardViewer;