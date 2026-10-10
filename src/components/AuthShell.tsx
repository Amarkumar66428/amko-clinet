"use client";

import Link from "next/link";
import { Box, Button, Divider, Typography } from "@mui/material";

const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true">
    <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 13 4 4 13 4 24s9 20 20 20 20-9 20-20c0-1.3-.1-2.6-.4-3.9z" />
    <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
    <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
    <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.6-.4-3.9z" />
  </svg>
);

export const textFieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "8px",
    "& fieldset": { borderColor: "#ccc" },
    "&:hover fieldset": { borderColor: "#999" },
    "&.Mui-focused fieldset": { borderColor: "#666" },
    "& input": { padding: "12px", color: "text.primary" },
  },
};

export const submitSx = {
  textTransform: "none",
  borderRadius: 2,
  fontWeight: 500,
  px: 2,
  py: 1.2,
  fontSize: "1rem",
  color: "#fff",
  "&:hover": { opacity: 0.9 },
  "&:disabled": { color: "#fff" },
};

export default function AuthShell({ title, footerText, footerLink, footerLabel, children }) {
  return (
    <section className="welcome-page signup-page">
      <main className="welcome-content">
        <figure>
          <video src="/amko.mp4" autoPlay muted loop playsInline />
        </figure>
      </main>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        width="100%"
        maxWidth={400}
        mx="auto"
        gap={2}
        px={{ xs: 2, sm: 4 }}
        py={6}
      >
        <Typography variant="h4" sx={{ color: "text.primary", textAlign: "center", fontWeight: 600 }}>
          {title}
        </Typography>

        <Button
          variant="outlined"
          startIcon={<GoogleIcon />}
          fullWidth
          sx={{
            textTransform: "none",
            borderRadius: 2,
            fontWeight: 500,
            px: 2,
            py: 1,
            fontSize: "1rem",
            borderColor: "#ccc",
            color: "black",
            backgroundColor: "white",
            "&:hover": { backgroundColor: "#f5f5f5", borderColor: "#aaa" },
          }}
        >
          Continue with Google
        </Button>

        <Divider sx={{ width: "100%", color: "text.secondary", "&::before, &::after": { borderColor: "divider" } }}>
          OR
        </Divider>

        {children}

        <Typography variant="body2" sx={{ color: "text.primary", textAlign: "center" }}>
          {footerText}{" "}
          <Link href={footerLink} style={{ color: "#fe7f2d", fontWeight: 500, textDecoration: "none" }}>
            {footerLabel}
          </Link>
        </Typography>
      </Box>
    </section>
  );
}

export function FormField({ label, children }) {
  return (
    <Box display="flex" flexDirection="column" gap={1}>
      <label style={{ fontWeight: 500 }}>{label}</label>
      {children}
    </Box>
  );
}
