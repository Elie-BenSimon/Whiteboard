import { useWhiteBoardContext } from "@/contexts/whiteboardContext";
import { Button } from "../ui/button";
import Icon from "../ui/icon";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { cn, EdgeColor, edgeColors } from "@/lib/utils";

const EdgesMenu = () => {
  const { linkMode, edgeColor, setLinkMode, setSourceNode, setEdgeColor } =
    useWhiteBoardContext();
  return (
    <div className="grid grid-cols-2 gap-1 border rounded bg-card p-2 h-[62px]">
      <Button
        className="rounded-full p-0 w-5 h-5 border"
        onClick={() => {
          setLinkMode((prev) => !prev);
          setSourceNode(null);
        }}
      >
        <Icon name={linkMode ? "Link2" : "Link2Off"} size={14} />
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className="rounded-full p-0 w-5 h-5 relative border"
            style={{ backgroundColor: edgeColor }}
            onClick={() => {
              setLinkMode((prev) => !prev);
              setSourceNode(null);
            }}
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Link color</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <div className="flex gap-1">
              {Object.keys(edgeColors).map((key) => {
                const color = edgeColors[key as EdgeColor];
                return (
                  <button
                    key={key}
                    className={cn(
                      "h-5 w-5 rounded-full border hover:scale-110 transition-transform",
                      color === edgeColor && "ring-1"
                    )}
                    style={{ backgroundColor: color }}
                    onClick={() => setEdgeColor(color)}
                  />
                );
              })}
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Button
        className="rounded-full p-0 w-5 h-5 border"
        onClick={() => {
          setLinkMode((prev) => !prev);
          setSourceNode(null);
        }}
      >
        <Icon name={linkMode ? "Link2" : "Link2Off"} size={14} />
      </Button>
      <Button
        className="rounded-full p-0 w-5 h-5 border"
        onClick={() => {
          setLinkMode((prev) => !prev);
          setSourceNode(null);
        }}
      >
        <Icon name={linkMode ? "Link2" : "Link2Off"} size={14} />
      </Button>
    </div>
  );
};

export default EdgesMenu;
