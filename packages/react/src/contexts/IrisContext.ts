import { createContext, useCallback, useEffect, useRef } from "react";
import { Iris } from "@iris/core";
import { IIrisContext } from "../types/IIrisContext";
import { useTempGetImageData } from "../hooks/useTempGetImageData";

export const IrisContext = createContext<IIrisContext | undefined>(undefined);
export const { Provider, Consumer } = IrisContext;

export const useRootIrisContextValue = (): IIrisContext => {
  // const irisInstance = useMemo(() => new Iris(), []);
  const previewIrisInstances = useRef<Record<symbol, Iris>>();

  const imageElem = useTempGetImageData(
    "https://images.unsplash.com/photo-1531891570158-e71b35a485bc?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fH"
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
      maxDimensions?: { width: number; height: number };
    }): [Iris, symbol] => {
      const { maxDimensions } = params;
      const reference = Symbol();
      const instance = new Iris(params.canvas);

      if (maxDimensions !== undefined) {
        instance.setMaxOutputDimensions(maxDimensions);
      }

      previewIrisInstances.current = {
        ...previewIrisInstances.current,
        [reference]: instance,
      };

      return [instance, reference];
    },
    [previewIrisInstances]
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

  return {
    // _irisInstance: irisInstance,
    _previewIrisInstances: previewIrisInstances,
    irisParameters: {},
    createPreviewInstance: createPreviewInstance,
    destroyPreviewInstance: destroyPreviewInstance,
  };
};
