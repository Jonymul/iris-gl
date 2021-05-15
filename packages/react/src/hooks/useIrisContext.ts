import { useContext } from "react";
import * as IrisContext from "../contexts/IrisContext";

export const useIrisContext = () => {
  const context = useContext(IrisContext);
  if (context === null) {
    throw new Error("Iris context accessed outside of a valid IrisProvider");
  }

  return context;
};
