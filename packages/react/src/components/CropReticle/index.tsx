import { FC, useEffect, useRef } from "react";

type CropReticleProps = {
  cy: number;
  cx: number;
  dy: number;
  dx: number;
};

export const CropReticle: FC<CropReticleProps> = (props) => {
  const { cy, cx, dy, dx } = props;
  const canvasRef = useRef<HTMLCanvasElement>();

  useEffect(() => {
    if (canvasRef.current === null) return;
    // const dpr = window.devicePixelRatio || 1;
    const dpr = 1;
    const width = canvasRef.current.clientWidth;
    const height = canvasRef.current.clientHeight;
    const renderWidth = width * dpr;
    const renderHeight = height * dpr;

    const bottom = (cy - 1 / dy / 2) * renderHeight;
    const top = (cy + 1 / dy / 2) * renderHeight;
    const left = (cx - 1 / dx / 2) * renderWidth;
    const right = (cx + 1 / dx / 2) * renderWidth;

    console.log({ top, bottom, left, right });

    const ctx = canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, renderWidth, renderHeight);

    ctx.lineWidth = 1;
    ctx.strokeStyle = "lime";
    ctx.strokeRect(left, bottom, 0, top - bottom);
    // ctx.strokeStyle = "lime";
    ctx.strokeRect(right, bottom, 0, top - bottom);
    ctx.strokeStyle = "blue";
    ctx.strokeRect(right, top, right - left, 0);
    ctx.strokeStyle = "orange";
    ctx.strokeRect(right, bottom, right - left, 0);
  }, [canvasRef, cy, cx, dy, dx]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        imageRendering: "pixelated",
      }}
    />
  );
};
