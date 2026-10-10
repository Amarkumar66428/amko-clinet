"use client";

import { Snackbar, Alert } from "@mui/material";
import { snackbarStore } from "@/lib/notify";

export default function Notifier() {
  const snack = snackbarStore.useStore();
  const handleClose = () => snackbarStore.set((prev) => ({ ...prev, open: false }));

  return (
    <Snackbar
      open={snack.open}
      autoHideDuration={3000}
      onClose={handleClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
    >
      <Alert severity={snack.severity} onClose={handleClose} sx={{ width: "100%" }}>
        {snack.message}
      </Alert>
    </Snackbar>
  );
}
