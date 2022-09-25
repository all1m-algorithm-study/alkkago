import React, { useRef, useEffect } from "react";
import "./Board.css"
import { Point, BOARD_WIDTH, BOARD_HEIGHT, PIECE_RADIUS } from "./shared/boardSetting";
import * as Painter from "./shared/boardPainter";

type BoardEditorProps = {
  black: Point | null,
  whites: Point[] | null,
  onClick: (clickPos: Point) => void,
};

const BoardEditor: React.FC<BoardEditorProps> = ({ black, whites, onClick }) => {
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

    Painter.drawBoardBase(ctx, BOARD_WIDTH, BOARD_HEIGHT);
    if (black) {
      Painter.drawCircle(ctx, black[0], black[1], PIECE_RADIUS, "black");
    }
    if (whites) {
      whites.forEach(p => Painter.drawCircle(ctx, p[0], p[1], PIECE_RADIUS, "white"));
    }
  }, [black, whites]);

  function handleClick(e: React.MouseEvent<HTMLCanvasElement>) {
    const current = canvasRef.current;
    if (current === null) {
      return;
    }
    const rect = current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    if (!!onClick) {
      onClick([x, y]);
    }
  }

  return (
    <canvas
        width={BOARD_WIDTH}
        height={BOARD_HEIGHT}
        ref={canvasRef}
        onClick={handleClick}
    ></canvas>
  )
}

export default BoardEditor;