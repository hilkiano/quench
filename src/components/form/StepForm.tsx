import useStepForm from "@/hooks/step_form.hooks";
import {
  Button,
  InputDescription,
  InputLabel,
  NumberInput,
  Slider,
} from "@mantine/core";
import { useTranslations } from "next-intl";
import {
  FormHTMLAttributes,
  forwardRef,
  useEffect,
  useRef,
  useState,
} from "react";
import { Controller } from "react-hook-form";
import FormTextarea from "../reusable/FormTextarea";
import { IconHourglass } from "@tabler/icons-react";
import { formatTime } from "@/libs/helpers";

type TStepForm = {
  submitFn: (data: { step: string; timer_seconds?: number }) => void;
  data?: { step: string; timer_seconds: number };
};

const StepForm = forwardRef<
  HTMLFormElement,
  FormHTMLAttributes<HTMLFormElement> & TStepForm
>(({ submitFn, data, ...props }, ref) => {
  const t = useTranslations("Form");
  const { form } = useStepForm();

  const stepRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (data) {
      form.setValue("step", data.step);
      if (data.timer_seconds) {
        form.setValue("timer_seconds", data.timer_seconds);
      }
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
            timer_seconds: data.timer_seconds || undefined,
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
            value={value || undefined}
            onValueChange={(values) => {
              onChange(values.floatValue);
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

      <Button variant="gradient" type="submit" className="self-end mt-8">
        {t("button_submit")}
      </Button>
    </form>
  );
});

StepForm.displayName = "StepForm";
export default StepForm;
