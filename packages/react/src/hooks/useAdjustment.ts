import { AdjustmentParameter, AdjustmentParameters } from "@iris/core";
import { adjustmentParameterConfig } from "@iris/core";
import { useCallback } from "react";
import { useAdjustments } from "./useAdjustments";

export const useAdjustment = <P extends AdjustmentParameter>(parameter: P) => {
  const [adjustments, setAdjustments] = useAdjustments();
  const { min, max } = adjustmentParameterConfig[parameter];

  const setAdjustment = useCallback(
    (value: AdjustmentParameters[P]) => {
      setAdjustments({ ...adjustments, [parameter]: value });
    },
    [adjustments, parameter]
  );

  return [adjustments[parameter], setAdjustment, min, max] as [
    adjustment: AdjustmentParameters[P],
    setAdjustment: (value: AdjustmentParameters[P]) => void,
    min: number,
    max: number
  ];
};
