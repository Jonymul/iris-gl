import { useIrisContext } from "./useIrisContext";

export const useAdjustments = () => {
  const irisContext = useIrisContext();

  return [irisContext.adjustments, irisContext.setAdjustments] as [
    adjustments: typeof irisContext.adjustments,
    setAdjustments: typeof irisContext.setAdjustments
  ];
};
