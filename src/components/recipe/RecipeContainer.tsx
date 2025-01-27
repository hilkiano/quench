"use client";

import { cn } from "@/utils";
import {
  Avatar,
  Badge,
  Box,
  BoxProps,
  Button,
  Image,
  Text,
} from "@mantine/core";
import { forwardRef } from "react";
import dayjs from "dayjs";
import "dayjs/locale/id";
import localizedFormat from "dayjs/plugin/localizedFormat";
import { useLocale, useTranslations } from "next-intl";
import { IconBrandYoutubeFilled, IconCoffee } from "@tabler/icons-react";
import RecipeIngredients from "./RecipeIngredients";
import RecipeSteps from "./RecipeSteps";

dayjs.extend(localizedFormat);

type TRecipeContainer = {
  recipe: Recipe;
};

const RecipeContainer = forwardRef<HTMLDivElement, BoxProps & TRecipeContainer>(
  (props, ref) => {
    const { className, recipe, ...boxProps } = props;
    const locale = useLocale();
    const tForm = useTranslations("Form");
    const t = useTranslations("Recipe");

    return (
      <Box {...boxProps} ref={ref} className={cn("", className)}>
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="flex flex-col gap-4 w-full sm:w-2/5 shrink-0">
            <Image
              className="rounded-xl"
              src={recipe.image_url}
              alt={`${recipe.title} image`}
            />
            <RecipeIngredients ingredients={recipe.ingredients!} />
          </div>
          <div className="flex flex-col gap-4 grow">
            <Text className="text-2xl sm:text-3xl md:text-4xl font-zzz">
              {recipe.title}
            </Text>
            <div className="flex gap-4 items-center">
              <Avatar
                src={recipe.user?.avatar_url}
                alt={recipe.user?.username}
              />
              <div className="flex flex-col">
                <Text>{recipe.user?.email}</Text>
                <Text className="opacity-60 italic text-xs">
                  {t("updated_at", {
                    date: dayjs(recipe.updated_at).locale(locale).format("ll"),
                  })}
                </Text>
              </div>
            </div>
            <div className="flex gap-2">
              <Badge variant="dot" size="lg" className="font-mulish">
                {tForm(`Recipe.method_${recipe.method?.name.toLowerCase()}`)}
              </Badge>
              {recipe.youtube_url && (
                <div className="flex gap-1 items-center">
                  <IconBrandYoutubeFilled className="opacity-50" />
                  <Text className="text-sm font-mulish">{t("with_video")}</Text>
                </div>
              )}
            </div>
            <Text
              className={cn("", {
                "italic opacity-40": recipe.description === null,
              })}
            >
              {recipe.description ? recipe.description : t("no_description")}
            </Text>
            <RecipeSteps steps={recipe.steps!} />
          </div>
        </div>
      </Box>
    );
  }
);

RecipeContainer.displayName = "RecipeContainer";
export default RecipeContainer;
