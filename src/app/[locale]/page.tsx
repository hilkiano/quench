import HomepageContainer from "@/components/homepage/HomepageContainer";
import { getList } from "@/services/data.service";
import { recipeKeys } from "@/utils";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import pick from "lodash/pick";
import { NextIntlClientProvider, useMessages } from "next-intl";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const t = await getTranslations({
    locale,
    namespace: "Homepage",
  });

  return {
    title: t("Meta.title"),
    description: t("Meta.description"),
  };
}

export default async function Homepage() {
  const queryClient = new QueryClient();

  return <HomepageContent queryClient={queryClient} />;
}

type THomepageContent = {
  queryClient: QueryClient;
};

function HomepageContent({ queryClient }: THomepageContent) {
  const messages = useMessages();

  return (
    <NextIntlClientProvider
      messages={pick(messages, ["Common", "Homepage", "Settings", "Profile"])}
    >
      <HydrationBoundary state={dehydrate(queryClient)}>
        <HomepageContainer />
      </HydrationBoundary>
    </NextIntlClientProvider>
  );
}
