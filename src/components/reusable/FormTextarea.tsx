"use client";

import { cn } from "@/utils";
import { Textarea, TextareaProps } from "@mantine/core";
import { forwardRef } from "react";

type TFormTextarea = {
  withCounter?: boolean;
  length?: number;
};

const FormTextarea = forwardRef<
  HTMLTextAreaElement,
  TextareaProps & TFormTextarea
>((props, ref) => {
  const { withCounter, length, className, ...inputProps } = props;

  const Counter = () => {
    return inputProps.maxLength ? (
      <span className="flex self-end mb-2 justify-end mr-6">
        {length}/{inputProps.maxLength}
      </span>
    ) : (
      <span className="flex self-end mb-2 mr-2 justify-end">{length}</span>
    );
  };

  return (
    <Textarea
      className={cn("", className)}
      ref={ref}
      rightSection={withCounter ? <Counter /> : <></>}
      {...inputProps}
    />
  );
});

FormTextarea.displayName = "FormTextarea";
export default FormTextarea;
