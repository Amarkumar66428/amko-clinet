import React, { useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import authService from "../../../services/authService";
import { useSnackbar } from "../../../features/snackBar";
import { useTheme } from "@mui/material/styles";
import video from "../../../../public/amko.mp4";

const Signup = () => {
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  const [isLoading, setIsLoading] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const validatePassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    return regex.test(password);
  };

  const handleSignUp = async () => {
    const { firstName, lastName, email, password } = form;

    if (!firstName || !lastName || !email || !password) {
      showSnackbar("Please fill all the fields", "error");
      return;
    }

    if (!validatePassword(password)) {
      showSnackbar(
        "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character",
        "error",
      );
      return;
    }

    try {
      setIsLoading(true);
      const response = await authService?.signUp({
        firstName,
        lastName,
        email,
        password,
      });
      if (response) {
        showSnackbar("Signup successful", "success");
        navigate("/auth/signin");
      }
    } catch (error) {
      console.error(error);
      showSnackbar(error?.response?.data?.message || "Signup failed", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="welcome-page signup-page">
      <main className="welcome-content">
        <figure>
          <video src={video} autoPlay muted loop />
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
        px={isMobile ? 2 : 4}
        py={6}
        sx={{
          fontFamily: "Open Sans",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            color: "text.primary",
            textAlign: "center",
            fontWeight: 600,
          }}
        >
          Signup
        </Typography>

        <Button
          variant="outlined"
          startIcon={<FcGoogle />}
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
            "&:hover": {
              backgroundColor: "#f5f5f5",
              borderColor: "#aaa",
            },
          }}
        >
          Continue with Google
        </Button>

        <Divider
          sx={{
            width: "100%",
            color: "text.secondary",
            "&::before, &::after": { borderColor: "divider" },
          }}
        >
          OR
        </Divider>

        <Box display="flex" flexDirection="column" gap={2} width="100%">
          {[
            { label: "First Name", field: "firstName", placeholder: "John" },
            { label: "Last Name", field: "lastName", placeholder: "Doe" },
            { label: "Email", field: "email", placeholder: "demo@example.com" },
            {
              label: "Password",
              field: "password",
              placeholder: "********",
              type: "password",
            },
          ].map(({ label, field, placeholder, type = "text" }) => (
            <Box
              key={field}
              sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}
            >
              <label
                style={{
                  fontWeight: 500,
                  color: theme.palette.text.primary,
                }}
              >
                {label}
              </label>
              <TextField
                type={type}
                variant="outlined"
                placeholder={placeholder}
                fullWidth
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                    "& fieldset": { borderColor: "#ccc" },
                    "&:hover fieldset": { borderColor: "#999" },
                    "&.Mui-focused fieldset": { borderColor: "#666" },
                    "& input": { padding: "12px" },
                  },
                  input: { color: theme.palette.text.primary },
                }}
                value={form[field]}
                onChange={(e) => setForm({ ...form, [field]: e.target.value })}
              />
            </Box>
          ))}

          <Button
            variant="contained"
            onClick={handleSignUp}
            sx={{
              textTransform: "none",
              borderRadius: 2,
              fontWeight: 500,
              px: 2,
              py: 1,
              fontSize: "1rem",
              color: "#fff",
              "&:hover": { opacity: 0.9 },
              "&:disabled": { color: "#fff" },
            }}
            fullWidth
            disabled={isLoading}
            startIcon={
              isLoading ? <CircularProgress size={20} color="inherit" /> : null
            }
          >
            Sign Up
          </Button>
        </Box>

        <Typography
          variant="body2"
          sx={{
            color: "text.primary",
            textAlign: "center",
            fontFamily: "Open Sans",
            letterSpacing: "normal",
          }}
        >
          Already have an account?{" "}
          <Link
            to="/auth/signin"
            style={{
              color: theme.palette.primary.main,
              textDecoration: "none",
              fontWeight: 500,
            }}
          >
            Sign In
          </Link>
        </Typography>
      </Box>
    </section>
  );
};

export default Signup;
