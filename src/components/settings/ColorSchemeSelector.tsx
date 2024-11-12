import {
  ComboboxData,
  MantineColorScheme,
  Select,
  SelectProps,
  useMantineColorScheme,
} from "@mantine/core";
import { useTranslations } from "next-intl";
import React, { forwardRef } from "react";

const ColorSchemeSelector = forwardRef<HTMLInputElement, SelectProps>(
  ({ ...props }, ref) => {
    const t = useTranslations("Common");

    const colorSchemes: ComboboxData = [
      {
        label: t("auto_label"),
        value: "auto",
      },
      {
        label: t("light_label"),
        value: "light",
      },
      {
        label: t("dark_label"),
        value: "dark",
      },
    ];
    const { colorScheme, setColorScheme } = useMantineColorScheme();

    return (
      <Select
        allowDeselect={false}
        data={colorSchemes}
        value={colorScheme}
        onChange={(value) => {
          const scheme = value as MantineColorScheme;
          setColorScheme(scheme);
        }}
        {...props}
        ref={ref}
      />
    );
  }
);

ColorSchemeSelector.displayName = "ColorSchemeSelector";
export default ColorSchemeSelector;
