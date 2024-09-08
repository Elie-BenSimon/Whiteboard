import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./accordion";

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
    <Accordion
      type="single"
      collapsible
      className="bg-card border rounded-md flex-shrink shadow-sm px-4"
    >
      <AccordionItem value="content" className="border-0">
        <AccordionTrigger className="py-4">
          <h2
            onClick={() => {
              if (handleClick) handleClick();
            }}
            className="text-xl font-bold text-left"
          >
            {title}
          </h2>
        </AccordionTrigger>
        <AccordionContent>
          <p className="text-sm">{description}</p>
          {children}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default WikiCard;
