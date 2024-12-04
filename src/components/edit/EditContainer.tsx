"use client";

import { useRouter } from "@/i18n/routing";
import { getData } from "@/services/data.service";
import { cn, recipeKeys } from "@/utils";
import { Box, BoxProps, Button } from "@mantine/core";
import { IconChevronLeft } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import React, { forwardRef } from "react";
import RecipeForm from "../form/RecipeForm";

const EditContainer = forwardRef<HTMLDivElement, BoxProps>((props, ref) => {
  const { className, ...boxProps } = props;
  const tCommon = useTranslations("Common");
  const t = useTranslations("Edit");
  const params = useParams();
  const router = useRouter();

  const recipeData = useQuery({
    queryKey: recipeKeys.detail(params.id as string),
    queryFn: () =>
      getData<Recipe>({
        class: "Recipe",
        id: params.id as string,
        relations: "steps&ingredients",
      }),
    refetchOnReconnect: false,
  });

  return (
    <Box className={cn("", className)} ref={ref} {...boxProps}>
      <Button
        className="self-start rounded-lg"
        leftSection={<IconChevronLeft size={16} />}
        variant="outline"
        size="xs"
        onClick={() => router.back()}
      >
        {tCommon("Button.go_back")}
      </Button>
      <h2 className="font-zzz font-light m-0 text-3xl xs:text-4xl">
        {`${t("title")}: ${recipeData.data?.title || ""}`}
      </h2>
      <RecipeForm
        id="recipe-form"
        noValidate
        className="flex flex-col gap-4 mt-4"
        recipeData={recipeData.data}
      />
    </Box>
  );
});

EditContainer.displayName = "EditContainer";
export default EditContainer;
