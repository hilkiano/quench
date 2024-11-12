"use client";

import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";

function FormSchema() {
  const t = useTranslations("Form");
  return z.object({
    step: z
      .string()
      .min(1, t("Validation.required"))
      .max(300, t("Validation.max", { max: 300 })),
  });
}

export type TFormSchema = z.infer<ReturnType<typeof FormSchema>>;

export default function useStepForm() {
  const form = useForm<TFormSchema>({
    resolver: zodResolver(FormSchema()),
    defaultValues: {
      step: "",
    },
  });

  return {
    form,
  };
}
