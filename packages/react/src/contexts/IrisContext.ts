import { createContext, useCallback, useEffect, useRef, useState } from "react";
import {
  AdjustmentParameters,
  defaultAdjustmentParameters,
  Dimensions,
  Iris,
} from "@iris/core";
import { IIrisContext } from "../types/IIrisContext";
import { useTempGetImageData } from "../hooks/useTempGetImageData";
import {
  TransformParameters,
  defaultTransformParameters,
} from "@iris/core/lib/types/TransformParameters";
import { calculateCoverScaleFactor } from "../helpers/calculateCoverScaleFactor";

export const IrisContext = createContext<IIrisContext | undefined>(undefined);
export const { Provider, Consumer } = IrisContext;

export const useRootIrisContextValue = (): IIrisContext => {
  const irisInstance = useRef<Iris>(new Iris());
  const [previewCanvas, setPreviewCanvas] = useState<
    HTMLCanvasElement | undefined
  >(undefined);
  const [previewCanvasDimensions, setPreviewCanvasDimensions] =
    useState<Dimensions>({
      width: 0,
      height: 0,
    });
  const previewDimensions = useRef<Dimensions>({
    width: 0,
    height: 0,
  });
  const previewPixelRatio = useRef<number>(1);
  const [adjustments, _setAdjustments] = useState<AdjustmentParameters>(
    defaultAdjustmentParameters
  );
  const [transform, _setTransform] = useState<TransformParameters>(
    defaultTransformParameters
  );
  const scheduledRender = useRef(false);
  const scheduledRenderAdjustments = useRef<AdjustmentParameters>(adjustments);
  const scheduledRenderTransform = useRef<TransformParameters>(transform);

  const imageElem = useTempGetImageData("/jag.jpg");

  const createPreviewInstance = useCallback(
    (params: {
      canvas: HTMLCanvasElement;
      dimensions: Dimensions;
      pixelRatio: number;
    }): void => {
      const { canvas, dimensions, pixelRatio } = params;
      irisInstance.current.attachCanvas(canvas);

      previewDimensions.current = dimensions;
      previewPixelRatio.current = pixelRatio;
      setPreviewCanvas(canvas);
    },
    [irisInstance, adjustments, imageElem]
  );

  const destroyPreviewInstance = useCallback(() => {
    // TODO: Implement
  }, [irisInstance]);

  const render = useCallback(() => {
    if (irisInstance.current.getState() !== "Ready") return;

    const outputDimensions = irisInstance.current.computeOutputDimensions(
      scheduledRenderTransform.current
    );
    const canvasScaleFactor = calculateCoverScaleFactor(
      previewDimensions.current,
      outputDimensions
    );

    const subsamplingRatio = 1 / canvasScaleFactor / previewPixelRatio.current;
    const canvasDimensions: Dimensions = {
      width: Math.round(outputDimensions.width * canvasScaleFactor),
      height: Math.round(outputDimensions.height * canvasScaleFactor),
    };

    setPreviewCanvasDimensions(canvasDimensions);
    irisInstance.current.render({
      adjustments: scheduledRenderAdjustments.current,
      transform: scheduledRenderTransform.current,
      subsamplingFactor: subsamplingRatio,
    });
  }, [
    scheduledRenderAdjustments,
    scheduledRenderTransform,
    previewDimensions,
    previewPixelRatio,
    irisInstance,
  ]);

  const scheduleRender = useCallback(
    (adjustments: AdjustmentParameters, transform: TransformParameters) => {
      scheduledRenderAdjustments.current = adjustments;
      scheduledRenderTransform.current = transform;

      if (!scheduledRender.current) {
        requestAnimationFrame(() => {
          render();
          scheduledRender.current = false;
        });
      }
    },
    [scheduledRender, scheduledRenderAdjustments, render]
  );

  const setAdjustments = useCallback(
    (adjustments: AdjustmentParameters) => {
      _setAdjustments(adjustments);
      scheduleRender(adjustments, transform);
    },
    [irisInstance, transform]
  );

  useEffect(() => {
    if (imageElem !== undefined && previewCanvas !== undefined) {
      irisInstance.current.setImage(imageElem);
      scheduleRender(adjustments, transform);
    }
  }, [imageElem, previewCanvas, irisInstance]);

  return {
    _instance: irisInstance.current,
    previewCanvasDimensions: previewCanvasDimensions,
    createPreviewInstance: createPreviewInstance,
    destroyPreviewInstance: destroyPreviewInstance,
    adjustments: adjustments,
    setAdjustments: setAdjustments,
  };
};
