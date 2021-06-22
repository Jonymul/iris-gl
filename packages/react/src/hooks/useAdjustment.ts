import { AdjustmentParameter, AdjustmentParameters } from "@iris/core";
import { useCallback } from "react";
import { useAdjustments } from "./useAdjustments";

export const useAdjustment = <P extends AdjustmentParameter>(parameter: P) => {
  const [adjustments, setAdjustments] = useAdjustments();

  const setAdjustment = useCallback(
    (value: AdjustmentParameters[P]) => {
      setAdjustments({ ...adjustments, [parameter]: value });
    },
    [adjustments, parameter]
  );

  return [adjustments[parameter], setAdjustment] as [
    adjustment: AdjustmentParameters[P],
    setAdjustment: (value: AdjustmentParameters[P]) => void
  ];
};
