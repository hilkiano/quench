import { twMerge } from "tailwind-merge";
import { clsx, ClassValue } from "clsx";
import { PaginationState } from "@tanstack/react-table";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const unitKeys = {
  all: ["unit"] as const,
  lists: () => [...unitKeys.all, "list"] as const,
  list: (filters: string) => [...unitKeys.lists(), { filters }] as const,
  details: () => [...unitKeys.all, "detail"] as const,
  detail: (id: number) => [...unitKeys.details(), id] as const,
};

export const recipeKeys = {
  all: ["recipe"] as const,
  lists: () => [...recipeKeys.all, "list"] as const,
  list: (filters: {
    pagination?: PaginationState;
    globalFilter?: string;
    globalFilterColumns?: string;
  }) => [...recipeKeys.lists(), { ...filters }] as const,
  details: () => [...recipeKeys.all, "detail"] as const,
  detail: (id: number) => [...recipeKeys.details(), id] as const,
};
