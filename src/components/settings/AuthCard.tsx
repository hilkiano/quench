"use client";

import {
  Button,
  Paper,
  PaperProps,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { forwardRef } from "react";
import { cn, statisticsKeys } from "@/utils";
import { useLocale, useTranslations } from "next-intl";
import { useUserContext } from "@/libs/user.provider";
import { useMediaQuery } from "@mantine/hooks";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { getStatistics } from "@/services/data.service";

const AuthCard = forwardRef<HTMLDivElement, PaperProps>((props, ref) => {
  const t = useTranslations("Profile");
  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.xs})`);
  const locale = useLocale();
  const { userData } = useUserContext();

  const { className, ...paperProps } = props;

  const query = useQuery({
    queryKey: statisticsKeys.type("user"),
    queryFn: () =>
      getStatistics({
        type: "user",
        user_id: userData?.user.id,
      }),
  });

  const statistics = [
    {
      label: "Submitted recipe",
      value: query.data?.data.user.submitted_recipe || 0,
    },
    {
      label: "Tried recipe",
      value: query.data?.data.user.tried_recipe || 0,
    },
  ];

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
    </div>
  );

  const StatisticSection = () => (
    <div className="w-full flex gap-0 flex-col bg-neutral-100 dark:bg-neutral-800 rounded-b-lg p-4">
      {statistics.map((stat, i) => (
        <div className="flex justify-between items-center" key={i}>
          <Text className="text-lg">{stat.label}</Text>
          <Text className="text-lg font-semibold">
            {Intl.NumberFormat(locale).format(stat.value)}
          </Text>
        </div>
      ))}
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
      <UserSection />
      <StatisticSection />
    </Paper>
  );
});

AuthCard.displayName = "AuthCard";
export default AuthCard;
