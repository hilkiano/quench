"use client";

import {
  createTheme,
  TextInput,
  Select,
  Textarea,
  NumberInput,
  Text,
  Button,
  Modal,
} from "@mantine/core";
import classes from "./component.module.css";

export const theme = createTheme({
  activeClassName: classes.active,
  defaultGradient: {
    from: "#f7ba2c",
    to: "#ea5459",
  },
  primaryColor: "orange",
  components: {
    TextInput: TextInput.extend({
      classNames: {
        input: classes.textInput_input,
      },
    }),
    NumberInput: NumberInput.extend({
      classNames: {
        input: classes.numberInput_input,
      },
    }),
    Select: Select.extend({
      classNames: {
        input: classes.select_input,
        dropdown: classes.select_dropdown,
        option: classes.select_option,
      },
      defaultProps: {
        checkIconPosition: "right",
      },
    }),
    Textarea: Textarea.extend({
      classNames: {
        input: classes.textarea_input,
      },
    }),
    Text: Text.extend({
      classNames: {
        root: "opacity-80",
      },
    }),
    Button: Button.extend({
      classNames: {
        label: classes.button_label,
      },
    }),
    Modal: Modal.extend({
      defaultProps: {
        overlayProps: {
          backgroundOpacity: 0.6,
        },
        transitionProps: {
          transition: "fade",
          duration: 250,
        },
      },
      classNames: {
        header: classes.modal_header,
        content: classes.modal_content,
        title: classes.modal_title,
        body: classes.modal_body,
      },
    }),
  },
});
