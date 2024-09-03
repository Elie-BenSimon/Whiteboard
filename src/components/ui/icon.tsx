import React from "react";
import { LucideProps, icons } from "lucide-react";

export type IconName = keyof typeof icons;

type IconProps = LucideProps & {
  name: IconName;
  className?: string;
};

const Icon: React.FC<IconProps> = ({ name, className, ...props }) => {
  const LucideIcon = icons[name];

  if (!LucideIcon) {
    console.warn(`Icon "${name}" does not exist in lucide-react`);
    return null;
  }

  return <LucideIcon className={className} {...props} />;
};

export default Icon;
