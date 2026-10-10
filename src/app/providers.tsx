"use client";

import type { ReactNode } from "react";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter";
import { ThemeProvider } from "@mui/material/styles";
import theme from "@/lib/theme";
import Notifier from "@/components/Notifier";
import ServerErrorDialog from "@/components/ServerErrorDialog";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    // enableCssLayer puts MUI styles in `@layer mui` so Tailwind utilities can override them.
    <AppRouterCacheProvider options={{ enableCssLayer: true }}>
      <ThemeProvider theme={theme}>
        {children}
        <Notifier />
        <ServerErrorDialog />
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}
