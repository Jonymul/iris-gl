import ReactDOM from "react-dom";
import "./index.css";
import { IrisPreview, IrisProvider } from "@iris/react";

ReactDOM.render(
  <IrisProvider>
    <IrisPreview style={{ width: 500, height: 600 }} />
    <IrisPreview style={{ width: "100%", height: 400 }} />
    <IrisPreview style={{ width: "100%", height: 300 }} />
  </IrisProvider>,
  document.getElementById("root")
);
