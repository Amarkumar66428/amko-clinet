"use client";

import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { ThemeProvider } from "@mui/material/styles";
import theme from "@/lib/theme";
import Notifier from "@/components/Notifier";
import ServerErrorDialog from "@/components/ServerErrorDialog";

export default function Providers({ children }) {
  return (
    <AppRouterCacheProvider>
      <ThemeProvider theme={theme}>
        {children}
        <Notifier />
        <ServerErrorDialog />
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}
