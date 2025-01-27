"use client";

import { generateListQueryParams } from "@/libs/helpers";
import { useUserContext } from "@/libs/user.provider";
import { getList } from "@/services/data.service";
import { cn, recipeKeys } from "@/utils";
import {
  ActionIcon,
  Box,
  BoxProps,
  Center,
  Loader,
  Text,
  TextInput,
} from "@mantine/core";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { ColumnFiltersState } from "@tanstack/react-table";
import { forwardRef, useRef, useState } from "react";
import InfiniteScroll from "react-infinite-scroller";
import RecipeCard from "../reusable/RecipeCard";
import { IconSearch } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import RecipeFilter from "../reusable/RecipeFilter";

const MyRecipeContainer = forwardRef<HTMLDivElement, BoxProps>((props, ref) => {
  const { className, ...boxProps } = props;
  const tCommon = useTranslations("Common");
  const t = useTranslations("Profile");
  const { userData } = useUserContext();
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const [globalFilterColumns, setGlobalFilterColumns] = useState<string>(
    "id,title,description"
  );
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([
    {
      id: "created_by",
      value: userData?.user.id,
    },
  ]);
  const queryClient = useQueryClient();
  const { data, fetchNextPage, hasNextPage } = useInfiniteQuery({
    queryKey: recipeKeys.list({
      globalFilter,
      globalFilterColumns,
      columnFilters,
    }),
    queryFn: async ({ pageParam }) => {
      const fn = await getList<Recipe>({
        model: "Recipe",
        relations: "user&meta&comments",
        with_trashed: true,
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
    <Box className={cn("", className)} {...boxProps}>
      <Text className="font-zzz text-lg">{t("my_recipe_title")}</Text>
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
      <InfiniteScroll
        loadMore={() => fetchNextPage()}
        hasMore={hasNextPage}
        loader={
          <Center key={0} className="my-6">
            <Loader color="orange" type="dots" />
          </Center>
        }
      >
        <div className="columns-1 sm:columns-2 gap-4 space-y-4">
          {recipeList?.map((row, id) => (
            <RecipeCard
              hideUser
              recipe={row}
              key={id}
              isOwner={row.created_by === userData?.user.id}
              withStats
            />
          ))}
        </div>
      </InfiniteScroll>
    </Box>
  );
});

MyRecipeContainer.displayName = "MyRecipeContainer";
export default MyRecipeContainer;
