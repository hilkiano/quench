"use client";

import { forwardRef } from "react";
import {
  ActionIcon,
  AppShell,
  AppShellProps,
  Avatar,
  Button,
  useMantineTheme,
} from "@mantine/core";
import {
  IconArrowLeft,
  IconCirclePlus,
  IconLogin2,
  IconUserCircle,
  IconWriting,
} from "@tabler/icons-react";
import { Link, usePathname, useRouter } from "@/i18n/routing";
import { useUserContext } from "@/libs/user.provider";
import { useHeadroom, useMediaQuery } from "@mantine/hooks";
import { SettingSvg } from "../Svgs";
import { useTranslations } from "next-intl";

type TAppTemplate = {
  children: React.ReactNode;
};

const AppTemplate = forwardRef<HTMLDivElement, AppShellProps & TAppTemplate>(
  ({ children, ...props }, ref) => {
    const t = useTranslations("Common");
    const router = useRouter();
    const pathname = usePathname();
    const theme = useMantineTheme();
    const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.xs})`);

    const SettingNav = () => (
      <ActionIcon variant="transparent" component={Link} href="/settings">
        <SettingSvg width={24} height={24} />
      </ActionIcon>
    );

    const CreateButton = () => (
      <Button
        component={Link}
        href="/create"
        size={isMobile ? "sm" : "md"}
        variant="gradient"
        leftSection={<IconWriting />}
        radius="xl"
      >
        {t("Button.create")}
      </Button>
    );

    const BackNav = () => (
      <ActionIcon
        size="xl"
        variant="transparent"
        aria-label="Go back"
        onClick={() => router.back()}
      >
        <IconArrowLeft size={32} />
      </ActionIcon>
    );

    const pinned = useHeadroom({ fixedAt: 120 });

    return (
      <AppShell
        header={{ height: isMobile ? 60 : 80, offset: false }}
        {...props}
        ref={ref}
      >
        <AppShell.Header
          withBorder={false}
          className="flex justify-between items-center max-w-[1000px] mr-auto ml-auto px-4"
        >
          {pathname !== "/" ? <BackNav /> : <CreateButton />}
          {/* LOGO HERE */}
          <div className="flex gap-4 items-center">
            <SettingNav />
          </div>
        </AppShell.Header>
        <AppShell.Main className="max-w-[1000px] mr-auto ml-auto px-4">
          {children}
        </AppShell.Main>
      </AppShell>
    );
  }
);

AppTemplate.displayName = "AppTemplate";
export default AppTemplate;
