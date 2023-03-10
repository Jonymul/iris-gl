import { FunctionComponent, HTMLAttributes, useEffect, useRef } from "react";
import { useIrisContext } from "../../hooks/useIrisContext";
import { CropReticle } from "../CropReticle";

export type IrisPreviewProps = HTMLAttributes<HTMLDivElement>;

export const IrisPreview: FunctionComponent<IrisPreviewProps> = (props) => {
  const irisContext = useIrisContext();
  const containerRef = useRef<HTMLDivElement>();
  const canvasRef = useRef<HTMLCanvasElement>();
  const isCropping = true; // Store as irisContext.cropPreviewMode or something like that.

  useEffect(() => {
    const devicePixelRatio = window.devicePixelRatio || 1;
    irisContext.createPreviewInstance({
      canvas: canvasRef.current,
      pixelRatio: devicePixelRatio,
      dimensions: {
        width: containerRef.current.clientWidth,
        height: containerRef.current.clientHeight,
      },
    });

    return () => {
      irisContext.destroyPreviewInstance();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      {...props}
      style={{
        display: "flex",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        <canvas
          ref={canvasRef}
          style={{
            width: irisContext.previewCanvasDimensions.width,
            height: irisContext.previewCanvasDimensions.height,
          }}
        />
        {isCropping ? <CropReticle dy={1} dx={1} cy={0.5} cx={0.5} /> : null}
      </div>
    </div>
  );
};
