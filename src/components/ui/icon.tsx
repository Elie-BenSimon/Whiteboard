import React from "react";
import { LucideProps, icons } from "lucide-react";

type IconProps = LucideProps & {
  name: keyof typeof icons;
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
