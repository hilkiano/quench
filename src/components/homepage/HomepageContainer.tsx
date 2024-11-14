"use client";

import { Box, BoxProps } from "@mantine/core";
import { forwardRef } from "react";
import { cn } from "@/utils";
import RecipeGrid from "./RecipeGrid";

const HomepageContainer = forwardRef<HTMLDivElement, BoxProps>(
  ({ ...props }, ref) => {
    return (
      <Box
        className={cn("flex flex-col gap-4", props.className)}
        {...props}
        ref={ref}
      >
        <RecipeGrid />
      </Box>
    );
  }
);

HomepageContainer.displayName = "HomepageContainer";
export default HomepageContainer;
