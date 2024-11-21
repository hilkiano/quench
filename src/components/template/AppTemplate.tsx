"use client";

import { forwardRef } from "react";
import {
  ActionIcon,
  AppShell,
  AppShellProps,
  Avatar,
  Button,
  Drawer,
  useMantineTheme,
} from "@mantine/core";
import Image from "next/image";
import {
  IconArrowLeft,
  IconCirclePlus,
  IconLogin,
  IconLogin2,
  IconUserCircle,
  IconWriting,
} from "@tabler/icons-react";
import { Link, usePathname, useRouter } from "@/i18n/routing";
import { useUserContext } from "@/libs/user.provider";
import { useHeadroom, useMediaQuery } from "@mantine/hooks";
import { SettingSvg } from "../Svgs";
import { useTranslations } from "next-intl";
import { cn } from "@/utils";
import BottomNavigation from "./BottomNavigation";
import HeaderMenu from "./HeaderMenu";

type TAppTemplate = {
  children: React.ReactNode;
};

const AppTemplate = forwardRef<HTMLDivElement, AppShellProps & TAppTemplate>(
  ({ children, ...props }, ref) => {
    const t = useTranslations("Common");
    const router = useRouter();
    const pathname = usePathname();
    const { userData } = useUserContext();
    const theme = useMantineTheme();
    const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.xs})`);

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

    const SocialButton = () =>
      userData ? (
        <Image
          className="p-0 rounded-full ring-2 ring-orange-300 dark:ring-orange-500"
          src={userData!.user.avatar_url}
          alt="Bordered avatar"
          width={40}
          height={40}
        />
      ) : (
        <ActionIcon
          size="xl"
          variant="transparent"
          aria-label="Login"
          component={Link}
          href={`${process.env.NEXT_PUBLIC_WEB_URL}auth/google?redirect=${pathname}`}
        >
          <IconLogin2 size={32} />
        </ActionIcon>
      );

    const pinned = useHeadroom({ fixedAt: 120 });

    return (
      <AppShell
        header={{ height: isMobile ? 60 : 80, collapsed: pathname === "/" }}
        {...props}
        ref={ref}
      >
        <AppShell.Header
          withBorder={false}
          className="bg-transparent backdrop-blur-lg border-solid border-b border-0 border-[var(--mantine-color-default-border)]"
        >
          <div className="max-w-[1000px] h-full flex justify-between items-center px-4 mr-auto ml-auto">
            {isMobile ? <BackNav /> : <HeaderMenu />}

            {/* LOGO HERE */}
            <div className="flex gap-4 items-center">
              <SocialButton />
            </div>
          </div>
        </AppShell.Header>
        <AppShell.Main className="max-w-[1000px] mr-auto ml-auto px-4">
          <div className={cn("", { "mt-4 xs:mt-8 pb-20": pathname !== "/" })}>
            {children}
          </div>
          {pathname !== "/" && isMobile && <BottomNavigation />}
        </AppShell.Main>
      </AppShell>
    );
  }
);

AppTemplate.displayName = "AppTemplate";
export default AppTemplate;
