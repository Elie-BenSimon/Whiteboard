import { cn } from "@/lib/utils";

type CardHeaderProps = {
  color: string;
};

const CardHeader: React.FC<CardHeaderProps> = ({ color }) => {
  return (
    <div
      className={cn("p-1 h-6 border-y border-t-white border-b-black/30", color)}
    />
  );
};

export default CardHeader;
