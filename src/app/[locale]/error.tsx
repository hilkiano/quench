"use client"; // Error boundaries must be Client Components

import { useRouter } from "@/i18n/routing";
import { Button, Center } from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { useEffect } from "react";

export default function Error({
  error,
}: {
  error: Error & { digest?: string };
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  const router = useRouter();
  const t = useTranslations("Common");

  return (
    <Center className="flex flex-col gap-4">
      <div className="flex flex-col text-center">
        <h2 className="font-bold m-0 text-3xl md:text-4xl">
          {t(`Error.${error.message}_title`)}
        </h2>
        <p className="opacity-75 m-0 text-lg md:text-2xl leading-tight">
          {t(`Error.${error.message}_body`)}
        </p>
      </div>
      <Button
        radius="xl"
        leftSection={<IconArrowLeft />}
        onClick={router.back}
        className="w-full md:w-auto mt-4"
      >
        {t("Button.go_back")}
      </Button>
    </Center>
  );
}
