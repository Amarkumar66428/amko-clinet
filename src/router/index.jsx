import React, { memo } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Box } from "@mui/material";
import Cookies from "js-cookie";
import ProtectedRoute from "./ProtectedRoutes";
import AppLayout from "../layout";
import NotFoundPage from "../components/pageNotFound";
import { publicRouters, appRouters } from "./router.config";
import { SUPER_ADMIN } from "../constant/LookupConst";

const AppRouter = () => {
  return (
    <Routes>
      {/* Public Routes */}
      {publicRouters.map(({ path, component }) => (
        <Route
          key={path}
          path={path}
          element={React.createElement(component)}
        />
      ))}

      {/* Protected Routes with Optional Layout */}
      {appRouters.map(
        ({ path, component, isLayout, role }) => {
          const content = React.createElement(component);
          const wrappedContent = isLayout ? (
            <AppLayout>
              <Box
                sx={{
                  width: "100%",
                  height: "100vh",
                  backgroundColor: "#f9fafb",
                  overflow: "auto",
                }}
              >
                {content}
              </Box>
            </AppLayout>
          ) : (
            content
          );

          return (
            <Route
              key={path}
              path={path}
              element={
                <ProtectedRoute
                  role={role}
                >
                  {wrappedContent}
                </ProtectedRoute>
              }
            />
          );
        }
      )}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default memo(AppRouter);
