"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { Button, Divider, Typography, type SxProps, type Theme } from "@mui/material";

const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true">
    <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 13 4 4 13 4 24s9 20 20 20 20-9 20-20c0-1.3-.1-2.6-.4-3.9z" />
    <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
    <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
    <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.6-.4-3.9z" />
  </svg>
);

const liftOnHover = {
  transition: "transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease",
  "&:hover": { transform: "translateY(-1px)" },
};

export const textFieldSx: SxProps<Theme> = {
  "& .MuiOutlinedInput-root": {
    minHeight: 48,
    borderRadius: "10px",
    background: "rgba(255, 255, 255, 0.85)",
    transition: "border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease",
    "&:hover": { background: "#ffffff" },
    "&.Mui-focused": { background: "#ffffff", boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.1)" },
    "& fieldset": { borderColor: "#ccc" },
    "&:hover fieldset": { borderColor: "#999" },
    "&.Mui-focused fieldset": { borderColor: "#666" },
    "& input": { padding: "12px", color: "text.primary" },
  },
};

export const submitSx: SxProps<Theme> = {
  ...liftOnHover,
  textTransform: "none",
  minHeight: 48,
  borderRadius: "10px",
  fontWeight: 500,
  px: 2,
  py: 1.2,
  fontSize: "1rem",
  color: "#fff",
  background: "linear-gradient(135deg, #2563eb, #4f46e5)",
  boxShadow: "0 8px 18px rgba(37, 99, 235, 0.22)",
  "&:hover": {
    transform: "translateY(-1px)",
    opacity: 0.9,
    background: "linear-gradient(135deg, #1d4ed8, #4338ca)",
    boxShadow: "0 10px 22px rgba(37, 99, 235, 0.28)",
  },
  "&:disabled": { color: "#fff" },
};

interface AuthShellProps {
  title: string;
  footerText: string;
  footerLink: string;
  footerLabel: string;
  children: ReactNode;
}

export default function AuthShell({ title, footerText, footerLink, footerLabel, children }: AuthShellProps) {
  return (
    <section className="block min-h-dvh w-full overflow-y-auto bg-[#f4f7fb] min-[901px]:flex min-[901px]:items-stretch min-[901px]:overflow-hidden">
      <div className="relative h-[190px] min-h-[190px] w-full overflow-hidden bg-[#0b1329] after:pointer-events-none after:absolute after:inset-0 after:bg-[linear-gradient(135deg,rgba(7,13,31,0.55),rgba(7,13,31,0.12)_50%,rgba(7,13,31,0.55))] min-[601px]:h-60 min-[601px]:min-h-60 min-[901px]:h-auto min-[901px]:min-h-dvh min-[901px]:w-[55%]">
        <figure className="absolute inset-0 size-full">
          <video src="/amko.mp4" className="block size-full object-cover object-center" autoPlay muted loop playsInline />
        </figure>
      </div>

      <div className="relative z-[2] flex min-h-[calc(100dvh-190px)] w-full flex-col items-center justify-center gap-4 bg-[radial-gradient(circle_at_15%_15%,rgba(59,130,246,0.08),transparent_30%),linear-gradient(145deg,#f8fafc,#eef3f8)] px-5 py-8 min-[601px]:min-h-[calc(100dvh-240px)] min-[601px]:px-6 min-[601px]:py-10 min-[901px]:min-h-dvh min-[901px]:w-[45%] min-[901px]:px-[7%] min-[901px]:py-12 min-[901px]:shadow-[-12px_0_35px_rgba(15,23,42,0.08)]">
        <Typography
          variant="h4"
          sx={{
            mb: 1,
            color: "#0f172a",
            textAlign: "center",
            fontWeight: 700,
            letterSpacing: "-0.6px",
            fontSize: { xs: "1.7rem", sm: "2rem" },
          }}
        >
          {title}
        </Typography>

        <Button
          variant="outlined"
          startIcon={<GoogleIcon />}
          fullWidth
          sx={{
            ...liftOnHover,
            textTransform: "none",
            borderRadius: 2,
            fontWeight: 500,
            px: 2,
            py: 1,
            fontSize: "1rem",
            borderColor: "#ccc",
            color: "black",
            backgroundColor: "white",
            "&:hover": { transform: "translateY(-1px)", backgroundColor: "#f5f5f5", borderColor: "#aaa" },
          }}
        >
          Continue with Google
        </Button>

        <Divider
          sx={{
            width: "100%",
            color: "#94a3b8",
            fontSize: "0.8rem",
            fontWeight: 500,
            "&::before, &::after": { borderColor: "divider" },
          }}
        >
          OR
        </Divider>

        {children}

        <Typography variant="body2" sx={{ color: "text.primary", textAlign: "center" }}>
          {footerText}{" "}
          <Link href={footerLink} className="font-medium text-[#fe7f2d] no-underline transition-colors hover:underline">
            {footerLabel}
          </Link>
        </Typography>
      </div>
    </section>
  );
}

export function FormField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="font-medium">{label}</label>
      {children}
    </div>
  );
}
