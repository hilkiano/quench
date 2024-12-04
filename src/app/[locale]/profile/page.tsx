import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { NextIntlClientProvider, useMessages } from "next-intl";
import { getTranslations } from "next-intl/server";
import pick from "lodash/pick";
import { Box } from "@mantine/core";
import ProfileContainer from "@/components/profile/ProfileContainer";
import { statisticsKeys } from "@/utils";
import { getStatistics } from "@/services/data.service";

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const t = await getTranslations({
    locale,
    namespace: "Profile",
  });

  return {
    title: t("Meta.title"),
    description: t("Meta.description"),
  };
}

export default async function Profile() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: statisticsKeys.type("user"),
    queryFn: () =>
      getStatistics({
        type: "user",
      }),
  });

  return <ProfileContent queryClient={queryClient} />;
}

type TProfileContent = {
  queryClient: QueryClient;
};

function ProfileContent({ queryClient }: TProfileContent) {
  const messages = useMessages();

  return (
    <NextIntlClientProvider
      messages={pick(messages, ["Common", "Profile", "Recipe"])}
    >
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Box className="flex flex-col gap-4">
          <ProfileContainer className="flex flex-col md:flex-row gap-6 mb-8" />
        </Box>
      </HydrationBoundary>
    </NextIntlClientProvider>
  );
}
