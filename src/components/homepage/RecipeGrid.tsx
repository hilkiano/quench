"use client";

import { generateListQueryParams } from "@/libs/helpers";
import { getList } from "@/services/data.service";
import { recipeKeys } from "@/utils";
import { ActionIcon, Button, TextInput, useMantineTheme } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { IconSearch } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { PaginationState } from "@tanstack/react-table";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useQueryState } from "nuqs";
import React, { useEffect, useState } from "react";

const RecipeGrid = () => {
  const t = useTranslations("Homepage");
  const [data, setData] = useState<Recipe[]>([]);
  const [q, setQ] = useQueryState("q", { defaultValue: "" });
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 20,
  });
  const params = useSearchParams();
  const [globalFilter, setGlobalFilter] = useState<string>(
    params.get("q") ?? ""
  );
  const [globalFilterColumns, setGlobalFilterColumns] = useState<string>(
    "id,title,description"
  );
  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.xs})`);

  const recipeQuery = useQuery({
    queryKey: recipeKeys.list({
      pagination,
      globalFilter,
      globalFilterColumns,
    }),
    queryFn: () =>
      getList<Recipe>({
        model: "Recipe",
        limit: "20",
        ...generateListQueryParams({
          pagination: pagination,
          globalFilter: globalFilter,
          globalFilterColumns: globalFilterColumns,
        }),
      }),
  });

  useEffect(() => {
    if (recipeQuery.data) {
      setData([...(data ?? []), ...recipeQuery.data.data.rows]);
    }
  }, [recipeQuery.data]);

  return (
    <div className="flex flex-col gap-4 mb-12">
      <TextInput
        size={isMobile ? "md" : "xl"}
        radius="xl"
        value={q || ""}
        onChange={(event) => setQ(event.currentTarget.value)}
        placeholder={t("search_placeholder")}
        rightSection={
          <ActionIcon
            size={isMobile ? "md" : "xl"}
            radius="xl"
            onClick={() => {
              setData([]);
              setPagination({
                ...pagination,
                pageIndex: 0,
              });
              setGlobalFilter(q);
            }}
          >
            <IconSearch size={isMobile ? 16 : 24} />
          </ActionIcon>
        }
      />
      <div className="columns-1 sm:columns-2 gap-4 md:columns-3 lg:columns-4 space-y-4">
        {data?.map((row, id) => (
          <div
            key={id}
            className="p-4 rounded-lg drop-shadow-sm border-2 border-solid border-slate-300 break-inside-avoid-column"
          >
            {row.title}
          </div>
        ))}
      </div>
      {data.length > 1 ? (
        <Button
          className="w-full xs:w-auto self-center mt-4"
          loading={recipeQuery.isFetching}
          disabled={!recipeQuery.data?.data.next_page}
          onClick={() =>
            setPagination({
              ...pagination,
              pageIndex: pagination.pageIndex + 1,
            })
          }
        >
          Load more
        </Button>
      ) : (
        <></>
      )}
    </div>
  );
};

export default RecipeGrid;
