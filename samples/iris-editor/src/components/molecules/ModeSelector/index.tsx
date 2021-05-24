import { FC, useCallback, useState } from "react";
import { TabMenu } from "../../atoms/TabMenu";
import { TabMenuItem } from "../../atoms/TabMenuItem";

const menuItems = [{ label: "Presets" }, { label: "Advanced" }];

export type ModeSelectorProps = {};

export const ModeSelector: FC<ModeSelectorProps> = (props) => {
  const [selectedMode, setSelectedMode] = useState(0);

  const handleChangeMode = useCallback((index: number) => {
    setSelectedMode(index);
  }, []);

  return (
    <div>
      <TabMenu onTabChange={handleChangeMode}>
        {menuItems.map((item, index) => (
          <TabMenuItem
            key={index}
            label={item.label}
            selected={index === selectedMode}
            onClick={() => handleChangeMode(index)}
          />
        ))}
      </TabMenu>
    </div>
  );
};
