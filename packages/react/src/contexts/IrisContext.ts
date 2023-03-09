import { createContext, useCallback, useEffect, useRef, useState } from "react";
import {
  AdjustmentParameters,
  defaultAdjustmentParameters,
  Iris,
} from "@iris/core";
import { IIrisContext } from "../types/IIrisContext";
import { useTempGetImageData } from "../hooks/useTempGetImageData";

export const IrisContext = createContext<IIrisContext | undefined>(undefined);
export const { Provider, Consumer } = IrisContext;

export const useRootIrisContextValue = (): IIrisContext => {
  const irisInstance = useRef<Iris>(new Iris());
  const hasRenderScheduled = useRef(false);
  const [previewCanvas, setPreviewCanvas] = useState<
    HTMLCanvasElement | undefined
  >(undefined);
  const [adjustments, _setAdjustments] = useState<AdjustmentParameters>(
    defaultAdjustmentParameters
  );

  const imageElem = useTempGetImageData("/jag.jpg");

  useEffect(() => {
    if (imageElem !== undefined && previewCanvas !== undefined) {
      irisInstance.current.setImage(imageElem);
      irisInstance.current.render();
    }
  }, [imageElem, previewCanvas, irisInstance.current]);

  const createPreviewInstance = useCallback(
    (params: {
      canvas: HTMLCanvasElement;
      pixelRatio: number;
      maxDimensions?: { width: number; height: number };
    }): void => {
      const { maxDimensions, pixelRatio, canvas } = params;
      console.log("createPreviewInstance", { canvas, imageElem });
      irisInstance.current.attachCanvas(canvas);

      if (maxDimensions !== undefined) {
        irisInstance.current.setMaxOutputDimensions(maxDimensions, pixelRatio);
      }

      // Purely for firing the setImage useEffect
      setPreviewCanvas(canvas);
    },
    [irisInstance, adjustments, imageElem]
  );

  const destroyPreviewInstance = useCallback(() => {
    // TODO: Implement
  }, [irisInstance]);

  const render = useCallback(() => {
    if (irisInstance.current.getState() !== "Ready") return;
    irisInstance.current.render();
  }, [irisInstance]);

  const scheduleRender = useCallback(() => {
    if (!hasRenderScheduled.current) {
      requestAnimationFrame(() => {
        render();
        hasRenderScheduled.current = false;
      });
    }
  }, [hasRenderScheduled]);

  const setAdjustments = useCallback(
    (adjustments: AdjustmentParameters) => {
      _setAdjustments(adjustments);
      irisInstance.current.setAdjustments(adjustments);
      scheduleRender();
    },
    [irisInstance.current]
  );

  return {
    _instance: irisInstance.current,
    createPreviewInstance: createPreviewInstance,
    destroyPreviewInstance: destroyPreviewInstance,
    adjustments: adjustments,
    setAdjustments: setAdjustments,
  };
};
