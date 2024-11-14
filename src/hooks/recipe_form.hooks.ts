"use client";

import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useLocale, useTranslations } from "next-intl";
import { validateYouTubeUrl } from "@/libs/helpers";

function FormSchema() {
  const t = useTranslations("Form");
  const locale = useLocale();

  return z.object({
    id: z.string().nullish(),
    title: z
      .string()
      .min(1, t("Validation.required"))
      .max(
        255,
        t("Validation.max", { max: Intl.NumberFormat(locale).format(255) })
      ),
    description: z.string().nullish(),
    youtube_url: z.string().refine((url) => validateYouTubeUrl(url), {
      message: "Not a valid Youtube URL",
    }),
    steps: z
      .array(
        z.object({
          step: z.string().min(1, t("Validation.required")),
          order: z.number(),
          image: z.custom<File>().nullish(),
        })
      )
      .min(1, t("Validation.required")),
    ingredients: z
      .array(
        z.object({
          name: z.string().min(1, t("Validation.required")),
          quantity: z.number(),
          unit: z.number(),
        })
      )
      .min(1, t("Validation.required")),
  });
}

export type TFormSchema = z.infer<ReturnType<typeof FormSchema>>;

export default function useRecipeForm() {
  const form = useForm<TFormSchema>({
    resolver: zodResolver(FormSchema()),
    defaultValues: {
      title: "",
      description: "",
      youtube_url: "",
      steps: [],
      ingredients: [],
    },
  });

  return {
    form,
  };
}
