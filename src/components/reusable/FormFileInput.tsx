import { cn } from "@/utils";
import {
  Avatar,
  FileInput,
  FileInputProps,
  useMantineTheme,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import { forwardRef } from "react";
import Image from "next/image";
import { useMediaQuery } from "@mantine/hooks";

type TFormFileInput = {
  withPreview?: File;
};

const FormFileInput = forwardRef<
  HTMLButtonElement,
  FileInputProps & TFormFileInput
>((props, ref) => {
  const { withPreview, className, ...inputProps } = props;
  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.xs})`);

  const showImage = () => {
    modals.open({
      children: withPreview && (
        <Image
          className="rounded-lg"
          src={URL.createObjectURL(withPreview)}
          alt="cover image"
          sizes="100vw"
          style={{
            width: "100%",
            height: "auto",
          }}
          width={500}
          height={300}
        />
      ),
      withCloseButton: false,
      centered: isMobile,
    });
  };

  const Preview = () =>
    withPreview && (
      <Avatar
        onClick={showImage}
        radius="md"
        src={URL.createObjectURL(withPreview)}
      />
    );

  return (
    <FileInput
      leftSection={withPreview ? <Preview /> : <></>}
      className={cn("", className)}
      ref={ref}
      {...inputProps}
    />
  );
});

FormFileInput.displayName = "FormFileInput";
export default FormFileInput;
