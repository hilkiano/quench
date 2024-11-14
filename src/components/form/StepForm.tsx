import useStepForm from "@/hooks/step_form.hooks";
import { Button, Textarea } from "@mantine/core";
import { useTranslations } from "next-intl";
import { FormHTMLAttributes, forwardRef, useEffect, useRef } from "react";
import { Controller } from "react-hook-form";
import FormTextarea from "../reusable/FormTextarea";

type TStepForm = {
  submitFn: (data: { step: string }) => void;
  data?: { step: string };
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
      <Button variant="gradient" type="submit" className="self-end mt-8">
        {t("button_submit")}
      </Button>
    </form>
  );
});

StepForm.displayName = "StepForm";
export default StepForm;
