import { BoxProps } from "@mantine/core";
import { forwardRef } from "react";

const HomepageContainer = forwardRef<HTMLDivElement, BoxProps>(() => {
  return <div>HomepageContainer</div>;
});

HomepageContainer.displayName = "HomepageContainer";
export default HomepageContainer;
