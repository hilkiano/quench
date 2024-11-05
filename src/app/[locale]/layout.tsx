import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { ColorSchemeScript, MantineProvider } from "@mantine/core";
import QueryProvider from "@/libs/queryProvider";
import { theme } from "@/styles/theme";
import "@/styles/globals.css";
import "@mantine/core/styles.layer.css";
import "@/styles/layout.css";
import "@/styles/globals.css";
import { mulishFont } from "@/styles/fonts";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quench",
  description: "Find coffee recipes with ease.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default async function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  return (
    <html lang={locale}>
      <head>
        <ColorSchemeScript />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </head>
      <body className={`${mulishFont.variable} font-sans antialiased`}>
        <QueryProvider>
          <MantineProvider theme={theme}>{children}</MantineProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
