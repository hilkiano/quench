import { useRouter, usePathname } from "@/i18n/routing";
import { ComboboxData, Select, SelectProps } from "@mantine/core";
import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { forwardRef, startTransition } from "react";

const LocaleToggle = forwardRef<HTMLInputElement, SelectProps>(
  ({ ...props }, ref) => {
    const t = useTranslations("Common");
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const locales: ComboboxData = [
      {
        label: t("en_label"),
        value: "en",
      },
      {
        label: t("id_label"),
        value: "id",
      },
    ];

    return (
      <Select
        allowDeselect={false}
        checkIconPosition="right"
        data={locales}
        value={locale}
        onChange={(value) => {
          const locale = value as "en" | "id";

          startTransition(() => {
            router.replace(`${pathname}?${searchParams.toString()}`, {
              locale: locale,
            });
            router.refresh();
          });
        }}
        {...props}
        ref={ref}
      />
    );
  }
);

LocaleToggle.displayName = "LocaleToggle";
export default LocaleToggle;
