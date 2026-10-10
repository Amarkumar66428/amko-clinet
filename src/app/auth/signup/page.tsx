"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Box, Button, CircularProgress, TextField } from "@mui/material";
import AuthShell, { FormField, submitSx, textFieldSx } from "@/components/AuthShell";
import authService from "@/lib/authService";
import { notify } from "@/lib/notify";

const FIELDS = [
  { label: "First Name", field: "firstName", placeholder: "John" },
  { label: "Last Name", field: "lastName", placeholder: "Doe" },
  { label: "Email", field: "email", placeholder: "demo@example.com" },
  { label: "Password", field: "password", placeholder: "********", type: "password" },
];

const PASSWORD_RULE = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

export default function SignupPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", password: "" });

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (Object.values(form).some((value) => !value)) {
      notify("Please fill all the fields", "error");
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
      if (await authService.signUp(form)) {
        notify("Signup successful", "success");
        router.push("/auth/signin");
      }
    } catch (error) {
      notify(error?.message || "Signup failed", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthShell title="Signup" footerText="Already have an account?" footerLink="/auth/signin" footerLabel="Sign In">
      <form style={{ width: "100%" }} onSubmit={handleSignUp}>
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
