import { useWhiteBoardContext } from "@/hooks/useWhiteBoardContext";
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
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { EdgeShapes } from "@/lib/flowUtils";

const EdgesMenu = () => {
  const { linkMode, edgeParams, setLinkMode, setSourceNode, setEdgeParams } =
    useWhiteBoardContext();

  const shapes: EdgeShapes[] = ["bezier", "straight", "step"];
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
          <Button className="rounded-full p-0 w-5 h-5 border">
            <Icon name={"Settings"} size={14} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Link options</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            <div className="flex gap-1">
              {Object.keys(edgeColors).map((key) => {
                const color = edgeColors[key as EdgeColor];
                return (
                  <button
                    key={key}
                    className={cn(
                      "h-5 w-5 rounded-full border hover:scale-110 transition-transform",
                      color === edgeParams.color && "ring-1"
                    )}
                    style={{ backgroundColor: color }}
                    onClick={() => setEdgeParams({ ...edgeParams, color })}
                  />
                );
              })}
            </div>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="justify-between"
            onSelect={(e) => e.preventDefault()}
          >
            <Label className="cursor-pointer flex-grow" htmlFor="animated">
              Animated
            </Label>
            <Switch
              id="animated"
              checked={edgeParams.animated}
              onCheckedChange={(newValue) => {
                setEdgeParams({ ...edgeParams, animated: newValue });
              }}
            />
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            <RadioGroup
              value={edgeParams.shape}
              onValueChange={(value) => {
                setEdgeParams({ ...edgeParams, shape: value as EdgeShapes });
              }}
              className="flex gap-3 justify-between h-5 w-full"
            >
              {shapes.map((shape) => (
                <div key={shape} className="flex gap-0.5 items-center">
                  <RadioGroupItem id={shape} value={shape} />
                  <Label htmlFor={shape} className="cursor-pointer">
                    {shape}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default EdgesMenu;
