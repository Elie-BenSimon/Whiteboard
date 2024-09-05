type WikiCardProps = {
  title: string;
  description?: string;
  width?: string;
};

const WikiCard: React.FC<WikiCardProps> = ({ title, description, width }) => {
  return (
    <div
      className="flex flex-col p-4 bg-card border rounded-md flex-shrink shadow-sm"
      style={{ width: width ? width : 320 }}
    >
      <h2 className="text-xl font-bold">{title}</h2>
      <p className="text-sm">{description}</p>
    </div>
  );
};

export default WikiCard;
