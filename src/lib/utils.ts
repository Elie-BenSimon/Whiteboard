import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Value } from "node_modules/react-calendar/dist/esm/shared/types";
import { Node } from "@xyflow/react";

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};

export const saveNodesToLocalStorage = (nodes: Node[], key: string): void => {
  const prevSavedNodes = JSON.parse(localStorage.getItem(key) || "[]");
  const savedNodesSet = new Set(prevSavedNodes);

  nodes.forEach((node) => {
    localStorage.setItem(`${key}-${node.id}`, JSON.stringify(node));
    savedNodesSet.add(node.id);
  });

  localStorage.setItem(key, JSON.stringify([...savedNodesSet]));
};

export const loadNodesFromLocalStorage = (key: string): Node[] => {
  const savedNodes = localStorage.getItem(key);

  if (savedNodes) {
    const nodeIds = JSON.parse(savedNodes);

    if (Array.isArray(nodeIds)) {
      return nodeIds
        .map((nodeId) => {
          const rawNode = localStorage.getItem(`${key}-${nodeId}`);
          return rawNode ? JSON.parse(rawNode) : null;
        })
        .filter((node) => node !== null) as Node[];
    }
  }

  return [];
};

export const deleteNodesFromLocalStorage = (
  nodes: Node[],
  key: string
): void => {
  const savedNodes = localStorage.getItem(key);

  if (savedNodes) {
    const nodeIds = JSON.parse(savedNodes);

    if (Array.isArray(nodeIds)) {
      const nodeIdsSet = new Set(nodeIds);

      nodes.forEach((node) => {
        localStorage.removeItem(`${key}-${node.id}`);
        nodeIdsSet.delete(node.id);
      });

      localStorage.setItem(key, JSON.stringify([...nodeIdsSet]));
    }
  }
};

export const getRandomColor200 = () => {
  const colors = [
    "bg-red-200",
    "bg-blue-200",
    "bg-green-200",
    "bg-yellow-200",
    "bg-purple-200",
    "bg-pink-200",
    "bg-indigo-200",
    "bg-teal-200",
    "bg-cyan-200",
  ];
  const index = Math.floor(Math.random() * colors.length);

  return colors[index];
};

export const getDateParts = (date?: Value | string) => {
  let parsedDate: Date | undefined;

  if (date instanceof Date) {
    parsedDate = date;
  } else if (typeof date === "string") {
    parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      parsedDate = undefined;
    }
  }

  if (parsedDate) {
    const optionsDay = { weekday: "long" } as const;
    const optionsMonth = { month: "long" } as const;

    const dayNumber = parsedDate.getDate();
    const dayName = parsedDate.toLocaleDateString("fr-FR", optionsDay);
    const monthName = parsedDate.toLocaleDateString("fr-FR", optionsMonth);
    const year = parsedDate.getFullYear();

    return { dayNumber, dayName, monthName, year };
  }

  return { dayNumber: "", dayName: "", monthName: "", year: "" };
};
