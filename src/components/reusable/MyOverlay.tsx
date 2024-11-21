"use client";

import { cn } from "@/utils";
import { Overlay, OverlayProps } from "@mantine/core";
import React, { forwardRef } from "react";

type TMyOverlay = {
  element?: React.ReactNode;
};

const MyOverlay = forwardRef<HTMLDivElement, OverlayProps & TMyOverlay>(
  (props, ref) => {
    const { element, className, ...overlayProps } = props;

    if (element) {
      return (
        <Overlay className={cn("", className)} {...overlayProps} ref={ref}>
          {element}
        </Overlay>
      );
    }

    return (
      <Overlay className={cn("", className)} {...overlayProps} ref={ref} />
    );
  }
);

MyOverlay.displayName = "MyOverlay";
export default MyOverlay;
