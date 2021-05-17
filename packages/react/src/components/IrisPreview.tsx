import {
  FunctionComponent,
  HTMLAttributes,
  useEffect,
  useRef,
  useState,
} from "react";
import { Iris } from "@iris/core";
import { useIrisContext } from "../hooks/useIrisContext";

export type IrisPreviewProps = HTMLAttributes<HTMLDivElement>;

export const IrisPreview: FunctionComponent<IrisPreviewProps> = (props) => {
  const [iris, setIris] = useState<Iris>(undefined);
  const irisContext = useIrisContext();
  const containerRef = useRef<HTMLDivElement>();
  const canvasRef = useRef<HTMLCanvasElement>();

  useEffect(() => {
    const [instance, reference] = irisContext.createPreviewInstance({
      canvas: canvasRef.current,
      maxDimensions: {
        width: containerRef.current.clientWidth,
        height: containerRef.current.clientHeight,
      },
    });
    setIris(instance);
    // instance.render();

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
