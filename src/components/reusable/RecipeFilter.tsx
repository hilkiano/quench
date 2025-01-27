"use client";

import { ActionIcon, TextInput } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import React, { FormHTMLAttributes, forwardRef, useState } from "react";

const RecipeFilter = forwardRef<
  HTMLInputElement,
  FormHTMLAttributes<HTMLFormElement>
>((props, ref) => {
  const { ...formProps } = props;
  const [q, setQ] = useState("");
  const t = useTranslations("Common");

  return (
    <form {...formProps}>
      <TextInput
        ref={ref}
        classNames={{
          root: "my-0 xs:my-4",
          input: "rounded-full",
        }}
        size="md"
        name="q"
        value={q}
        onChange={(event) => setQ(event.currentTarget.value)}
        placeholder={t("search_placeholder")}
        rightSection={
          <ActionIcon
            aria-label="Search recipe"
            id="search-recipe-btn"
            size="md"
            radius="xl"
            type="submit"
          >
            <IconSearch size={16} />
          </ActionIcon>
        }
      />
    </form>
  );
});

RecipeFilter.displayName = "RecipeFilter";
export default RecipeFilter;
