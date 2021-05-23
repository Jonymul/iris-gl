import { FC } from "react";
import { TabMenu } from "../../atoms/TabMenu";
import { TabMenuItem } from "../../atoms/TabMenuItem";

export type ModeSelectorProps = {};

export const ModeSelector: FC<ModeSelectorProps> = (props) => {
  return (
    <div>
      <TabMenu>
        <TabMenuItem label="Presets" />
        <TabMenuItem label="Advanced" />
      </TabMenu>
    </div>
  );
};
