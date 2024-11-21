"use client";

import {
  Box,
  BoxProps,
  Button,
  RemoveScroll,
  Text,
  useMantineColorScheme,
  useMantineTheme,
} from "@mantine/core";
import { forwardRef, useEffect, useState } from "react";
import RecipeForm from "../form/RecipeForm";
import { useTranslations } from "next-intl";
import { useUserContext } from "@/libs/user.provider";
import MyOverlay from "../reusable/MyOverlay";
import { GoogleSvg } from "../Svgs";
import { Link, usePathname } from "@/i18n/routing";
import { useMediaQuery } from "@mantine/hooks";

const CreateContainer = forwardRef<HTMLDivElement, BoxProps>(
  ({ ...props }, ref) => {
    const tCommon = useTranslations("Common");
    const t = useTranslations("Create");
    const { userData } = useUserContext();
    const pathname = usePathname();
    const { colorScheme } = useMantineColorScheme();
    const theme = useMantineTheme();
    const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.xs})`);
    const [showOverlay, setShowOverlay] = useState(false);

    useEffect(() => {
      setShowOverlay(true);
    }, []);

    const LoginContainer = () => (
      <Box className="flex flex-col gap-4 text-center px-4 items-center">
        <Text className="text-2xl xs:text-3xl font-zzz">
          {t("overlay_title")}
        </Text>
        <Text className="text-xl xs:text-2xl leading-none">
          {t("overlay_body")}
        </Text>
        <Button
          leftSection={<GoogleSvg width={18} height={18} />}
          aria-label="Login"
          component={Link}
          href={`${process.env.NEXT_PUBLIC_WEB_URL}auth/google?redirect=${pathname}`}
          className="mt-6"
          variant="default"
          radius="md"
          size={isMobile ? "sm" : "md"}
        >
          {tCommon("Button.login_google")}
        </Button>
      </Box>
    );

    return (
      <Box {...props} ref={ref}>
        {!userData && showOverlay && (
          <RemoveScroll removeScrollBar={false}>
            <MyOverlay
              color={
                colorScheme === "dark" || colorScheme === "auto"
                  ? "#000"
                  : "#fff"
              }
              center
              zIndex={5}
              fixed
              backgroundOpacity={0.5}
              blur={8}
              element={<LoginContainer />}
            />
          </RemoveScroll>
        )}

        <h2 className="font-zzz font-light m-0 text-3xl xs:text-4xl">
          {t("title")}
        </h2>
        <RecipeForm
          id="recipe-form"
          noValidate
          className="flex flex-col gap-4 mt-4"
        />
      </Box>
    );
  }
);

CreateContainer.displayName = "CreateContainer";
export default CreateContainer;
