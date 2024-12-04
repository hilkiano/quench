import { twMerge } from "tailwind-merge";
import { clsx, ClassValue } from "clsx";
import { ColumnFiltersState, PaginationState } from "@tanstack/react-table";

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

export const methodKeys = {
  all: ["method"] as const,
  lists: () => [...methodKeys.all, "list"] as const,
  list: (filters: string) => [...methodKeys.lists(), { filters }] as const,
  details: () => [...methodKeys.all, "detail"] as const,
  detail: (id: number) => [...methodKeys.details(), id] as const,
};

export const recipeKeys = {
  all: ["recipe"] as const,
  lists: () => [...recipeKeys.all, "list"] as const,
  list: (filters: {
    pagination?: PaginationState;
    globalFilter?: string;
    globalFilterColumns?: string;
    columnFilters?: ColumnFiltersState;
  }) => [...recipeKeys.lists(), { ...filters }] as const,
  details: () => [...recipeKeys.all, "detail"] as const,
  detail: (id: string) => [...recipeKeys.details(), id] as const,
};

export const statisticsKeys = {
  all: ["statistics"] as const,
  types: () => [...statisticsKeys.all, "type"] as const,
  type: (id: string) => [...statisticsKeys.types(), id] as const,
};
