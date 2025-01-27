"use client";

import { cn } from "@/utils";
import { Accordion, Box, BoxProps, Text } from "@mantine/core";
import { useTranslations } from "next-intl";
import { forwardRef } from "react";

type TRecipeIngredients = {
  ingredients: RecipeIngredient[];
};

const RecipeIngredients = forwardRef<
  HTMLDivElement,
  BoxProps & TRecipeIngredients
>((props, ref) => {
  const { ingredients, className, ...boxProps } = props;
  const tCommon = useTranslations("Common");
  const t = useTranslations("Recipe");

  return (
    <Box className={cn("", className)} ref={ref} {...boxProps}>
      <Accordion
        variant="separated"
        classNames={{ item: "rounded-xl bg-neutral-100 dark:bg-neutral-900" }}
      >
        <Accordion.Item key={0} value={"0"}>
          <Accordion.Control>
            <Text className="text-lg sm:text-xl md:text-2xl font-zzz">
              {t("ingredients")}
            </Text>
          </Accordion.Control>
          <Accordion.Panel>
            <Box className="mt-2">
              {ingredients.map((ingredient) => (
                <div className="flex flex-col mt-2" key={ingredient.id}>
                  <Text className="text-lg font-semibold font-mulish opacity-60">
                    {ingredient.name}
                  </Text>
                  <Text className="-mt-2 text-md font-mulish opacity-60">
                    {ingredient.quantity}{" "}
                    {tCommon(`Unit.${ingredient.unit?.name}`)}
                  </Text>
                </div>
              ))}
            </Box>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </Box>
  );
});

RecipeIngredients.displayName = "RecipeIngredients";
export default RecipeIngredients;
