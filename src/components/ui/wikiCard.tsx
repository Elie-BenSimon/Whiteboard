import { cn, getColSpan } from "@/lib/utils";

type WikiCardProps = {
  title?: string;
  children?: React.ReactNode;
  containerWidth?: number;
  description?: string;
  cols?: number;
  handleClick?: () => void;
};

const WikiCard: React.FC<WikiCardProps> = ({
  title,
  children,
  containerWidth,
  description,
  cols,
  handleClick,
}) => {
  return (
    <div
      className={cn(
        "w-full flex flex-col p-4 bg-card border rounded-md flex-shrink shadow-sm",
        handleClick && "cursor-pointer",
        cols && containerWidth
          ? getColSpan(cols, containerWidth, 224)
          : "col-span-1"
      )}
      onClick={handleClick}
    >
      <h2 className="text-xl font-bold">{title}</h2>
      <p className="text-sm">{description}</p>
      {children}
    </div>
  );
};

export default WikiCard;
