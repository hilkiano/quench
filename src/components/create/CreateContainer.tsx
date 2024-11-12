"use client";

import { Box, BoxProps } from "@mantine/core";
import { forwardRef } from "react";
import RecipeForm from "../form/RecipeForm";
import { useTranslations } from "next-intl";

const CreateContainer = forwardRef<HTMLDivElement, BoxProps>(
  ({ ...props }, ref) => {
    const t = useTranslations("Create");
    return (
      <Box {...props} ref={ref}>
        <h2 className="m-0 text-3xl xs:text-4xl">{t("title")}</h2>
        <RecipeForm
          id="recipe-form"
          noValidate
          className="flex flex-col gap-4 mt-4"
        />
      </Box>
    );
  }
);

CreateContainer.displayName = "CreateContainer";
export default CreateContainer;
