import {
  FunctionComponent,
  HTMLAttributes,
  useEffect,
  useRef,
} from "react";
import { useIrisContext } from "../hooks/useIrisContext";

export type IrisPreviewProps = HTMLAttributes<HTMLDivElement>;

export const IrisPreview: FunctionComponent<IrisPreviewProps> = (props) => {
  const irisContext = useIrisContext();
  const containerRef = useRef<HTMLDivElement>();
  const canvasRef = useRef<HTMLCanvasElement>();

  useEffect(() => {
    const devicePixelRatio = window?.devicePixelRatio || 1;
    const [instance, reference] = irisContext.createPreviewInstance({
      canvas: canvasRef.current,
      pixelRatio: devicePixelRatio,
      maxDimensions: {
        width: containerRef.current.clientWidth,
        height: containerRef.current.clientHeight,
      },
    });

    return () => {
      irisContext.destroyPreviewInstance(reference);
    };
  }, []);

  return (
    <div ref={containerRef} {...props}>
      <canvas ref={canvasRef} />
    </div>
  );
};
