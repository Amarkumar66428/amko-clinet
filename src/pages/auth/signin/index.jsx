import React, { useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import Cookies from "js-cookie";
import authService from "../../../services/authService";
import { useSnackbar } from "../../../features/snackBar";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import userService from "../../../services/userService";
import { useDispatch } from "react-redux";
import { setUserData } from "../../../reducer/authSlice";
import video from "../../../../public/amko.mp4";

const getTextFieldStyles = (theme) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: "8px",
    "& fieldset": {
      borderColor: "#ccc",
    },
    "&:hover fieldset": {
      borderColor: "#999",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#666",
    },
    "& input": {
      padding: "12px",
      color: theme.palette.text.primary,
    },
  },
});

const Signin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { showSnackbar } = useSnackbar();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleSignIn = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      showSnackbar("Please fill all the fields", "error");
      return;
    }

    try {
      setIsLoading(true);
      const body = { email: form.email, password: form.password };

      
        const response = await authService?.signIn(body);
        if (!response?.data?.token) return;
        Cookies.set("access_token", response?.data?.token, { expires: 1 });
        const userData = await userService.getUserdata();
        if (userData) {
          dispatch(
            setUserData({
              user: userData?.user,
              subscription: userData?.subscription,
            })
          );
          showSnackbar("Login successful", "success");
        navigate("/user/dashboard");
      }
    } catch (error) {
      showSnackbar(error?.message || "Login failed", "error");
      console.error(error);
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
          Sign In
        </Typography>

        <Button
          variant="outlined"
          startIcon={<FcGoogle />}
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
            "&::before, &::after": {
              borderColor: "divider",
            },
          }}
        >
          OR
        </Divider>

        <form style={{ width: "100%" }} onSubmit={handleSignIn}>
          <Box display="flex" flexDirection="column" gap={3}>
            <Box display="flex" flexDirection="column" gap={1}>
              <label
                style={{
                  fontWeight: 500,
                  color: theme.palette.text.primary,
                }}
              >
                Email
              </label>
              <TextField
                variant="outlined"
                placeholder="demo@example.com"
                fullWidth
                sx={getTextFieldStyles(theme)}
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </Box>

            <Box display="flex" flexDirection="column" gap={1}>
              <label
                style={{
                  fontWeight: 500,
                  color: theme.palette.text.primary,
                }}
              >
                Password
              </label>
              <TextField
                type={showPassword ? "text" : "password"}
                variant="outlined"
                placeholder="Enter your password"
                fullWidth
                sx={getTextFieldStyles(theme)}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword((prev) => !prev)}
                        edge="end"
                        sx={{ color: "text.secondary" }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            <Button
              type="submit"
              variant="contained"
              disabled={isLoading}
              startIcon={
                isLoading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : null
              }
              sx={{
                textTransform: "none",
                borderRadius: 2,
                fontWeight: 500,
                px: 2,
                py: 1.2,
                fontSize: "1rem",
                color: "#fff",
                "&:hover": {
                  opacity: 0.9,
                },
                "&:disabled": {
                  color: "#fff",
                },
              }}
              fullWidth
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </Button>
          </Box>
        </form>

        <Typography
          variant="body2"
          sx={{
            color: "text.primary",
            textAlign: "center",
            fontFamily: "Open Sans",
          }}
        >
          Don’t have an account?{" "}
          <Link
            to="/auth/signup"
            style={{
              color: theme.palette.primary.main,
              fontWeight: 500,
              textDecoration: "none",
            }}
          >
            Sign Up
          </Link>
        </Typography>
      </Box>
    </section>
  );
};

export default Signin;
