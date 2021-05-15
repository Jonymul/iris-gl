import { FunctionComponent } from "react";
import { useRootIrisContextValue } from "../contexts/IrisContext";
import * as IrisContext from "../contexts/IrisContext";

export const IrisProvider: FunctionComponent = (props) => {
  const contextValue = useRootIrisContextValue();

  return (
    <IrisContext.Provider value={contextValue}>
      {props.children}
    </IrisContext.Provider>
  );
};
