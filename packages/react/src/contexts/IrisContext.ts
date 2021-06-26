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
  const previewIrisInstances = useRef<Record<symbol, Iris>>();
  const hasRenderScheduled = useRef(false);
  const [adjustments, _setAdjustments] = useState<AdjustmentParameters>(
    defaultAdjustmentParameters
  );

  const imageElem = useTempGetImageData(
    "/jag.jpg"
  );

  useEffect(() => {
    if (imageElem !== undefined) {
      Object.getOwnPropertySymbols(previewIrisInstances.current).forEach(
        (reference) => {
          const instance: Iris = previewIrisInstances.current[reference];
          instance.setImage(imageElem);
          instance.render();
        }
      );
    }
  }, [imageElem, previewIrisInstances.current]);

  const createPreviewInstance = useCallback(
    (params: {
      canvas: HTMLCanvasElement;
      pixelRatio: number;
      maxDimensions?: { width: number; height: number };
    }): [Iris, symbol] => {
      const { maxDimensions, pixelRatio } = params;
      const reference = Symbol();
      const instance = new Iris(params.canvas);
      instance.setAdjustments(adjustments);

      if (maxDimensions !== undefined) {
        instance.setMaxOutputDimensions(maxDimensions, pixelRatio);
      }

      previewIrisInstances.current = {
        ...previewIrisInstances.current,
        [reference]: instance,
      };

      return [instance, reference];
    },
    [previewIrisInstances, adjustments]
  );

  const destroyPreviewInstance = useCallback(
    (reference: symbol) => {
      const newPreviewInstances = {
        ...previewIrisInstances.current,
      };

      delete newPreviewInstances[reference];
      previewIrisInstances.current = newPreviewInstances;
    },
    [previewIrisInstances]
  );

  const render = useCallback(() => {
    Object.getOwnPropertySymbols(previewIrisInstances.current).forEach(
      (reference) => {
        const instance: Iris = previewIrisInstances.current[reference];
        if (instance.getState() !== "Ready") return;
        instance.render();
      }
    );
  }, [previewIrisInstances]);

  const scheduleRender = useCallback(() => {
    if (!hasRenderScheduled.current) {
      requestAnimationFrame(() => {
        render();
        hasRenderScheduled.current = false;
      });
    }
  }, [hasRenderScheduled]);

  const setInstanceAdjustments = useCallback(
    (adjustments: AdjustmentParameters) => {
      Object.getOwnPropertySymbols(previewIrisInstances.current).forEach(
        (reference) => {
          const instance: Iris = previewIrisInstances.current[reference];
          instance.setAdjustments(adjustments);
        }
      );
    },
    [previewIrisInstances]
  );

  const setAdjustments = useCallback((adjustments: AdjustmentParameters) => {
    _setAdjustments(adjustments);
    setInstanceAdjustments(adjustments);
    scheduleRender();
  }, []);

  return {
    _previewIrisInstances: previewIrisInstances,
    createPreviewInstance: createPreviewInstance,
    destroyPreviewInstance: destroyPreviewInstance,
    adjustments: adjustments,
    setAdjustments: setAdjustments,
  };
};
