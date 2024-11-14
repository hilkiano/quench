import localFont from "next/font/local";

export const mulishFont = localFont({
  src: [
    {
      path: "../../public/fonts/mulish.ttf",
    },
  ],
  variable: "--font-mulish",
});

export const fredokaFont = localFont({
  src: [
    {
      path: "../../public/fonts/fredoka.ttf",
    },
  ],
  variable: "--font-fredoka",
});

export const zzzFont = localFont({
  src: [
    {
      path: "../../public/fonts/zzz.ttf",
    },
  ],
  variable: "--font-zzz",
});
