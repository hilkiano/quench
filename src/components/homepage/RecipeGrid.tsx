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
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useQueryState } from "nuqs";
import { useState } from "react";
import InfiniteScroll from "react-infinite-scroller";

const RecipeGrid = () => {
  const t = useTranslations("Homepage");
  const [q, setQ] = useQueryState("q", { defaultValue: "" });
  const params = useSearchParams();
  const [globalFilter, setGlobalFilter] = useState<string>(
    params.get("q") ?? ""
  );
  const [globalFilterColumns, setGlobalFilterColumns] = useState<string>(
    "id,title,description"
  );
  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.xs})`);

  const queryClient = useQueryClient();
  const { data, fetchNextPage, hasNextPage } = useInfiniteQuery({
    queryKey: recipeKeys.list({ globalFilter, globalFilterColumns }),
    queryFn: async ({ pageParam }) => {
      const fn = await getList<Recipe>({
        model: "Recipe",
        ...generateListQueryParams({
          pagination: { pageSize: 20, pageIndex: pageParam as number },
          globalFilter,
          globalFilterColumns,
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
    <div className="flex flex-col gap-4 mb-12">
      <Text className="font-zzz text-3xl xs:text-4xl font-light text-center">
        {t("search_placeholder")}
      </Text>
      <div className="sticky -mx-2 xs:-mx-4 top-14 bg-[var(--mantine-color-body)] py-8 z-10 p-2 xs:p-4">
        <TextInput
          size={isMobile ? "md" : "xl"}
          radius="xl"
          value={q || ""}
          onChange={(event) => setQ(event.currentTarget.value)}
          placeholder="Search..."
          rightSection={
            <ActionIcon
              size={isMobile ? "md" : "xl"}
              radius="xl"
              onClick={() => {
                setGlobalFilter(q);
                queryClient.invalidateQueries({ queryKey: recipeKeys.lists() });
              }}
            >
              <IconSearch size={isMobile ? 16 : 24} />
            </ActionIcon>
          }
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
        <div className="columns-1 sm:columns-2 gap-4 md:columns-3 lg:columns-4 space-y-4">
          {recipeList?.map((row, id) => (
            <div
              key={id}
              className="p-4 rounded-lg drop-shadow-sm border-2 border-solid border-slate-300 break-inside-avoid-column"
            >
              {row.title}
            </div>
          ))}
        </div>
      </InfiniteScroll>
    </div>
  );
};

export default RecipeGrid;
