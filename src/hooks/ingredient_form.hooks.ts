"use client";

import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { unitKeys } from "@/utils";
import { getComboboxData } from "@/services/data.service";

function FormSchema() {
  const t = useTranslations("Form");
  return z.object({
    name: z.string().min(1, t("Validation.required")),
    quantity: z.string().min(1, t("Validation.required")),
    unit: z.string().min(1, t("Validation.required")),
  });
}

export type TFormSchema = z.infer<ReturnType<typeof FormSchema>>;

export default function useIngredientForm() {
  const unitsQuery = useQuery({
    queryKey: unitKeys.all,
    queryFn: () =>
      getComboboxData({
        model: "Unit",
        label: "name",
        value: "id",
      }),
  });

  const form = useForm<TFormSchema>({
    resolver: zodResolver(FormSchema()),
    defaultValues: {
      name: "",
      quantity: "",
      unit: "",
    },
  });

  return {
    form,
    queries: {
      unitsQuery,
    },
  };
}
