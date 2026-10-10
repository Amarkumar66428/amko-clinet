"use client";

import { Button, Dialog, DialogActions, DialogContent, Typography } from "@mui/material";
import { serverErrorStore } from "@/lib/notify";
import { logout } from "@/lib/auth";

export default function ServerErrorDialog() {
  const error = serverErrorStore.useStore();
  const close = () => serverErrorStore.set(null);
  const isServerFault = [500, 502].includes(error?.code ?? 500);

  return (
    <Dialog open={!!error} fullWidth maxWidth="xs">
      <DialogContent sx={{ textAlign: "center", pt: 4 }}>
        <Typography variant="h3" color="error" fontWeight={700}>
          {error?.code || 500}
        </Typography>
        <Typography color="text.secondary" mt={1}>
          {error?.message || "Internal Server Error"}
        </Typography>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "center", pb: 3, gap: 1 }}>
        {isServerFault ? (
          <>
            <Button variant="outlined" onClick={() => window.location.reload()}>
              Refresh
            </Button>
            <Button variant="contained" onClick={close}>
              Cancel
            </Button>
          </>
        ) : (
          <Button variant="contained" onClick={logout}>
            Login
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
