import React, { useState, useEffect, useRef } from "react";
import { Box, LinearProgress } from "@mui/material";

const AppLoading = () => {
  const [progress, setProgress] = useState(0);
  const progressRef = useRef(0); // to hold current progress between ticks
  const animationFrameId = useRef(null);

  useEffect(() => {
    const increment = () => {
      progressRef.current += 0.5; // smaller increment for smoothness

      if (progressRef.current >= 92) {
        progressRef.current = 92; // stop at 92%
        setProgress(92);
        cancelAnimationFrame(animationFrameId.current);
        return;
      }

      setProgress(progressRef.current);
      animationFrameId.current = requestAnimationFrame(increment);
    };

    animationFrameId.current = requestAnimationFrame(increment);

    return () => cancelAnimationFrame(animationFrameId.current);
  }, []);

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        zIndex: 1200, // above app bar
      }}
    >
      <LinearProgress variant="determinate" value={progress} color="primary" />
    </Box>
  );
};

export default AppLoading;
