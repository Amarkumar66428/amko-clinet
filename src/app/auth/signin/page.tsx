"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Box, Button, CircularProgress, IconButton, InputAdornment, TextField } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import AuthShell, { FormField, submitSx, textFieldSx } from "@/components/AuthShell";
import authService from "@/lib/authService";
import { setToken } from "@/lib/auth";
import { notify } from "@/lib/notify";

export default function SigninPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });

  const handleSignIn = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      notify("Please fill all the fields", "error");
      return;
    }

    try {
      setIsLoading(true);
      const response = await authService.signIn(form);
      if (!response?.data?.token) return;
      setToken(response.data.token);
      notify("Login successful", "success");
      router.push("/user/dashboard");
    } catch (error) {
      notify(error?.message || "Login failed", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthShell title="Sign In" footerText="Don’t have an account?" footerLink="/auth/signup" footerLabel="Sign Up">
      <form style={{ width: "100%" }} onSubmit={handleSignIn}>
        <Box display="flex" flexDirection="column" gap={3}>
          <FormField label="Email">
            <TextField
              placeholder="demo@example.com"
              fullWidth
              sx={textFieldSx}
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </FormField>

          <FormField label="Password">
            <TextField
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              fullWidth
              sx={textFieldSx}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword((prev) => !prev)} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />
          </FormField>

          <Button
            type="submit"
            variant="contained"
            disabled={isLoading}
            startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}
            sx={submitSx}
            fullWidth
          >
            {isLoading ? "Signing In..." : "Sign In"}
          </Button>
        </Box>
      </form>
    </AuthShell>
  );
}
