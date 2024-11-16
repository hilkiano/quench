"use client";

import {
  Avatar,
  Button,
  Paper,
  PaperProps,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { forwardRef } from "react";
import { cn } from "@/utils";
import { useTranslations } from "next-intl";
import { useUserContext } from "@/libs/user.provider";
import { Link, usePathname, useRouter } from "@/i18n/routing";
import { GoogleSvg, WorriedFaceSvg } from "../Svgs";
import { useMediaQuery } from "@mantine/hooks";
import { useMutation } from "@tanstack/react-query";
import { handleLogout } from "@/services/auth.service";
import { modals } from "@mantine/modals";
import Image from "next/image";

const AuthCard = forwardRef<HTMLDivElement, PaperProps>((props, ref) => {
  const tCommon = useTranslations("Common");
  const t = useTranslations("Settings");
  const pathname = usePathname();
  const router = useRouter();
  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.xs})`);

  const { userData, setUserData } = useUserContext();

  const { className, ...paperProps } = props;

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
          <WorriedFaceSvg width={100} height={100} />
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

  const LoginSection = () => (
    <div className="w-full flex gap-4 flex-col xs:flex-row md:flex-col p-4">
      <div className="flex flex-col gap-4 w-full xs:w-1/2 md:w-full shrink-0">
        <Text className="m-0 font-mulish font-extrabold text-xl xs:text-2xl">
          {t("unauth_title")}
        </Text>
        <Text className="m-0">{t("unauth_description")}</Text>
      </div>
      <Button
        leftSection={<GoogleSvg width={18} height={18} />}
        aria-label="Login"
        component={Link}
        href={`${process.env.NEXT_PUBLIC_WEB_URL}auth/google?redirect=/`}
        className="self-end w-full mt-6"
        variant="default"
        radius="md"
        size={isMobile ? "sm" : "md"}
      >
        {tCommon("Button.login_google")}
      </Button>
    </div>
  );

  const UserSection = () => (
    <div className="w-full flex gap-4 flex-col backdrop-blur-lg rounded-xl p-4">
      <div className="flex flex-col gap-4 w-full shrink-0 items-center">
        <Image
          className="p-1 rounded-full ring-2 ring-orange-300 dark:ring-orange-500"
          src={userData!.user.avatar_url}
          alt="Bordered avatar"
          width={80}
          height={80}
        />
        <Text className="text-white text-lg">{userData?.user.email}</Text>
      </div>
      <Button
        radius="md"
        color="red"
        variant="filled"
        className="w-full"
        onClick={showLogoutConfirmation}
      >
        {t("items_title_logout")}
      </Button>
    </div>
  );

  const bgClass = userData
    ? `bg-center bg-no-repeat bg-blend-multiply bg-cover bg-neutral-400 dark:bg-neutral-600`
    : "border-2 border-solid border-neutral-100 dark:border-neutral-700";

  return (
    <Paper
      className={cn("rounded-xl shadow-lg", className, bgClass)}
      {...paperProps}
      ref={ref}
      styles={{
        root: {
          background: userData ? `url('${userData.user.avatar_url}')` : "",
        },
      }}
    >
      {!userData ? <LoginSection /> : <UserSection />}
    </Paper>
  );
});

AuthCard.displayName = "AuthCard";
export default AuthCard;
