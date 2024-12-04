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
import { useSearchParams } from "next/navigation";
import { useQueryState } from "nuqs";
import { forwardRef, useState } from "react";
import InfiniteScroll from "react-infinite-scroller";
import RecipeCard from "../reusable/RecipeCard";
import { IconSearch } from "@tabler/icons-react";
import { useTranslations } from "next-intl";

const MyRecipeContainer = forwardRef<HTMLDivElement, BoxProps>((props, ref) => {
  const { className, ...boxProps } = props;
  const tCommon = useTranslations("Common");
  const t = useTranslations("Profile");
  const [q, setQ] = useQueryState("q", { defaultValue: "" });
  const { userData } = useUserContext();
  const params = useSearchParams();
  const [globalFilter, setGlobalFilter] = useState<string>(
    params.get("q") ?? ""
  );
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

  return (
    <Box className={cn("", className)} {...boxProps}>
      <Text className="font-zzz text-lg">{t("my_recipe_title")}</Text>
      <form
        onSubmit={(e) => {
          e.preventDefault();

          setGlobalFilter(q);
          queryClient.invalidateQueries({
            queryKey: recipeKeys.list({
              globalFilter,
              globalFilterColumns,
              columnFilters,
            }),
          });
        }}
      >
        <TextInput
          classNames={{
            root: "my-0 xs:my-4",
            input: "rounded-full",
          }}
          size="md"
          value={q || ""}
          onChange={(event) => setQ(event.currentTarget.value)}
          placeholder={tCommon("search_placeholder")}
          rightSection={
            <ActionIcon
              aria-label="Search recipe"
              id="search-recipe-btn"
              size="md"
              radius="xl"
              type="submit"
            >
              <IconSearch size={16} />
            </ActionIcon>
          }
        />
      </form>
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
