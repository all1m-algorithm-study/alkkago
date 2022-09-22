import React, { useRef, useEffect } from "react";
import "./Board.css"

const BOARD_BACKGROUND = "rgb(211, 168, 74)";
const LINE_COUNT = 19;
const INNER_MARGIN = 0.05;
const LINE_THICKNESS = 0.003;

type Point = [number, number];

type Stone = {
  centerX: number,
  centerY: number,
  color: string,
};

type BoardProps = {
  width: number,
  height: number,
  radius: number,
  stones: Stone[]
};

const Board: React.FC<BoardProps> = ({ width, height, radius, stones }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas === null) {
      return;
    }

    const ctx = canvas.getContext("2d");
    if (ctx === null) {
      return;
    }
    ctx.fillStyle = BOARD_BACKGROUND;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const leftTop = [canvas.width * INNER_MARGIN, canvas.height * INNER_MARGIN];
    const horInterval = (canvas.width - leftTop[0] * 2) / (LINE_COUNT - 1);
    const verInterval = (canvas.height - leftTop[1] * 2) / (LINE_COUNT - 1);

    // draw vertical lines
    for (let i = 0; i < LINE_COUNT; ++i) {
      let x = leftTop[0] + i * horInterval;
      drawLine(
        ctx,
        [x, leftTop[1]], // start point
        [x, canvas.height - leftTop[1]], // end point
        LINE_THICKNESS * canvas.width
      );
    }

    // draw horizontal lines
    for (let i = 0; i < LINE_COUNT; ++i) {
      let y = leftTop[1] + i * verInterval;
      drawLine(
        ctx,
        [leftTop[0], y], // start point
        [canvas.width - leftTop[0], y], // end point
        LINE_THICKNESS * canvas.height
      );
    }

    // draw stones
    stones.forEach(stone => {
      drawCircle(
        ctx,
        stone.centerX,
        stone.centerY,
        radius,
        stone.color
      )
    });
  }, [width, height, radius, stones]);

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