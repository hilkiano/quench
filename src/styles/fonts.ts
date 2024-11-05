import localFont from "next/font/local";

export const mulishFont = localFont({
  src: [
    {
      path: "../../public/fonts/mulish.ttf",
    },
  ],
  variable: "--font-mulish",
});
