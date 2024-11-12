import { NextIntlClientProvider, useMessages } from "next-intl";
import React from "react";
import pick from "lodash/pick";
import AppTemplate from "@/components/template/AppTemplate";

export default function Template({ children }: { children: React.ReactNode }) {
  const messages = useMessages();

  return (
    <NextIntlClientProvider messages={pick(messages, ["Common"])}>
      <AppTemplate classNames={{ main: "pt-20" }}>{children}</AppTemplate>
    </NextIntlClientProvider>
  );
}
