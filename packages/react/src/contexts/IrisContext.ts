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
  const scheduledRenderAdjustments = useRef<AdjustmentParameters>(adjustments);

  const imageElem = useTempGetImageData("/jag.jpg");

  const createPreviewInstance = useCallback(
    (params: {
      canvas: HTMLCanvasElement;
      pixelRatio: number;
      maxDimensions?: { width: number; height: number };
    }): void => {
      const { canvas } = params;
      irisInstance.current.attachCanvas(canvas);

      // TODO: Store preview instance dimensions and pixel ratio

      setPreviewCanvas(canvas);
    },
    [irisInstance, adjustments, imageElem]
  );

  const destroyPreviewInstance = useCallback(() => {
    // TODO: Implement
  }, [irisInstance]);

  const render = useCallback(() => {
    if (irisInstance.current.getState() !== "Ready") return;

    // TODO: Set transform and subsampling factor
    irisInstance.current.render({
      adjustments: scheduledRenderAdjustments.current,
      transform: { dx: 1, dy: 1, cx: 0.5, cy: 0.5, rotation: 0, adjust: 0 },
      subsamplingFactor: 3,
    });
  }, [scheduledRenderAdjustments, irisInstance]);

  const scheduleRender = useCallback(
    (adjustments: AdjustmentParameters) => {
      scheduledRenderAdjustments.current = adjustments;
      if (!hasRenderScheduled.current) {
        requestAnimationFrame(() => {
          render();
          hasRenderScheduled.current = false;
        });
      }
    },
    [hasRenderScheduled, scheduledRenderAdjustments, render]
  );

  const setAdjustments = useCallback(
    (adjustments: AdjustmentParameters) => {
      _setAdjustments(adjustments);
      scheduleRender(adjustments);
    },
    [irisInstance.current]
  );

  useEffect(() => {
    if (imageElem !== undefined && previewCanvas !== undefined) {
      irisInstance.current.setImage(imageElem);
      scheduleRender(adjustments);
    }
  }, [imageElem, previewCanvas, irisInstance.current]);

  return {
    _instance: irisInstance.current,
    createPreviewInstance: createPreviewInstance,
    destroyPreviewInstance: destroyPreviewInstance,
    adjustments: adjustments,
    setAdjustments: setAdjustments,
  };
};
