import React, { useRef, useEffect, useMemo } from "react";
import "./Board.css"
import { Solver } from "./algos/solver";
import * as SolverEnv from "./algos/api";

const BOARD_BACKGROUND = "rgb(211, 168, 74)";
const LINE_COUNT = 19;
const INNER_MARGIN = 0.05;
const LINE_THICKNESS = 0.003;

export type Point = [number, number];

type BoardProps = {
  width: number,
  height: number,
  radius: number,
  black: Point,
  whites: Point[],
  play: boolean,
};

const Board: React.FC<BoardProps> = ({ width, height, radius, black, whites, play }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>(0);

  const answerWithSteps = useMemo(() => {
    if (!play) {
      return null;
    }

    const solver = new Solver();
    solver.addBlackPiece(
      black[0] / width * SolverEnv.SIZE_W,  // normalize coordinates
      black[1] / height * SolverEnv.SIZE_H
    );
    whites.forEach(p => solver.addWhitePiece(
      p[0] / width * SolverEnv.SIZE_W,      // normalize coordinates
      p[1] / height * SolverEnv.SIZE_H
    ));
    solver.findOptimal();
    solver.printAnswer();
    const steps = solver.getAnswerSteps();

    steps.map(ps => 
      ps.map(p => {
        p.loc.x *= width / SolverEnv.SIZE_W;  // revert normalization
        p.loc.y *= height / SolverEnv.SIZE_H;
        return p;
      })
    );
    
    console.log(steps);
    return steps;
  }, [width, height, black, whites, play]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas === null) {
      return;
    }
    const ctx = canvas.getContext("2d");
    if (ctx === null) {
      return;
    }

    drawBoardBase(ctx, width, height);
    drawCircle(ctx, black[0], black[1], radius, "black");
    whites.forEach(p => drawCircle(ctx, p[0], p[1], radius, "white"));

  }, [width, height, radius, black, whites]);

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
      drawBoardBase(ctx, width, height);
      frames[i].forEach(p => {
        drawCircle(ctx, p.loc.x, p.loc.y, radius, (p.type === 1 ? "black" : "white"));
      });

      i += 3 // n배속
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, [answerWithSteps]);

  function drawBoardBase(ctx: CanvasRenderingContext2D, width: number, height: number) {
    ctx.fillStyle = BOARD_BACKGROUND;
    ctx.fillRect(0, 0, width, height);

    const leftTop = [width * INNER_MARGIN, height * INNER_MARGIN];
    const horInterval = (width - leftTop[0] * 2) / (LINE_COUNT - 1);
    const verInterval = (height - leftTop[1] * 2) / (LINE_COUNT - 1);

    // draw vertical lines
    for (let i = 0; i < LINE_COUNT; ++i) {
      let x = leftTop[0] + i * horInterval;
      drawLine(
        ctx,
        [x, leftTop[1]], // start point
        [x, height - leftTop[1]], // end point
        LINE_THICKNESS * width
      );
    }

    // draw horizontal lines
    for (let i = 0; i < LINE_COUNT; ++i) {
      let y = leftTop[1] + i * verInterval;
      drawLine(
        ctx,
        [leftTop[0], y], // start point
        [width - leftTop[0], y], // end point
        LINE_THICKNESS * height
      );
    }
  }

  function drawLine(ctx: CanvasRenderingContext2D, from: Point, to: Point, thickness: number) {
    ctx.beginPath();
    ctx.lineWidth = thickness;
    ctx.moveTo(...from);
    ctx.lineTo(...to);
    ctx.stroke();
  }

  function drawCircle(ctx: CanvasRenderingContext2D, x: number, y: number, radius: number, color: string) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2*Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
  }

  return (
    <canvas width={width} height={height} ref={canvasRef}></canvas>
  )
}

export default Board;