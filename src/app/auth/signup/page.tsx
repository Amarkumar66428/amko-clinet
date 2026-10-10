"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Box, Button, CircularProgress, TextField } from "@mui/material";
import AuthShell, { FormField, submitSx, textFieldSx } from "@/components/AuthShell";
import authService, { EMAIL_RULE, PASSWORD_RULE, type SignUpPayload } from "@/lib/authService";
import { notify } from "@/lib/notify";
import type { ApiError } from "@/lib/api";

const FIELDS: { label: string; field: keyof SignUpPayload; placeholder: string; type?: string }[] = [
  { label: "First Name", field: "firstName", placeholder: "John" },
  { label: "Last Name", field: "lastName", placeholder: "Doe" },
  { label: "Email", field: "email", placeholder: "demo@example.com" },
  { label: "Password", field: "password", placeholder: "********", type: "password" },
];

export default function SignupPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState<SignUpPayload>({ firstName: "", lastName: "", email: "", password: "" });

  const handleSignUp = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (Object.values(form).some((value) => !value)) {
      notify("Please fill all the fields", "error");
      return;
    }
    if (!EMAIL_RULE.test(form.email.trim())) {
      notify("Please enter a valid email address", "error");
      return;
    }
    if (!PASSWORD_RULE.test(form.password)) {
      notify(
        "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character",
        "error",
      );
      return;
    }

    try {
      setIsLoading(true);
      // Registration also signs the user in, so go straight to the dashboard.
      await authService.signUp(form);
      notify("Signup successful", "success");
      router.push("/user/dashboard");
    } catch (error) {
      notify((error as ApiError)?.message || "Signup failed", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthShell title="Signup" footerText="Already have an account?" footerLink="/auth/signin" footerLabel="Sign In">
      <form className="w-full" onSubmit={handleSignUp}>
        <Box display="flex" flexDirection="column" gap={2}>
          {FIELDS.map(({ label, field, placeholder, type = "text" }) => (
            <FormField key={field} label={label}>
              <TextField
                type={type}
                placeholder={placeholder}
                fullWidth
                sx={textFieldSx}
                value={form[field]}
                onChange={(e) => setForm({ ...form, [field]: e.target.value })}
              />
            </FormField>
          ))}

          <Button
            type="submit"
            variant="contained"
            disabled={isLoading}
            startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}
            sx={submitSx}
            fullWidth
          >
            Sign Up
          </Button>
        </Box>
      </form>
    </AuthShell>
  );
}
