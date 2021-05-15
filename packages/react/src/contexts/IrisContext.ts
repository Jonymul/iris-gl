import { createContext, useEffect, useMemo } from "react";
import { Iris } from "@iris/core";
import { IIrisContext } from "../types/IIrisContext";
import { useTempGetImageData } from "../hooks/useTempGetImageData";

export const { Provider, Consumer } = createContext<IIrisContext | null>(null);

export const useRootIrisContextValue = (): IIrisContext => {
  const irisInstance = useMemo(() => new Iris(), []);
  const imageElem = useTempGetImageData(
    "https://images.unsplash.com/photo-1531891570158-e71b35a485bc?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fH"
  );

  useEffect(() => {
    if (imageElem !== undefined) {
      irisInstance.setImage(imageElem);
      console.log("rendered", irisInstance.render());
    }
  }, [imageElem]);

  return {
    _irisInstance: irisInstance,
    irisParameters: {},
  };
};
