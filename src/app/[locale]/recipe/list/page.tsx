import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { NextIntlClientProvider, useMessages } from "next-intl";
import { getTranslations } from "next-intl/server";
import pick from "lodash/pick";
import CreateContainer from "@/components/create/CreateContainer";
import { methodKeys, unitKeys } from "@/utils";
import { getComboboxData } from "@/services/data.service";
import { Box } from "@mantine/core";
import RecipeGrid from "@/components/homepage/RecipeGrid";

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const t = await getTranslations({
    locale,
    namespace: "Recipe.List",
  });

  return {
    title: t("Meta.title"),
    description: t("Meta.description"),
  };
}

export default async function RecipeList() {
  const queryClient = new QueryClient();

  return <RecipeListContent queryClient={queryClient} />;
}

type TRecipeListContent = {
  queryClient: QueryClient;
};

function RecipeListContent({ queryClient }: TRecipeListContent) {
  const messages = useMessages();

  return (
    <NextIntlClientProvider messages={pick(messages, ["Common", "Recipe"])}>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Box className="flex flex-col gap-4">
          <RecipeGrid />
        </Box>
      </HydrationBoundary>
    </NextIntlClientProvider>
  );
}
