import { useContext } from "react";
import { IrisContext } from "../contexts/IrisContext";

export const useIrisContext = () => {
  const context = useContext(IrisContext);
  if (!context) {
    throw new Error("Iris context accessed outside of a valid IrisProvider");
  }

  return context;
};
