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

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const t = await getTranslations({
    locale,
    namespace: "Create",
  });

  return {
    title: t("Meta.title"),
    description: t("Meta.description"),
  };
}

export default async function Create() {
  const queryClient = new QueryClient();

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

  return <CreateContent queryClient={queryClient} />;
}

type TCreateContent = {
  queryClient: QueryClient;
};

function CreateContent({ queryClient }: TCreateContent) {
  const messages = useMessages();

  return (
    <NextIntlClientProvider
      messages={pick(messages, ["Common", "Create", "Form"])}
    >
      <HydrationBoundary state={dehydrate(queryClient)}>
        <CreateContainer />
      </HydrationBoundary>
    </NextIntlClientProvider>
  );
}
