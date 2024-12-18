import useRecipeForm, { TFormSchema } from "@/hooks/recipe_form.hooks";
import {
  Badge,
  Button,
  ComboboxItem,
  Modal,
  Paper,
  RangeSlider,
  Select,
  TextInput,
} from "@mantine/core";
import { useTranslations } from "next-intl";
import {
  FormHTMLAttributes,
  forwardRef,
  useEffect,
  useRef,
  useState,
} from "react";
import { Controller, useFieldArray } from "react-hook-form";
import IngredientForm from "./IngredientForm";
import StepSegment from "./StepSegment";
import { useMutation } from "@tanstack/react-query";
import { createRecipe, updateRecipe } from "@/services/recipe.service";
import { convertImage, formatTime } from "@/libs/helpers";
import { toast } from "sonner";
import FormTextInput from "../reusable/FormTextField";
import FormTextarea from "../reusable/FormTextarea";
import VideoPlayer from "../reusable/VideoPlayer";
import YouTubePlayer from "react-player/youtube";
import FormFileInput from "../reusable/FormFileInput";
import { useDisclosure } from "@mantine/hooks";
import { OnProgressProps } from "react-player/base";
import { RectangleStencil, Cropper } from "react-advanced-cropper";
import { IconCrop } from "@tabler/icons-react";
import Image from "next/image";
import { useRouter } from "@/i18n/routing";

type TRecipeForm = {
  recipeData?: Recipe;
};

const RecipeForm = forwardRef<
  HTMLFormElement,
  FormHTMLAttributes<HTMLFormElement> & TRecipeForm
>(({ recipeData, ...props }, ref) => {
  const tCommon = useTranslations("Common");
  const t = useTranslations("Form");
  const {
    form,
    queries,
    cropperRef,
    onCrop,
    cropperImage,
    setCropperImage,
    setImageName,
    uploadedImage,
    setUploadedImage,
  } = useRecipeForm(!!recipeData);
  const [loading, setLoading] = useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState<string>();
  const [duration, setDuration] = useState<number>();

  const [opened, { open, close }] = useDisclosure(false);
  const [cropperOpened, { open: cropperOpen, close: cropperClose }] =
    useDisclosure(false);

  const router = useRouter();

  const [timestamps, setTimestamps] = useState<
    {
      step_id: number;
      starts_at: number;
      stops_at: number;
    }[]
  >([]);

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
  const [playing, setPlaying] = useState<boolean>(false);
  const [stopsAt, setStopsAt] = useState<number>();

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

  const update = useMutation({
    mutationFn: updateRecipe,
    onMutate: () => {
      setLoading(true);
    },
    onSettled: () => setLoading(false),
  });

  const playerRef = useRef<YouTubePlayer>(null);

  const handleProgress = (progress: OnProgressProps) => {
    if (stopsAt) {
      if (progress.playedSeconds > stopsAt) {
        setPlaying(false);
      }
    }
  };

  const handleCreate = async () => {
    const data = form.getValues();
    const formData = new FormData();

    formData.append("title", data.title);
    formData.append("method_id", data.method_id);
    if (data.description) {
      formData.append("description", data.description);
    }
    if (data.youtube_url) {
      formData.append("youtube_url", data.youtube_url);
    }
    if (data.image) {
      const convertedImage = await convertImage(
        data.image,
        data.image.name.replace(/\.[^/.]+$/, "")
      )
        .then((result) => {
          return result;
        })
        .catch(() => {
          toast.error("ERR_CONVERT_IMAGE");
          return null;
        });

      formData.append("image", convertedImage!);
    }
    formData.append("steps", JSON.stringify(data.steps));
    formData.append("ingredients", JSON.stringify(data.ingredients));

    toast.promise(create.mutateAsync(formData), {
      loading: tCommon("Toast.loading"),
      success: (data) => {
        form.reset();
        setTimeout(() => {
          document.getElementById("clear-image-btn")?.click();
        }, 100);
        setYoutubeUrl(undefined);
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

  const handleUpdate = async () => {
    const data = form.getValues();

    const formData = new FormData();

    formData.append("id", data.id!);
    formData.append("title", data.title);
    formData.append("method_id", data.method_id);
    if (data.description) {
      formData.append("description", data.description);
    }
    if (data.youtube_url) {
      formData.append("youtube_url", data.youtube_url);
    }
    if (data.image) {
      const convertedImage = await convertImage(
        data.image,
        data.image.name.replace(/\.[^/.]+$/, "")
      )
        .then((result) => {
          return result;
        })
        .catch(() => {
          toast.error("ERR_CONVERT_IMAGE");
          return null;
        });

      formData.append("image", convertedImage!);
    }
    formData.append("steps", JSON.stringify(data.steps));
    formData.append("ingredients", JSON.stringify(data.ingredients));

    toast.promise(update.mutateAsync(formData), {
      loading: tCommon("Toast.loading"),
      success: (data) => {
        router.push("/profile");
        return t.rich("Recipe.success_updated", {
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

  useEffect(() => {
    if (recipeData) {
      setUploadedImage(recipeData.image_url);
      form.setValue("id", recipeData.id);
      form.setValue("title", recipeData.title);
      form.setValue("method_id", String(recipeData.method_id));
      form.setValue("description", recipeData.description);
      form.setValue("youtube_url", recipeData.youtube_url || "");
      form.setValue(
        "ingredients",
        recipeData.ingredients
          ? recipeData.ingredients.map((ingredient) => {
              return {
                id: ingredient.id,
                name: ingredient.name,
                quantity: ingredient.quantity,
                unit: ingredient.unit_id,
              };
            })
          : []
      );
      if (recipeData.steps) {
        form.setValue(
          "steps",
          recipeData.steps.sort((a, b) => a.order - b.order) || []
        );
      }
    }
  }, [form, recipeData, setUploadedImage]);

  return (
    <>
      <form
        ref={ref}
        onSubmit={form.handleSubmit((data) => {
          reorderStep(data);

          if (recipeData) {
            handleUpdate();
          } else {
            handleCreate();
          }
        })}
        {...props}
      >
        <div className="flex flex-col gap-6 sm:flex-row w-full">
          <div className="flex flex-col gap-4 w-full sm:w-1/2 shrink-0">
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
                  onChange={(file) => {
                    if (file) {
                      setImageName(file.name);
                      setCropperImage(file);
                      cropperOpen();
                    } else {
                      setImageName(undefined);
                      setCropperImage(undefined);
                      onChange(file);
                    }
                  }}
                  value={value}
                  size="lg"
                  accept="image/png,image/jpeg"
                  withPreview={
                    form.getValues("image")
                      ? URL.createObjectURL(form.getValues("image"))
                      : uploadedImage
                  }
                  error={form.formState.errors.image?.message}
                  clearButtonProps={{
                    id: "clear-image-btn",
                  }}
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
                        setDuration(undefined);
                      }

                      onChange(e);
                    }}
                    onBlur={() => {
                      loadYoutubeVideo();
                    }}
                    autoComplete="off"
                    size="lg"
                    error={form.formState.errors.youtube_url?.message}
                    label={t("Recipe.title_youtube_url")}
                  />
                )}
              />
            </Paper>
            {youtubeUrl ? (
              <Button
                onClick={() => {
                  stepsArray.fields.map((field, i) => {
                    if (field.video_starts_at && field.video_stops_at) {
                      setTimestamps((prevTimestamps) => {
                        return [
                          ...prevTimestamps,
                          {
                            step_id: i,
                            starts_at: field.video_starts_at!,
                            stops_at: field.video_stops_at!,
                          },
                        ];
                      });
                    }
                  });
                  open();
                }}
              >
                {t("Recipe.btn_set_timestamp")}
              </Button>
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

      <Modal
        opened={opened}
        onClose={() => {
          close();
          setTimestamps([]);
          setPlaying(false);
        }}
        title="Set timestamp"
        size="lg"
      >
        <div className="player-wrapper">
          <VideoPlayer
            onReady={() => setDuration(playerRef.current?.getDuration())}
            ref={playerRef}
            width="100%"
            url={youtubeUrl}
            playing={playing}
            onProgress={handleProgress}
          />
        </div>
        <div className="flex flex-col gap-4 mt-4">
          {stepsArray.fields.map((field, i) => (
            <div
              key={i}
              className="p-4 rounded-lg bg-neutral-300/50 dark:bg-neutral-700/50 drop-shadow-md relative flex flex-col gap-4"
            >
              <Badge
                variant="gradient"
                size="lg"
                className="absolute top-2 font-mulish left-2"
              >
                {t("Recipe.step", { order: i + 1 })}
              </Badge>
              <div className="flex gap-2 absolute top-2 right-2">
                {timestamps.some((timestamp) => timestamp.step_id === i) ? (
                  <Button
                    variant="default"
                    size="xs"
                    radius="xl"
                    onClick={() => {
                      setTimestamps((prevTimestamps) =>
                        prevTimestamps.filter(
                          (timestamp) => timestamp.step_id !== i
                        )
                      );
                    }}
                  >
                    {t("Recipe.btn_remove_timestamp")}
                  </Button>
                ) : (
                  <Button
                    variant="default"
                    size="xs"
                    radius="xl"
                    onClick={() => {
                      setTimestamps((prevTimestamps) => {
                        return [
                          ...prevTimestamps,
                          {
                            step_id: i,
                            starts_at: 0,
                            stops_at: duration || 0,
                          },
                        ];
                      });
                    }}
                  >
                    {t("Recipe.btn_add_timestamp")}
                  </Button>
                )}

                <Button
                  variant="filled"
                  size="xs"
                  radius="xl"
                  disabled={!timestamps.find((t) => t.step_id === i)}
                  onClick={() => {
                    playerRef.current?.seekTo(
                      timestamps.find((t) => t.step_id === i)!.starts_at
                    );
                    setStopsAt(
                      timestamps.find((t) => t.step_id === i)!.stops_at
                    );
                    setPlaying(true);
                  }}
                >
                  {t("Recipe.btn_play")}
                </Button>
              </div>

              <div className="mt-6 line-clamp-2">{field.step}</div>
              {timestamps.some((timestamp) => timestamp.step_id === i) && (
                <>
                  <RangeSlider
                    minRange={0}
                    label={(value) => formatTime(value || 0)}
                    max={duration}
                    defaultValue={[
                      timestamps.find((t) => t.step_id === i)?.starts_at || 0,
                      timestamps.find((t) => t.step_id === i)?.stops_at || 0,
                    ]}
                    onChangeEnd={(value) => {
                      setTimestamps((prevTimestamps) => {
                        const exists = prevTimestamps.some(
                          (timestamp) => timestamp.step_id === i
                        );

                        if (exists) {
                          return prevTimestamps.map((timestamp) =>
                            timestamp.step_id === i
                              ? {
                                  step_id: i,
                                  starts_at: value[0],
                                  stops_at: value[1],
                                }
                              : timestamp
                          );
                        } else {
                          return [
                            ...prevTimestamps,
                            {
                              step_id: i,
                              starts_at: value[0],
                              stops_at: value[1],
                            },
                          ];
                        }
                      });
                    }}
                  />
                  <div className="flex gap-4 w-full">
                    <TextInput
                      readOnly
                      label={t("Recipe.title_video_starts_at")}
                      className="w-full"
                      disabled={!timestamps.find((t) => t.step_id === i)}
                      value={formatTime(
                        timestamps.find((t) => t.step_id === i)?.starts_at || 0
                      )}
                    />
                    <TextInput
                      readOnly
                      label={t("Recipe.title_video_stops_at")}
                      className="w-full"
                      disabled={!timestamps.find((t) => t.step_id === i)}
                      value={formatTime(
                        timestamps.find((t) => t.step_id === i)?.stops_at || 0
                      )}
                    />
                  </div>
                </>
              )}
            </div>
          ))}

          <Button
            className="self-end mt-6 mb-4"
            onClick={() => {
              // Update steps
              stepsArray.fields.map((field, i) => {
                stepsArray.update(i, {
                  ...field,
                  video_starts_at: timestamps.find((t) => t.step_id === i)
                    ?.starts_at,
                  video_stops_at: timestamps.find((t) => t.step_id === i)
                    ?.stops_at,
                });
              });

              setTimestamps([]);
              setPlaying(false);
              close();
            }}
          >
            {t("button_submit")}
          </Button>
        </div>
      </Modal>

      <Modal
        opened={cropperOpened}
        onClose={() => {
          cropperClose();
          setCropperImage(undefined);
          setImageName(undefined);
        }}
        title="Crop Image"
        size="xl"
      >
        {cropperImage ? (
          <div className="relative">
            <Cropper
              ref={cropperRef}
              stencilComponent={RectangleStencil}
              stencilProps={{
                aspectRatio: 1 / 1,
              }}
              src={URL.createObjectURL(cropperImage)}
              className="w-full rounded-xl xs:h-[calc(100vh-350px)] h-[calc(100vh-180px)]"
            />
            <Button
              variant="gradient"
              onClick={() => {
                cropperClose();
                onCrop();
              }}
              leftSection={<IconCrop />}
              className="absolute bottom-2 right-2 rounded-xl"
            >
              {tCommon("Button.crop")}
            </Button>
          </div>
        ) : (
          <></>
        )}
      </Modal>
    </>
  );
});

RecipeForm.displayName = "RecipeForm";
export default RecipeForm;
