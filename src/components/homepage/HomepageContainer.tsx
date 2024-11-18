"use client";

import { Link } from "@/i18n/routing";
import { useUserContext } from "@/libs/user.provider";
import { Box, BoxProps, Card, Center, Text } from "@mantine/core";
import { IconPlus, IconSearch } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { forwardRef } from "react";
import { SettingSvg } from "../Svgs";

const HomepageContainer = forwardRef<HTMLDivElement, BoxProps>(
  ({ ...props }, ref) => {
    const t = useTranslations("Homepage");
    const { userData } = useUserContext();
    return (
      <Box {...props}>
        <Center className="flex flex-col gap-4 h-screen">
          <Text className="text-xl md:text-2xl font-zzz break-all">
            {t.rich("header", {
              user: userData?.user.email || "Guest",
              gradient: (chunks) => (
                <span className="bg-gradient-to-r from-red-600 via-orange-500 to-yellow-400 inline-block text-transparent bg-clip-text">
                  {chunks}
                </span>
              ),
            })}
          </Text>
          <Text className="text-3xl md:text-4xl font-zzz -mt-2">
            {t("subheader")}
          </Text>
          <div className="flex flex-col gap-4 mt-8">
            <Card
              component={Link}
              href="/recipe/list"
              className="rounded-xl max-w-[400px] hover:outline-2 outline outline-offset-4 outline-orange-500 transition-colors"
            >
              <div className="flex gap-4 items-center">
                <IconSearch color="orange" />
                <div className="flex flex-col">
                  <Text className="font-zzz text-lg">Browse Recipe</Text>
                  <Text className="font-mulish leading-tight">
                    Search for recipe that come from various users
                  </Text>
                </div>
              </div>
            </Card>
            <Card
              component={Link}
              href="/create"
              className="rounded-xl max-w-[400px] hover:outline-2 outline outline-offset-4 outline-orange-500 transition-colors"
            >
              <div className="flex gap-4 items-center">
                <IconPlus color="orange" />
                <div className="flex flex-col">
                  <Text className="font-zzz text-lg">Create Recipe</Text>
                  <Text className="font-mulish leading-tight">
                    Create your own recipe and let the others try your creation
                  </Text>
                </div>
              </div>
            </Card>
            <Card
              component={Link}
              href="/settings"
              className="rounded-xl max-w-[400px] hover:outline-2 outline outline-offset-4 outline-orange-500 transition-colors"
            >
              <div className="flex gap-4 items-center">
                <SettingSvg width={18} height={18} />
                <Text className="font-zzz text-lg">Settings</Text>
              </div>
            </Card>
          </div>
        </Center>
      </Box>
    );
  }
);

HomepageContainer.displayName = "HomepageContainer";
export default HomepageContainer;
