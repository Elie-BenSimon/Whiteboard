import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";

type AutoFitTextAreaProps = {
  autofocus?: boolean;
  className?: string;
  containerClassName?: string;
  label?: string;
  placeholder?: string;
  id?: string;
  value: string;
  onChange: (newValue: string) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
};

const AutoFitTextArea: React.FC<AutoFitTextAreaProps> = ({
  autofocus,
  className,
  containerClassName,
  label,
  placeholder,
  id,
  value,
  onChange,
  onKeyDown,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [value, textareaRef.current?.offsetWidth]);

  useEffect(() => {
    if (autofocus) {
      const timer = setTimeout(() => textareaRef.current?.focus(), 15);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [autofocus, textareaRef]);

  return (
    <div className={cn("flex flex-col w-full", containerClassName)}>
      {label && (
        <label htmlFor={id} className="text-[8px] text-muted-foreground">
          {label}
        </label>
      )}
      <textarea
        id={id}
        ref={textareaRef}
        className={cn(
          "h-auto focus:outline-none resize-none overflow-hidden w-full bg-transparent",
          className
        )}
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
        }}
        rows={1}
        onKeyDown={onKeyDown}
        onInput={(e) => {
          const target = e.target as HTMLTextAreaElement;
          target.style.height = "auto";
          target.style.height = `${target.scrollHeight}px`;
        }}
        placeholder={placeholder}
      />
    </div>
  );
};

export default AutoFitTextArea;
