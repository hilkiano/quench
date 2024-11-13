"use client";

import {
  ActionIcon,
  Box,
  BoxProps,
  TextInput,
  useMantineTheme,
} from "@mantine/core";
import { forwardRef } from "react";
import { useQueryState } from "nuqs";
import { cn } from "@/utils";
import { useTranslations } from "next-intl";
import { IconSearch } from "@tabler/icons-react";
import { useMediaQuery } from "@mantine/hooks";
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
