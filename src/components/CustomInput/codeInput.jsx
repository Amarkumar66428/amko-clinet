import * as React from "react";
import { useRef } from "react";
import PropTypes from "prop-types";
import { Box } from "@mui/system";
import { TextField, useTheme } from "@mui/material";

function CodeInput({
  label = "Invite Code",
  length = 4,
  value,
  onChange,
  separator,
  size,
}) {
  const theme = useTheme();
  const inputRefs = useRef(new Array(length).fill(null));

  const focusInput = (index) => inputRefs.current[index]?.focus();
  const selectInput = (index) => inputRefs.current[index]?.select();

  const handleKeyDown = (event, index) => {
    switch (event.key) {
      case "ArrowLeft":
        event.preventDefault();
        if (index > 0) {
          focusInput(index - 1);
          selectInput(index - 1);
        }
        break;
      case "ArrowRight":
        event.preventDefault();
        if (index < length - 1) {
          focusInput(index + 1);
          selectInput(index + 1);
        }
        break;
      case "Delete": {
        event.preventDefault();
        const updated = value.split("");
        updated[index] = "";
        onChange(updated.join(""));
        break;
      }
      case "Backspace": {
        event.preventDefault();
        const updated = value.split("");
        updated[index] = "";
        onChange(updated.join(""));
        if (index > 0) {
          focusInput(index - 1);
        }
        break;
      }
      default:
        break;
    }
  };

  const handleChange = (event, index) => {
    const char = event.target.value.slice(-1); // Get last entered character
    if (!char.match(/^[a-zA-Z0-9]$/)) return; // Only allow alphanumeric

    const updated = value.split("");
    updated[index] = char.toUpperCase(); // Make it uppercase for invite code style
    onChange(updated.join(""));

    if (index < length - 1) {
      focusInput(index + 1);
    }
  };

  const handlePaste = (event) => {
    event.preventDefault();
    const paste = event.clipboardData.getData("text/plain").slice(0, length);
    const filtered = paste.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();

    const newValue = filtered.padEnd(length, " ").slice(0, length);
    onChange(newValue);
  };

  return (
    <Box
      sx={{
        display: "flex",
        gap: 1,
        alignItems: "flex-start",
        flexDirection: "column",
      }}
    >
      <label
        style={{
          fontWeight: 500,
          marginBottom: 4,
          color: theme.palette.text.primary,
        }}
      >
        {label}
      </label>
      <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
        {Array.from({ length }).map((_, index) => (
          <React.Fragment key={index}>
            <TextField
              inputRef={(el) => (inputRefs.current[index] = el)}
              value={value[index] ?? ""}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onChange={(e) => handleChange(e, index)}
              onPaste={handlePaste}
              inputProps={{
                maxLength: 1,
                style: {
                  textAlign: "center",
                  fontSize: "0.875rem",
                  width: size,
                  height: size,
                },
              }}
              sx={{
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
                  },
                },
                input: {
                  color: theme.palette.text.primary,
                },
              }}
              variant="outlined"
            />
            {index < length - 1 && separator}
          </React.Fragment>
        ))}
      </Box>
    </Box>
  );
}

CodeInput.propTypes = {
  separator: PropTypes.node,
  length: PropTypes.number,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default CodeInput;
