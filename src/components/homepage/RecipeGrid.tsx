"use client";

import { generateListQueryParams } from "@/libs/helpers";
import { getList } from "@/services/data.service";
import { recipeKeys } from "@/utils";
import {
  Text,
  ActionIcon,
  Center,
  Loader,
  TextInput,
  useMantineTheme,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { IconSearch } from "@tabler/icons-react";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { ColumnFiltersState } from "@tanstack/react-table";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useQueryState } from "nuqs";
import { useRef, useState } from "react";
import InfiniteScroll from "react-infinite-scroller";
import RecipeCard from "../reusable/RecipeCard";
import RecipeFilter from "../reusable/RecipeFilter";

const RecipeGrid = () => {
  const t = useTranslations("Recipe");
  const [q, setQ] = useQueryState("q", { defaultValue: "" });
  const params = useSearchParams();
  const [globalFilter, setGlobalFilter] = useState<string>(
    params.get("q") ?? ""
  );
  const [globalFilterColumns, setGlobalFilterColumns] = useState<string>(
    "id,title,description"
  );
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([
    {
      id: "status",
      value: "SUBMITTED",
    },
  ]);
  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.xs})`);

  const queryClient = useQueryClient();
  const { data, fetchNextPage, hasNextPage } = useInfiniteQuery({
    queryKey: recipeKeys.list({ globalFilter, globalFilterColumns }),
    queryFn: async ({ pageParam }) => {
      const fn = await getList<Recipe>({
        model: "Recipe",
        relations: "user",
        ...generateListQueryParams({
          pagination: { pageSize: 20, pageIndex: pageParam as number },
          globalFilter,
          globalFilterColumns,
          columnFilters,
        }),
      });
      return { ...fn.data, prevPage: pageParam };
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      if (!lastPage.next_page) {
        return undefined;
      }

      return lastPage.prevPage + 1;
    },
  });

  const recipeList =
    data?.pages.reduce((acc: Recipe[], page: ListResult<Recipe>) => {
      return [...acc, ...page.rows];
    }, []) || [];

  const searchRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex flex-col gap-4 mb-12">
      <div className="sticky -mx-2 xs:-mx-4 top-[3.7rem] bg-[var(--mantine-color-body)] z-10 p-2 xs:p-4">
        <RecipeFilter
          ref={searchRef}
          onSubmit={(e) => {
            e.preventDefault();
            queryClient.invalidateQueries({
              queryKey: recipeKeys.lists(),
            });
            setGlobalFilter(searchRef.current?.value || "");
          }}
        />
      </div>
      <InfiniteScroll
        loadMore={() => fetchNextPage()}
        hasMore={hasNextPage}
        loader={
          <Center key={0} className="my-6">
            <Loader color="blue" type="dots" />
          </Center>
        }
      >
        <div className="columns-1 sm:columns-2 gap-4 md:columns-3 space-y-4">
          {recipeList?.map((row, id) => (
            <RecipeCard recipe={row} key={id} hideStatus withStats />
          ))}
        </div>
      </InfiniteScroll>
    </div>
  );
};

export default RecipeGrid;
