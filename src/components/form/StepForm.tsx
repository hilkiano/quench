import useStepForm from "@/hooks/step_form.hooks";
import { Button, Textarea } from "@mantine/core";
import { useTranslations } from "next-intl";
import { FormHTMLAttributes, forwardRef, useEffect } from "react";
import { Controller } from "react-hook-form";

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
          <Textarea
            value={value}
            onChange={onChange}
            autoComplete="off"
            error={form.formState.errors.step?.message}
            label={t("Recipe.title_step")}
            rows={4}
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
