import useRecipeForm, { TFormSchema } from "@/hooks/recipe_form.hooks";
import { Button, ComboboxItem, Paper, Select } from "@mantine/core";
import { useTranslations } from "next-intl";
import { FormHTMLAttributes, forwardRef, useRef, useState } from "react";
import { Controller, useFieldArray } from "react-hook-form";
import IngredientForm from "./IngredientForm";
import StepSegment from "./StepSegment";
import { useMutation } from "@tanstack/react-query";
import { createRecipe } from "@/services/recipe.service";
import { cleanData } from "@/libs/helpers";
import { toast } from "sonner";
import { useUserContext } from "@/libs/user.provider";
import FormTextInput from "../reusable/FormTextField";
import FormTextarea from "../reusable/FormTextarea";
import VideoPlayer from "../reusable/VideoPlayer";
import YouTubePlayer from "react-player/youtube";
import FormFileInput from "../reusable/FormFileInput";

const RecipeForm = forwardRef<
  HTMLFormElement,
  FormHTMLAttributes<HTMLFormElement>
>(({ ...props }, ref) => {
  const tCommon = useTranslations("Common");
  const t = useTranslations("Form");
  const { form, queries } = useRecipeForm();
  const [loading, setLoading] = useState(false);
  const { userData } = useUserContext();
  const [youtubeUrl, setYoutubeUrl] = useState<string>();
  const [duration, setDuration] = useState<number>();

  const titleRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);

  const loadYoutubeVideo = () => {
    form.trigger("youtube_url").then((res) => {
      if (res) {
        setYoutubeUrl(form.getValues("youtube_url"));
      } else {
        setYoutubeUrl(undefined);
      }
    });
  };

  const LoadVideoButton = () => {
    return (
      <Button
        size="xs"
        variant="light"
        radius="xl"
        onClick={() => loadYoutubeVideo()}
      >
        {tCommon("Button.load")}
      </Button>
    );
  };

  const ingredientsArray = useFieldArray({
    control: form.control,
    keyName: "ingredient_field_id",
    name: "ingredients",
  });

  const stepsArray = useFieldArray({
    control: form.control,
    keyName: "step_field_id",
    name: "steps",
  });

  const appendIngredient = (data: {
    name: string;
    quantity: number;
    unit: number;
  }) => {
    ingredientsArray.append(data);
  };

  const reorderStep = (data: TFormSchema) => {
    const ordered = data.steps.map((s, i) => {
      s.order = i + 1;

      return s;
    });

    form.setValue("steps", ordered);
  };

  const create = useMutation({
    mutationFn: createRecipe,
    onMutate: () => {
      setLoading(true);
    },
    onSettled: () => setLoading(false),
  });

  const playerRef = useRef<YouTubePlayer>(null);

  const handleCreate = () => {
    if (!userData) {
      document.getElementById("login-button")?.click();
      return false;
    }

    const data = form.getValues();
    const payload = cleanData({
      title: data.title,
      description: data.description || undefined,
      ingredients: data.ingredients,
      steps: data.steps,
    });

    toast.promise(create.mutateAsync(payload), {
      loading: tCommon("Toast.loading"),
      success: (data) => {
        form.reset();
        return t.rich("Recipe.success_added", {
          emp: (chunks) => <span className="font-bold">{chunks}</span>,
          name: data.title,
        });
      },
      error: (error: Error) => {
        return tCommon("Toast.error", {
          message: error.message,
        });
      },
    });
  };

  return (
    <>
      <form
        ref={ref}
        onSubmit={form.handleSubmit((data) => {
          reorderStep(data);
          handleCreate();
        })}
        {...props}
      >
        <div className="flex flex-col gap-6 sm:flex-row w-full">
          <div className="flex flex-col gap-4 w-full sm:w-1/2">
            <Controller
              control={form.control}
              name="method_id"
              render={({ field: { onChange, value } }) => (
                <Select
                  allowDeselect={false}
                  value={value}
                  onChange={onChange}
                  error={form.formState.errors.method_id?.message}
                  label={t("Recipe.title_method_id")}
                  size="lg"
                  data={
                    queries.methodQuery.data?.map((i) => {
                      const item = i as ComboboxItem;
                      return {
                        label: t(`Recipe.method_${item.label.toLowerCase()}`),
                        value: item.value.toString(),
                      };
                    }) || []
                  }
                />
              )}
            />
            <Controller
              control={form.control}
              name="title"
              render={({ field: { onChange, value } }) => (
                <FormTextInput
                  value={value}
                  onChange={onChange}
                  autoComplete="off"
                  error={form.formState.errors.title?.message}
                  label={t("Recipe.title_label")}
                  size="lg"
                  length={titleRef.current?.value.length || 0}
                  maxLength={255}
                  withCounter
                  ref={titleRef}
                />
              )}
            />
            <Controller
              control={form.control}
              name="description"
              render={({ field: { onChange, value } }) => (
                <FormTextarea
                  size="lg"
                  value={value || ""}
                  onChange={onChange}
                  autoComplete="off"
                  error={form.formState.errors.description?.message}
                  label={t("Recipe.title_description")}
                  rows={4}
                  ref={descriptionRef}
                />
              )}
            />
          </div>
          <div className="flex flex-col gap-4 w-full sm:w-1/2">
            <Controller
              control={form.control}
              name="image"
              render={({ field: { onChange, value } }) => (
                <FormFileInput
                  clearable
                  label="Cover image"
                  onChange={onChange}
                  value={value}
                  size="lg"
                  accept="image/png,image/jpeg"
                  withPreview={form.getValues("image")}
                  error={form.formState.errors.image?.message}
                />
              )}
            />
            <Paper className="p-4 rounded-xl shadow-lg bg-neutral-200/50 dark:bg-neutral-700/20">
              <Controller
                control={form.control}
                name="youtube_url"
                render={({ field: { onChange, value } }) => (
                  <FormTextInput
                    value={value}
                    onChange={(e) => {
                      if (e.target.value === "") {
                        form.resetField("youtube_url");
                        loadYoutubeVideo();
                        setDuration(undefined);
                      }

                      onChange(e);
                    }}
                    autoComplete="off"
                    size="lg"
                    error={form.formState.errors.youtube_url?.message}
                    label={t("Recipe.title_youtube_url")}
                    rightSection={<LoadVideoButton />}
                    classNames={{
                      input: "pr-20",
                      section: "w-auto mr-2",
                    }}
                  />
                )}
              />
            </Paper>
            {youtubeUrl ? (
              <div className="player-wrapper">
                <VideoPlayer
                  onReady={() => setDuration(playerRef.current?.getDuration())}
                  ref={playerRef}
                  width="100%"
                  url={youtubeUrl}
                />
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>

        <IngredientForm
          ingredientsArray={ingredientsArray}
          submitFn={appendIngredient}
          className={`p-4 rounded-xl shadow-lg mt-4 h-[200px] ${
            form.formState.errors.ingredients
              ? "bg-red-200/50 dark:bg-red-700/30 border-2 border-solid border-red-500"
              : "bg-neutral-200/50 dark:bg-neutral-700/20"
          }`}
        />

        <StepSegment
          className={`p-4 h-[600px] xs:h-[440px] rounded-xl shadow-lg mt-4 flex flex-col gap-4 ${
            form.formState.errors.steps
              ? "bg-red-200/50 dark:bg-red-700/30 border-2 border-solid border-red-500"
              : "bg-neutral-200/50 dark:bg-neutral-700/20"
          }`}
          stepsArray={stepsArray}
          duration={duration}
        />

        <div className="my-8 w-full flex justify-end">
          <Button
            variant="gradient"
            type="submit"
            className="w-full xs:w-auto"
            size="lg"
            loading={loading}
          >
            {t("button_submit")}
          </Button>
        </div>
      </form>
    </>
  );
});

RecipeForm.displayName = "RecipeForm";
export default RecipeForm;
