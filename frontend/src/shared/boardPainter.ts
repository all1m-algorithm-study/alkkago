import { BOARD_BACKGROUND, INNER_MARGIN, LINE_COUNT, LINE_THICKNESS, Point } from "./boardSetting";

export function drawBoardBase(ctx: CanvasRenderingContext2D, width: number, height: number) {
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

export function drawLine(ctx: CanvasRenderingContext2D, from: Point, to: Point, thickness: number) {
  ctx.beginPath();
  ctx.lineWidth = thickness;
  ctx.moveTo(...from);
  ctx.lineTo(...to);
  ctx.stroke();
}

export function drawCircle(ctx: CanvasRenderingContext2D, x: number, y: number, radius: number, color: string) {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, 2 * Math.PI);
  ctx.fillStyle = color;
  ctx.fill();
}