import { WhiteBoardContext } from "@/contexts/whiteboardContext";
import { useContext } from "react";

export const useWhiteBoardContext = () => {
  const context = useContext(WhiteBoardContext);
  if (!context) {
    throw new Error(
      "useWhiteBoardContext must be used within a WhiteBoardProvider"
    );
  }
  return context;
};
