"use client";

import { cn } from "@/utils";
import { TextInput, TextInputProps } from "@mantine/core";
import { forwardRef } from "react";

type TFormTextInput = {
  withCounter?: boolean;
  length?: number;
};

const FormTextInput = forwardRef<
  HTMLInputElement,
  TextInputProps & TFormTextInput
>((props, ref) => {
  const { withCounter, length, className, ...inputProps } = props;

  const Counter = () => {
    return inputProps.maxLength ? (
      <span className="mr-4">
        {length}/{inputProps.maxLength}
      </span>
    ) : (
      <span>{length}</span>
    );
  };

  return (
    <TextInput
      className={cn("", className)}
      classNames={{
        input: withCounter ? "pr-16" : "pr-0",
      }}
      ref={ref}
      rightSection={withCounter ? <Counter /> : undefined}
      {...inputProps}
    />
  );
});

FormTextInput.displayName = "FormTextInput";
export default FormTextInput;
