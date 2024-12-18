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
import { IconPhoto } from "@tabler/icons-react";

type TFormFileInput = {
  withPreview?: string;
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
          src={withPreview}
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
      classNames: {
        body: "flex",
      },
    });
  };

  const Preview = () =>
    withPreview && <Avatar onClick={showImage} radius="md" src={withPreview} />;

  return (
    <FileInput
      leftSection={withPreview ? <Preview /> : <IconPhoto />}
      className={cn("", className)}
      ref={ref}
      {...inputProps}
    />
  );
});

FormFileInput.displayName = "FormFileInput";
export default FormFileInput;
