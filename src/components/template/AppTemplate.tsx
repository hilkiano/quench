"use client";

import { forwardRef } from "react";
import { AppShell, AppShellProps } from "@mantine/core";

type TAppTemplate = {
  children: React.ReactNode;
};

const AppTemplate = forwardRef<HTMLDivElement, AppShellProps & TAppTemplate>(
  ({ children, ...props }, ref) => {
    return (
      <AppShell {...props}>
        <AppShell.Header></AppShell.Header>
        <AppShell.Main>{children}</AppShell.Main>
      </AppShell>
    );
  }
);

AppTemplate.displayName = "AppTemplate";
export default AppTemplate;
