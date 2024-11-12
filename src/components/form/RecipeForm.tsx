import useRecipeForm, { TFormSchema } from "@/hooks/recipe_form.hooks";
import { Button, Textarea, TextInput } from "@mantine/core";
import { useTranslations } from "next-intl";
import React, { FormHTMLAttributes, forwardRef, useState } from "react";
import { Controller, useFieldArray } from "react-hook-form";
import IngredientForm from "./IngredientForm";
import StepSegment from "./StepSegment";
import { useMutation } from "@tanstack/react-query";
import { createRecipe } from "@/services/recipe.service";
import { cleanData } from "@/libs/helpers";
import { toast } from "sonner";
import { useUserContext } from "@/libs/user.provider";

const RecipeForm = forwardRef<
  HTMLFormElement,
  FormHTMLAttributes<HTMLFormElement>
>(({ ...props }, ref) => {
  const tCommon = useTranslations("Common");
  const t = useTranslations("Form");
  const { form } = useRecipeForm();
  const [loading, setLoading] = useState(false);
  const { userData } = useUserContext();

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
        <Controller
          control={form.control}
          name="title"
          render={({ field: { onChange, value } }) => (
            <TextInput
              value={value}
              onChange={onChange}
              autoComplete="off"
              error={form.formState.errors.title?.message}
              label={t("Recipe.title_label")}
              size="lg"
            />
          )}
        />
        <Controller
          control={form.control}
          name="description"
          render={({ field: { onChange, value } }) => (
            <Textarea
              value={value || ""}
              onChange={onChange}
              autoComplete="off"
              error={form.formState.errors.description?.message}
              label={t("Recipe.title_description")}
              rows={4}
            />
          )}
        />

        <IngredientForm
          ingredientsArray={ingredientsArray}
          submitFn={appendIngredient}
          className={`p-4 mt-4 h-[200px] ${
            form.formState.errors.ingredients ? "border-red-500" : ""
          }`}
        />

        <StepSegment
          className={`p-4 h-[600px] xs:h-[400px] flex flex-col ${
            form.formState.errors.steps ? "border-red-500" : ""
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
    </>
  );
});

RecipeForm.displayName = "RecipeForm";
export default RecipeForm;
