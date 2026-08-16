import React from "react";
import { Box, Typography } from "@mui/material";

const UserHome = () => {
  return (
    <Box sx={{ backgroundColor: "#f8fafc", minHeight: "100vh", px: 2 }}>
      <Typography
        variant="h4"
        fontWeight="bold"
        gutterBottom
        sx={{ mb: 1 }}
        mt={2}
      >
        Dashboard
      </Typography>
      <Typography
        variant="subtitle1"
        color="textSecondary"
        gutterBottom
        sx={{ mb: 4 }}
      >
        Welcome to your dashboard!
      </Typography>
    </Box>
  );
};

export default UserHome;
