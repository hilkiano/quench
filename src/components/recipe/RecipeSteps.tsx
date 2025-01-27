"use client";

import { cn } from "@/utils";
import { Box, BoxProps, Card, Grid, Text, Button } from "@mantine/core";
import { useTranslations } from "next-intl";
import React, { forwardRef } from "react";
import RecipeTimer from "./RecipeTimer";

type TRecipeSteps = {
  steps: RecipeStep[];
  youtube_url?: string;
};

const RecipeSteps = forwardRef<HTMLDivElement, BoxProps & TRecipeSteps>(
  (props, ref) => {
    const { steps, youtube_url, className, ...boxProps } = props;
    const t = useTranslations("Recipe");

    return (
      <Box className={cn("mb-12", className)} ref={ref} {...boxProps}>
        <Text className="text-md sm:text-lg md:text-xl font-zzz mb-2">
          {t("steps")}
        </Text>
        <div className="flex flex-col gap-2">
          {steps
            .sort((a, b) => a.order - b.order)
            .map((order) => (
              <Card
                key={order.id}
                className="flex gap-2 rounded-xl shadow-sm"
                withBorder
              >
                <Grid columns={12}>
                  <Grid.Col span={1} className="text-center">
                    <Text className="opacity-60 font-zzz text-xl sm:text-2xl md:text-3xl">
                      {order.order}
                    </Text>
                  </Grid.Col>
                  <Grid.Col span={11} className="flex flex-col gap-4">
                    <Text className="font-mulish text-md sm:text-lg md:text-xl">
                      {order.step}
                    </Text>
                    <div className="self-start">
                      {order.timer_seconds ? (
                        <RecipeTimer
                          timer={order.timer_seconds}
                          className="flex items-center gap-2"
                        />
                      ) : (
                        <></>
                      )}
                    </div>
                  </Grid.Col>
                </Grid>
              </Card>
            ))}
        </div>
      </Box>
    );
  }
);

RecipeSteps.displayName = "RecipeSteps";
export default RecipeSteps;
