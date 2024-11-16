import useStepForm from "@/hooks/step_form.hooks";
import {
  Button,
  InputDescription,
  InputLabel,
  NumberInput,
  Slider,
} from "@mantine/core";
import { useTranslations } from "next-intl";
import { FormHTMLAttributes, forwardRef, useEffect, useRef } from "react";
import { Controller } from "react-hook-form";
import FormTextarea from "../reusable/FormTextarea";
import { IconHourglass } from "@tabler/icons-react";
import { formatTime } from "@/libs/helpers";

type TStepForm = {
  submitFn: (data: { step: string }) => void;
  data?: { step: string };
  videoDuration?: number;
};

const StepForm = forwardRef<
  HTMLFormElement,
  FormHTMLAttributes<HTMLFormElement> & TStepForm
>(({ submitFn, data, videoDuration, ...props }, ref) => {
  const t = useTranslations("Form");
  const { form } = useStepForm();

  const stepRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (data) {
      form.setValue("step", data.step);
    }
  }, [data, form]);

  return (
    <form
      ref={ref}
      onSubmit={(e) => {
        e.stopPropagation();
        const onSubmit = form.handleSubmit((data) => {
          const payload = {
            step: data.step,
          };
          submitFn(payload);
          form.reset();
        });

        onSubmit(e);
      }}
      {...props}
    >
      <Controller
        control={form.control}
        name="step"
        render={({ field: { onChange, value } }) => (
          <FormTextarea
            value={value}
            onChange={onChange}
            autoComplete="off"
            error={form.formState.errors.step?.message}
            label={t("Recipe.title_step")}
            rows={4}
            ref={stepRef}
            length={stepRef.current?.value.length || 0}
            maxLength={300}
            withCounter
            size="lg"
          />
        )}
      />
      <Controller
        control={form.control}
        name="timer_seconds"
        render={({ field: { onChange, value } }) => (
          <NumberInput
            value={value}
            onValueChange={(values) => {
              onChange(values.formattedValue);
            }}
            valueIsNumericString
            suffix="s"
            error={form.formState.errors.timer_seconds?.message}
            label={t("Recipe.title_timer_seconds")}
            allowNegative={false}
            hideControls
            thousandSeparator
            size="lg"
            leftSection={<IconHourglass />}
          />
        )}
      />
      {videoDuration && (
        <div className="flex flex-col gap-2">
          <InputLabel size="lg">{t("Recipe.title_video_starts_at")}</InputLabel>
          <InputDescription size="lg" className="-mt-2">
            {t("Recipe.description_video_starts_at")}
          </InputDescription>
          <Controller
            control={form.control}
            name="video_starts_at"
            render={({ field: { onChange, value } }) => (
              <Slider
                onChange={onChange}
                value={value ?? undefined}
                label={formatTime(value || 0)}
                max={videoDuration}
                classNames={{
                  label: "z-10",
                }}
              />
            )}
          />
        </div>
      )}

      <Button variant="gradient" type="submit" className="self-end mt-8">
        {t("button_submit")}
      </Button>
    </form>
  );
});

StepForm.displayName = "StepForm";
export default StepForm;
