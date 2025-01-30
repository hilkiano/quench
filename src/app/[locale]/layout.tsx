import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { ColorSchemeScript, MantineProvider } from "@mantine/core";
import QueryProvider from "@/libs/query.provider";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { theme } from "@/styles/theme";
import "@/styles/globals.css";
import "@mantine/core/styles.layer.css";
import "@mantine/dropzone/styles.css";
import "@mantine/carousel/styles.css";
import "react-advanced-cropper/dist/style.css";
import "react-advanced-cropper/dist/themes/compact.css";
import "@/styles/layout.css";
import { mulishFont, zzzFont, fredokaFont } from "@/styles/fonts";
import UserProvider from "@/libs/user.provider";
import { ModalsProvider } from "@mantine/modals";
import { headers } from "next/headers";
import { Toaster } from "sonner";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Goose Coffee",
  description: "Goose Coffee",
  generator: "Next.js",
  manifest: "/manifest.json",
  keywords: ["goose-coffee", "goose"],
  authors: [
    {
      name: "hilkiano",
      url: "https://www.linkedin.com/in/hilkia-nohansen/",
    },
  ],
  icons: [
    {
      rel: "apple-touch-icon",
      url: "images/black/android/android-launchericon-144-144.png",
    },
    {
      rel: "icon",
      url: "images/black/android/android-launchericon-144-144.png",
    },
  ],
};

export default async function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!routing.locales.includes(locale as "en" | "id")) {
    notFound();
  }
  const { userData } = getInitialValue();

  return (
    <html lang={locale}>
      <head>
        <ColorSchemeScript />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body
        className={`${fredokaFont.variable} ${zzzFont.variable} ${mulishFont.variable} font-sans antialiased bg-[url('/images/bg.svg')] bg-cover bg-no-repeat bg-center bg-fixed overscroll-none`}
      >
        <Toaster />
        <QueryProvider>
          <NuqsAdapter>
            <UserProvider value={userData}>
              <MantineProvider theme={theme}>
                <ModalsProvider>{children}</ModalsProvider>
              </MantineProvider>
            </UserProvider>
          </NuqsAdapter>
        </QueryProvider>
      </body>
    </html>
  );
}

function getInitialValue() {
  const headersList = headers();
  let userData: Userdata | null = null;

  if (headersList.has("x-userdata")) {
    const userHeaderData = headersList.get("x-userdata");
    const parsedUserData = JSON.parse(userHeaderData ? userHeaderData : "");
    userData = parsedUserData;
  }

  return { userData };
}
