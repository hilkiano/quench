"use client";

import { forwardRef } from "react";
import {
  ActionIcon,
  AppShell,
  AppShellProps,
  Avatar,
  Button,
} from "@mantine/core";
import {
  IconArrowLeft,
  IconCirclePlus,
  IconLogin2,
  IconUserCircle,
} from "@tabler/icons-react";
import { Link, usePathname, useRouter } from "@/i18n/routing";
import { useUserContext } from "@/libs/user.provider";
import { useHeadroom } from "@mantine/hooks";

type TAppTemplate = {
  children: React.ReactNode;
};

const AppTemplate = forwardRef<HTMLDivElement, AppShellProps & TAppTemplate>(
  ({ children, ...props }, ref) => {
    const router = useRouter();
    const { userData } = useUserContext();
    const pathname = usePathname();

    const UserAvatar = () => (
      <Avatar
        component={Link}
        href="/settings"
        name={userData?.user.email}
        color="initials"
        radius="xl"
      >
        <IconUserCircle size="1.5rem" />
      </Avatar>
    );

    const LoginButton = () => (
      <ActionIcon
        id="login-button"
        size="lg"
        variant="transparent"
        aria-label="Login"
        onClick={() => {
          router.push(
            `${process.env.NEXT_PUBLIC_WEB_URL}auth/google?redirect=${pathname}`
          );
        }}
      >
        <IconLogin2 />
      </ActionIcon>
    );

    const CreateButton = () => (
      <ActionIcon
        component={Link}
        href="/create"
        size="lg"
        variant="gradient"
        radius="xl"
      >
        <IconCirclePlus />
      </ActionIcon>
    );

    const BackNav = () => (
      <ActionIcon
        size="xl"
        variant="transparent"
        aria-label="Go back"
        onClick={() => {
          if (pathname.split("/").length > 2) {
            router.back();
          } else {
            router.push("/");
          }
        }}
      >
        <IconArrowLeft size={32} />
      </ActionIcon>
    );

    const pinned = useHeadroom({ fixedAt: 120 });

    return (
      <AppShell
        header={{ height: 60, collapsed: !pinned, offset: false }}
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
            {userData ? <UserAvatar /> : <LoginButton />}
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
