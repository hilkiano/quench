"use client";

import { Box, BoxProps, Button, Paper, Text } from "@mantine/core";
import { forwardRef } from "react";
import { useTranslations } from "next-intl";
import { IconLanguage, IconLogout2, IconSunMoon } from "@tabler/icons-react";
import ColorSchemeSelector from "./ColorSchemeSelector";
import LocaleToggle from "./LocaleToggle";
import { useUserContext } from "@/libs/user.provider";
import { useMutation } from "@tanstack/react-query";
import { handleLogout } from "@/services/auth.service";
import { useRouter } from "@/i18n/routing";
import { modals } from "@mantine/modals";

const SettingsContainer = forwardRef<HTMLDivElement, BoxProps>(
  ({ ...props }, ref) => {
    const tCommon = useTranslations("Common");
    const t = useTranslations("Settings");
    const router = useRouter();

    const { userData, setUserData } = useUserContext();

    const logout = useMutation({
      mutationFn: handleLogout,
      onSuccess: (res) => {
        if (res.status) {
          router.push("/");
          setUserData(null);
        }
      },
    });

    const showLogoutConfirmation = () => {
      modals.openConfirmModal({
        withCloseButton: false,
        title: t("items_title_logout"),
        children: (
          <div className="flex flex-col items-center justify-center gap-4 mb-12">
            <Text className="leading-none text-xl font-mulish font-bold">
              {tCommon("are_you_sure")}
            </Text>
          </div>
        ),
        labels: {
          confirm: tCommon("Button.yes"),
          cancel: tCommon("Button.no"),
        },
        confirmProps: {
          radius: "xl",
          color: "red",
        },
        cancelProps: {
          variant: "transparent",
          color: "default",
        },
        centered: true,
        classNames: {
          header: "justify-center",
        },
        onCancel: () => {},
        onConfirm: () => logout.mutate(),
      });
    };

    const settings: SettingItem[] = [
      {
        label: t("label_application"),
        show: true,
        items: [
          {
            title: t("items_title_theme"),
            description: t("items_desc_theme"),
            icon: <IconSunMoon />,
            handler: (
              <ColorSchemeSelector
                size="lg"
                className="w-full xs:w-auto self-start md:self-auto"
              />
            ),
          },
          {
            title: t("items_title_language"),
            description: t("items_desc_language"),
            icon: <IconLanguage />,
            handler: (
              <LocaleToggle
                size="lg"
                className="w-full xs:w-auto self-start md:self-auto"
              />
            ),
          },
        ],
      },
      {
        label: t("label_session"),
        show: !!userData,
        items: [
          {
            title: t("items_title_logout"),
            description: t("items_desc_logout"),
            icon: <IconLogout2 />,
            handler: (
              <Button
                radius="md"
                color="red"
                variant="light"
                className="w-full xs:w-auto self-start md:self-auto"
                onClick={showLogoutConfirmation}
              >
                {t("items_title_logout")}
              </Button>
            ),
          },
        ],
      },
    ];

    return (
      <Box {...props} ref={ref}>
        <div className="shrink-0 w-full md:w-[320px] flex flex-col gap-4">
          <h2 className="font-zzz antialiased opacity-80 m-0 text-3xl xs:text-4xl font-light">
            {t("title")}
          </h2>
          {/* <AuthCard /> */}
        </div>

        <div className="flex flex-col gap-4 w-full">
          {settings
            .filter((setting) => setting.show)
            .map((setting, i) => (
              <Box key={i}>
                <Text className="font-mulish font-extrabold text-lg xs:text-xl mb-2">
                  {setting.label}
                </Text>
                {setting.items.map((item, j) => (
                  <Paper
                    key={j}
                    className="p-4 mb-4 rounded-xl shadow-md border-2 border-solid border-neutral-100 dark:border-neutral-700"
                    withBorder
                  >
                    <div className="flex items-start md:items-center md:flex-row flex-col gap-4 justify-between">
                      <div className="flex items-center flex-row gap-4 shrink-0">
                        {item.icon}
                        <div>
                          <Text className="text-lg font-mulish font-extrabold">
                            {item.title}
                          </Text>
                          <Text className="text-md opacity-75">
                            {item.description}
                          </Text>
                        </div>
                      </div>
                      {item.handler}
                    </div>
                  </Paper>
                ))}
              </Box>
            ))}
        </div>
      </Box>
    );
  }
);

SettingsContainer.displayName = "SettingsContainer";
export default SettingsContainer;
