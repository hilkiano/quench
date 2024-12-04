"use client";

import { cn } from "@/utils";
import { Box, BoxProps, Text } from "@mantine/core";
import { useTranslations } from "next-intl";
import React, { forwardRef } from "react";
import AuthCard from "../settings/AuthCard";
import { useUserContext } from "@/libs/user.provider";
import MyRecipeContainer from "./MyRecipeContainer";

const ProfileContainer = forwardRef<HTMLDivElement, BoxProps>((props, ref) => {
  const t = useTranslations("Profile");
  const { className, ...boxProps } = props;
  const { userData } = useUserContext();
  return (
    <Box className={cn("", className)} {...boxProps}>
      <div className="shrink-0 w-full md:w-[320px] flex flex-col gap-4">
        <Text className="text-3xl xs:text-4xl font-light font-zzz">
          {t("title")}
        </Text>
        {userData ? <AuthCard /> : <></>}
      </div>
      {userData ? (
        <MyRecipeContainer className="flex flex-col gap-4 w-full" />
      ) : (
        <></>
      )}
    </Box>
  );
});

ProfileContainer.displayName = "ProfileContainer";
export default ProfileContainer;
