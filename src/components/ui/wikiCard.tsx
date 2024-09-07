import { cn } from "@/lib/utils";

type WikiCardProps = {
  title?: string;
  children?: React.ReactNode;
  description?: string;
  handleClick?: () => void;
};

const WikiCard: React.FC<WikiCardProps> = ({
  title,
  children,
  description,
  handleClick,
}) => {
  return (
    <div
      className={cn(
        "col-span-1 w-full flex flex-col p-4 bg-card border rounded-md flex-shrink shadow-sm",
        handleClick && "cursor-pointer"
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
