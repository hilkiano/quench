"use client";

import { Box, BoxProps, Button, Paper, Text } from "@mantine/core";
import { forwardRef } from "react";
import { useTranslations } from "next-intl";
import { IconLanguage, IconLogout, IconSunMoon } from "@tabler/icons-react";
import ColorSchemeSelector from "./ColorSchemeSelector";
import LocaleToggle from "./LocaleToggle";
import { modals } from "@mantine/modals";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "@/i18n/routing";
import { handleLogout } from "@/services/auth.service";
import { useUserContext } from "@/libs/user.provider";

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
        title: t("items_title_logout"),
        children: tCommon("are_you_sure"),
        labels: {
          confirm: tCommon("Button.yes"),
          cancel: tCommon("Button.no"),
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
              <ColorSchemeSelector className="w-full xs:w-auto self-start md:self-auto" />
            ),
          },
          {
            title: t("items_title_language"),
            description: t("items_desc_language"),
            icon: <IconLanguage />,
            handler: (
              <LocaleToggle className="w-full xs:w-auto self-start md:self-auto" />
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
            icon: <IconLogout />,
            handler: (
              <Button
                color="red"
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
        <h2 className="m-0 text-3xl xs:text-4xl">{t("title")}</h2>
        <div className="flex flex-col gap-4">
          {settings
            .filter((setting) => setting.show)
            .map((setting, i) => (
              <Box key={i} className="w-full md:w-[640px] ">
                <Text className="text-lg font-bold mb-4">{setting.label}</Text>
                {setting.items.map((item, j) => (
                  <Paper key={j} className="p-4 mb-4 rounded-lg" withBorder>
                    <div className="flex items-start md:items-center md:flex-row flex-col gap-4 justify-between">
                      <div className="flex items-center flex-row gap-4 shrink-0">
                        {item.icon}
                        <div>
                          <Text className="text-lg font-semibold">
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
