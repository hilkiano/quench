"use client";

import { Link } from "@/i18n/routing";
import { useUserContext } from "@/libs/user.provider";
import {
  Box,
  BoxProps,
  Card,
  Center,
  Text,
  useMantineColorScheme,
  useMantineTheme,
} from "@mantine/core";
import { IconPlus, IconSearch } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { forwardRef, useEffect, useState } from "react";
import { SettingSvg } from "../Svgs";
import Image from "next/image";
import { useMediaQuery } from "@mantine/hooks";
import { cn } from "@/utils";

const HomepageContainer = forwardRef<HTMLDivElement, BoxProps>(
  ({ ...props }, ref) => {
    const tProfile = useTranslations("Profile");
    const tSettings = useTranslations("Settings");
    const t = useTranslations("Homepage");
    const { userData } = useUserContext();
    const theme = useMantineTheme();
    const [image, setImage] = useState<string>(
      "/images/white/windows11/LargeTile.scale-400.png"
    );
    const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.xs})`);
    const { colorScheme } = useMantineColorScheme();

    useEffect(() => {
      if (colorScheme === "dark" || colorScheme === "auto") {
        setImage("/images/white/windows11/LargeTile.scale-400.png");
      } else {
        setImage("/images/black/windows11/LargeTile.scale-400.png");
      }
    }, [colorScheme]);

    return (
      <Box {...props}>
        <Center className="flex flex-col gap-4 h-screen py-6 mb-6">
          <Image
            src={image}
            alt="logo"
            width={isMobile ? 140 : 200}
            height={isMobile ? 140 : 200}
            className="opacity-50"
          />
          <div className="flex flex-col gap-4 ">
            <Text className="text-2xl md:text-3xl font-zzz break-all">
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
          </div>
          <div className="flex flex-col gap-4 mt-8">
            <Card
              component={Link}
              href="/recipe/list"
              className="rounded-xl max-w-[400px] hover:outline-2 outline outline-offset-4 outline-orange-500 drop-shadow-lg hover:drop-shadow-xl"
            >
              <div className="flex gap-4 items-center">
                <IconSearch color="orange" />
                <div className="flex flex-col">
                  <Text className="font-zzz text-lg">
                    {t("menu_browse_recipe")}
                  </Text>
                  <Text className="font-mulish leading-tight">
                    {t("menu_browse_recipe_desc")}
                  </Text>
                </div>
              </div>
            </Card>
            <Card
              component={Link}
              href="/create"
              className="rounded-xl max-w-[400px] hover:outline-2 outline outline-offset-4 outline-orange-500 drop-shadow-lg hover:drop-shadow-xl"
            >
              <div className="flex gap-4 items-center">
                <IconPlus size={40} color="orange" />
                <div className="flex flex-col">
                  <Text className="font-zzz text-lg">
                    {t("menu_create_recipe")}
                  </Text>
                  <Text className="font-mulish leading-tight">
                    {t("menu_create_recipe_desc")}
                  </Text>
                </div>
              </div>
            </Card>
            <Card
              component={Link}
              href="/settings"
              className="rounded-xl max-w-[400px] hover:outline-2 outline outline-offset-4 outline-orange-500 drop-shadow-lg hover:drop-shadow-xl"
            >
              <div className="ml-1 flex gap-4 items-center">
                <SettingSvg width={20} height={20} />
                <Text className="font-zzz text-lg">{tSettings("title")}</Text>
              </div>
            </Card>
            {userData?.user && (
              <Card
                component={Link}
                href="/profile"
                className="rounded-xl max-w-[400px] hover:outline-2 outline outline-offset-4 outline-orange-500 drop-shadow-lg hover:drop-shadow-xl"
              >
                <div className="flex gap-4 items-center">
                  <Image
                    className={cn(
                      "p-0 rounded-full ring-2 ring-orange-300  dark:ring-orange-500"
                    )}
                    src={userData!.user.avatar_url}
                    alt="Bordered avatar"
                    width={32}
                    height={32}
                  />
                  <Text className="font-zzz text-lg">{tProfile("title")}</Text>
                </div>
              </Card>
            )}
          </div>
        </Center>
      </Box>
    );
  }
);

HomepageContainer.displayName = "HomepageContainer";
export default HomepageContainer;
