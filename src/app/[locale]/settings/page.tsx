import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { NextIntlClientProvider, useMessages } from "next-intl";
import { getTranslations } from "next-intl/server";
import pick from "lodash/pick";
import SettingsContainer from "@/components/settings/SettingsContainer";

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const t = await getTranslations({
    locale,
    namespace: "Settings",
  });

  return {
    title: t("Meta.title"),
    description: t("Meta.description"),
  };
}

export default async function Create() {
  const queryClient = new QueryClient();

  return <CreateContent queryClient={queryClient} />;
}

type TCreateContent = {
  queryClient: QueryClient;
};

function CreateContent({ queryClient }: TCreateContent) {
  const messages = useMessages();

  return (
    <NextIntlClientProvider messages={pick(messages, ["Common", "Settings"])}>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <SettingsContainer className="flex flex-col md:flex-row gap-4 justify-between" />
      </HydrationBoundary>
    </NextIntlClientProvider>
  );
}
