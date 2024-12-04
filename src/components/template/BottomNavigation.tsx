import { Link, usePathname } from "@/i18n/routing";
import { useUserContext } from "@/libs/user.provider";
import { cn } from "@/utils";
import { ActionIcon, Box, BoxProps, UnstyledButton } from "@mantine/core";
import {
  IconCirclePlus,
  IconCirclePlusFilled,
  IconHome,
  IconLogin2,
  IconSettings,
  IconSettingsFilled,
  IconUser,
  IconZoom,
  IconZoomFilled,
} from "@tabler/icons-react";
import { forwardRef } from "react";
import Image from "next/image";

const BottomNavigation = forwardRef<HTMLDivElement, BoxProps>((props, ref) => {
  const { className, ...boxProps } = props;

  const { userData } = useUserContext();
  const pathname = usePathname();

  return (
    <Box
      className={cn(
        "fixed z-50 w-[calc(100%-1.5rem)] h-16 max-w-lg -translate-x-1/2 rounded-xl bottom-4 left-1/2 border border-solid border-neutral-300 dark:border-neutral-700 bg-neutral-100/80 dark:bg-neutral-900/80 backdrop-blur-xl",
        className
      )}
      {...boxProps}
    >
      <div className="grid h-full max-w-lg grid-cols-5 mx-auto">
        <UnstyledButton
          aria-label="home navigation"
          type="button"
          className="inline-flex flex-col items-center justify-center px-5 rounded-s-xl group border-0"
          component={Link}
          href="/"
        >
          <IconHome size={32} className="opacity-60" />
        </UnstyledButton>
        <UnstyledButton
          aria-label="browse recipe navigation"
          type="button"
          className="inline-flex flex-col items-center justify-center px-5 rounded-s-xl group border-0"
          component={Link}
          href="/recipe/list"
        >
          {pathname.includes("/recipe/list") ? (
            <IconZoomFilled
              size={32}
              className="opacity-60 text-orange-600 dark:text-orange-500"
            />
          ) : (
            <IconZoom size={32} className="opacity-60" />
          )}
        </UnstyledButton>
        <div className="inline-flex flex-col items-center justify-center">
          <ActionIcon
            aria-label="create recipe navigation"
            type="button"
            component={Link}
            href="/create"
            variant="gradient"
            size="xl"
            className="inline-flex flex-col items-center justify-center"
            radius="xl"
          >
            {pathname.includes("/create") ? (
              <IconCirclePlusFilled size={32} className="opacity-60" />
            ) : (
              <IconCirclePlus size={32} className="opacity-60" />
            )}
          </ActionIcon>
        </div>
        <UnstyledButton
          aria-label="settings navigation"
          type="button"
          className="inline-flex flex-col items-center justify-center px-5 rounded-s-xl group border-0"
          component={Link}
          href="/settings"
        >
          {pathname.includes("/settings") ? (
            <IconSettingsFilled
              size={32}
              className="opacity-60 text-orange-600 dark:text-orange-500"
            />
          ) : (
            <IconSettings size={32} className="opacity-60" />
          )}
        </UnstyledButton>
        <UnstyledButton
          aria-label="profile navigation"
          type="button"
          className="inline-flex flex-col items-center justify-center px-5 rounded-s-xl group border-0"
          component={Link}
          passHref
          href={
            userData
              ? "/profile"
              : `${process.env.NEXT_PUBLIC_WEB_URL}auth/google?redirect=${pathname}`
          }
        >
          {userData ? (
            <Image
              className={cn(
                "p-0 rounded-full ring-2 ring-neutral-300 dark:ring-neutral-500",
                {
                  "ring-orange-300  dark:ring-orange-500":
                    pathname.includes("/profile"),
                }
              )}
              src={userData!.user.avatar_url}
              alt="Bordered avatar"
              width={32}
              height={32}
            />
          ) : (
            <IconLogin2 size={32} className="opacity-60" />
          )}
        </UnstyledButton>
      </div>
    </Box>
  );
});

BottomNavigation.displayName = "BottomNavigation";
export default BottomNavigation;
