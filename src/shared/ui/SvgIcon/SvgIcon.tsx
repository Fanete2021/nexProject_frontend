import useDynamicSvgImport from "@/shared/lib/hooks/useDynamicSvgImport.ts";
import { icons } from "./model/icons.ts";
import React, { memo } from "react";

export interface SvgIconProps {
  iconName: icons;
  svgProp?: React.SVGProps<SVGSVGElement>;
  className?: string;
}

const SvgIcon: React.FC<SvgIconProps> = memo((props) => {
  const { iconName, svgProp, className } = props;
  const { loading, Icon } = useDynamicSvgImport(iconName);

  return (
    <>
      {Icon && (
        <Icon className={className}/>
      )}
    </>
  );
});

export default SvgIcon;
