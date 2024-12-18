"use client";

import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useLocale, useTranslations } from "next-intl";
import { blobToFile, validateYouTubeUrl } from "@/libs/helpers";
import { useQuery } from "@tanstack/react-query";
import { methodKeys } from "@/utils";
import { getComboboxData } from "@/services/data.service";
import { CropperRef } from "react-advanced-cropper";
import { useRef, useState } from "react";

function FormSchema(isUpdate: boolean) {
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
    image: z.custom<File>().refine(
      (file) => {
        if (!isUpdate) {
          return !!file;
        } else {
          return true;
        }
      },
      {
        message: t("Validation.required"),
      }
    ),
    method_id: z.string().min(1, t("Validation.required")),
    steps: z
      .array(
        z.object({
          id: z.number().nullish(),
          step: z.string().min(1, t("Validation.required")),
          order: z.number(),
          timer_seconds: z.number().nullish(),
          video_starts_at: z.number().nullish(),
          video_stops_at: z.number().nullish(),
        })
      )
      .min(1, t("Validation.required")),
    ingredients: z
      .array(
        z.object({
          id: z.number().nullish(),
          name: z.string().min(1, t("Validation.required")),
          quantity: z.number(),
          unit: z.number(),
        })
      )
      .min(1, t("Validation.required")),
  });
}

export type TFormSchema = z.infer<ReturnType<typeof FormSchema>>;

export default function useRecipeForm(isUpdate: boolean) {
  const methodQuery = useQuery({
    queryKey: methodKeys.all,
    queryFn: () =>
      getComboboxData({
        model: "Method",
        label: "name",
        value: "id",
      }),
  });

  const form = useForm<TFormSchema>({
    resolver: zodResolver(FormSchema(isUpdate)),
    defaultValues: {
      title: "",
      description: "",
      youtube_url: "",
      method_id: "1",
      image: undefined,
      steps: [],
      ingredients: [],
    },
  });

  const [uploadedImage, setUploadedImage] = useState<string>();
  const [cropperImage, setCropperImage] = useState<File>();
  const [imageName, setImageName] = useState<string>();
  const cropperRef = useRef<CropperRef>(null);

  const onCrop = () => {
    if (cropperRef.current) {
      const canvas = cropperRef.current.getCanvas();
      if (canvas) {
        canvas.toBlob((blob) => {
          if (blob) {
            form.setValue("image", blobToFile(blob, imageName ?? ""));
          }
        });
      }
    }
  };

  return {
    form,
    queries: {
      methodQuery,
    },
    cropperRef,
    onCrop,
    cropperImage,
    setCropperImage,
    imageName,
    setImageName,
    uploadedImage,
    setUploadedImage,
  };
}
