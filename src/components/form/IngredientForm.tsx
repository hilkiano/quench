import useIngredientForm from "@/hooks/ingredient_form.hooks";
import {
  ActionIcon,
  Badge,
  Button,
  Card,
  Center,
  ComboboxItem,
  Modal,
  NumberInput,
  Paper,
  PaperProps,
  Select,
  TextInput,
} from "@mantine/core";
import { Carousel } from "@mantine/carousel";
import { useDisclosure } from "@mantine/hooks";
import {
  IconEdit,
  IconMoodEmptyFilled,
  IconPlus,
  IconTrash,
} from "@tabler/icons-react";
import { useLocale, useTranslations } from "next-intl";
import { forwardRef, useEffect, useState } from "react";
import { Controller, UseFieldArrayReturn } from "react-hook-form";
import { TFormSchema } from "@/hooks/recipe_form.hooks";

type TIngredientForm = {
  ingredientsArray: UseFieldArrayReturn<
    TFormSchema,
    "ingredients",
    "ingredient_field_id"
  >;
  submitFn: (data: { name: string; quantity: number; unit: number }) => void;
};

const IngredientForm = forwardRef<
  HTMLFormElement,
  PaperProps & TIngredientForm
>(({ ingredientsArray, submitFn, ...props }, ref) => {
  const tCommon = useTranslations("Common");
  const t = useTranslations("Form");
  const locale = useLocale();
  const [opened, { open, close }] = useDisclosure(false);
  const { form, queries } = useIngredientForm();
  const [numberQty, setNumberQty] = useState<number>();
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [updateIndex, setUpdateIndex] = useState<number>();

  const getUnitLabel = (id: number) => {
    if (queries.unitsQuery.data) {
      const findUnit = queries.unitsQuery.data.find((i) => {
        const item = i as ComboboxItem;
        return Number(item.value) === id;
      });
      const findUnitAsItem = findUnit as ComboboxItem;
      return findUnitAsItem.label;
    }

    return "unknown";
  };

  const updateIngredient = (
    j: number,
    i: { name: string; quantity: number; unit: number }
  ) => {
    form.setValue("name", i.name);
    form.setValue("quantity", i.quantity.toString());
    form.setValue("unit", i.unit.toString());

    setIsUpdating(true);
    setNumberQty(i.quantity);
    setUpdateIndex(j);

    open();
  };

  return (
    <>
      <Paper withBorder radius="md" {...props}>
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            <p className="m-0 text-sm">{t("Recipe.title_ingredients")}</p>
            <Badge circle>{ingredientsArray.fields.length}</Badge>
          </div>

          <ActionIcon
            aria-label="Add ingredient"
            size="sm"
            radius="xl"
            onClick={open}
          >
            <IconPlus />
          </ActionIcon>
        </div>
        <div className="flex flex-col justify-center h-full">
          {ingredientsArray.fields.length > 0 ? (
            <Carousel
              slideSize={260}
              slideGap="lg"
              slidesToScroll={1}
              containScroll="trimSnaps"
              withControls={false}
              dragFree
              classNames={{
                container: "mt-4 px-1 py-4",
              }}
            >
              {ingredientsArray.fields.map((i, j) => (
                <Carousel.Slide key={i.ingredient_field_id}>
                  <Card shadow="sm" className="relative w-[260px]">
                    <div className="flex items-center gap-2 absolute top-2 right-2">
                      <ActionIcon
                        variant="transparent"
                        radius="xl"
                        onClick={() => updateIngredient(j, i)}
                      >
                        <IconEdit />
                      </ActionIcon>
                      <ActionIcon
                        variant="transparent"
                        radius="xl"
                        color="red"
                        onClick={() => ingredientsArray.remove(j)}
                      >
                        <IconTrash />
                      </ActionIcon>
                    </div>
                    <div className="w-3/4">
                      <p className="m-0 truncate">{i.name}</p>
                      <p className="m-0 opacity-80">
                        {t("Recipe.ingredient_unit", {
                          quantity: Intl.NumberFormat(locale).format(
                            i.quantity
                          ),
                          unit: tCommon(`Unit.${getUnitLabel(i.unit)}`),
                        })}
                      </p>
                    </div>
                  </Card>
                </Carousel.Slide>
              ))}
            </Carousel>
          ) : (
            <Center className="flex flex-col gap-2 opacity-45 text-center">
              <IconMoodEmptyFilled size={36} />
              {t("Recipe.no_data", {
                data: t("Recipe.title_ingredients").toLowerCase(),
              })}
            </Center>
          )}
        </div>
      </Paper>
      <Modal
        opened={opened}
        onClose={() => {
          close();
          form.reset();
          setIsUpdating(false);
        }}
        title={
          isUpdating
            ? t("Recipe.modal_title_update_ingredient")
            : t("Recipe.modal_title_ingredient")
        }
      >
        <form
          className="flex flex-col gap-4"
          id="ingredient-form"
          noValidate
          onSubmit={(e) => {
            e.stopPropagation();
            const onSubmit = form.handleSubmit((data) => {
              const payload = {
                name: data.name,
                unit: Number(data.unit),
                quantity: numberQty || 0,
              };

              if (isUpdating && typeof updateIndex !== "undefined") {
                ingredientsArray.update(updateIndex, payload);
              } else {
                submitFn(payload);
              }

              close();
              form.reset();
              setIsUpdating(false);
            });
            onSubmit(e);
          }}
          ref={ref}
        >
          <Controller
            control={form.control}
            name="name"
            render={({ field: { onChange, value } }) => (
              <TextInput
                value={value}
                onChange={onChange}
                autoComplete="off"
                error={form.formState.errors.name?.message}
                label={t("Recipe.title_name")}
              />
            )}
          />
          <div className="flex flex-row gap-4">
            <Controller
              control={form.control}
              name="quantity"
              render={({ field: { onChange, value } }) => (
                <NumberInput
                  value={value}
                  onValueChange={(values) => {
                    onChange(values.formattedValue);
                    setNumberQty(values.floatValue);
                  }}
                  valueIsNumericString
                  error={form.formState.errors.quantity?.message}
                  label={t("Recipe.title_quantity")}
                  allowNegative={false}
                  hideControls
                  className="w-4/5"
                  thousandSeparator
                />
              )}
            />
            <Controller
              control={form.control}
              name="unit"
              render={({ field: { onChange, value } }) => (
                <Select
                  allowDeselect={false}
                  value={value}
                  onChange={onChange}
                  error={form.formState.errors.unit?.message}
                  label={t("Recipe.title_unit")}
                  data={
                    queries.unitsQuery.data?.map((i) => {
                      const item = i as ComboboxItem;
                      return {
                        label: item.label,
                        value: item.value.toString(),
                      };
                    }) || []
                  }
                />
              )}
            />
          </div>

          <Button variant="gradient" type="submit" className="self-end mt-8">
            {t("button_submit")}
          </Button>
        </form>
      </Modal>
    </>
  );
});

IngredientForm.displayName = "IngredientForm";
export default IngredientForm;
