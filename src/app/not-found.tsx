"use client";

import { Box, Typography, Button } from "@mui/material";
import { logout } from "@/lib/auth";

export default function NotFound() {
  return (
    <Box
      sx={{
        height: "100vh",
        bgcolor: "background.default",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        px: 3,
        textAlign: "center",
      }}
    >
      <Typography variant="h1" color="error" gutterBottom>
        404
      </Typography>
      <Typography variant="h5" gutterBottom>
        Oops! The page you are looking for does not exist.
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 4, maxWidth: 400 }}>
        The page might have been moved or deleted, or you may have typed the URL incorrectly.
      </Typography>
      <Button variant="contained" onClick={logout}>
        Go to Login
      </Button>
    </Box>
  );
}
