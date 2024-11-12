"use client";

import {
  createTheme,
  TextInput,
  Select,
  Textarea,
  NumberInput,
} from "@mantine/core";
import classes from "./component.module.css";

export const theme = createTheme({
  activeClassName: classes.active,
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
  },
});
