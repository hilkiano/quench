import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { NextIntlClientProvider, useMessages } from "next-intl";
import { getTranslations } from "next-intl/server";
import pick from "lodash/pick";
import { methodKeys, recipeKeys, unitKeys } from "@/utils";
import { getComboboxData, getData } from "@/services/data.service";
import EditContainer from "@/components/edit/EditContainer";

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const t = await getTranslations({
    locale,
    namespace: "Edit",
  });

  return {
    title: t("Meta.title"),
    description: t("Meta.description"),
  };
}

export default async function Edit({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) {
  const queryClient = new QueryClient();
  const slug = await params;

  await queryClient.prefetchQuery({
    queryKey: unitKeys.all,
    queryFn: () =>
      getComboboxData({
        model: "Unit",
        label: "name",
        value: "id",
      }),
  });

  await queryClient.prefetchQuery({
    queryKey: methodKeys.all,
    queryFn: () =>
      getComboboxData({
        model: "Method",
        label: "name",
        value: "id",
      }),
  });

  await queryClient.prefetchQuery({
    queryKey: recipeKeys.detail(slug.id),
    queryFn: () =>
      getData<Recipe>({
        class: "Recipe",
        id: slug.id,
        relations: "steps&ingredients",
      }),
  });

  return <EditContent queryClient={queryClient} />;
}

type TEditContent = {
  queryClient: QueryClient;
};

function EditContent({ queryClient }: TEditContent) {
  const messages = useMessages();

  return (
    <NextIntlClientProvider
      messages={pick(messages, ["Common", "Edit", "Form"])}
    >
      <HydrationBoundary state={dehydrate(queryClient)}>
        <EditContainer className="flex flex-col gap-4" />
      </HydrationBoundary>
    </NextIntlClientProvider>
  );
}
