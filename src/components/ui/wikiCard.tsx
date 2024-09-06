import { cn } from "@/lib/utils";

type WikiCardProps = {
  title?: string;
  children?: React.ReactNode;
  description?: string;
  width?: string;
  handleClick?: () => void;
};

const WikiCard: React.FC<WikiCardProps> = ({
  title,
  children,
  description,
  width,
  handleClick,
}) => {
  return (
    <div
      className={cn(
        "flex flex-col p-4 bg-card border rounded-md flex-shrink shadow-sm",
        handleClick && "cursor-pointer"
      )}
      style={{ width: width ? width : 320 }}
      onClick={handleClick}
    >
      <h2 className="text-xl font-bold truncate">{title}</h2>
      <p className="text-sm">{description}</p>
      {children}
    </div>
  );
};

export default WikiCard;
