import { Dashboard } from "@mui/icons-material";
import { SUPER_ADMIN, STORE_OWNER } from "../constant/LookupConst.js";
import asyncComponent from "../utils/asyncComponent.jsx";
import React from "react";

export const publicRouters = [
  {
    path: "/",
    component: asyncComponent(() => import("../pages/homePage.jsx")),
    isLayout: false,
    showInMenu: false,
  },
  {
    path: "/auth/signin",
    component: asyncComponent(() => import("../pages/auth/signin/index.jsx")),
    isLayout: false,
    showInMenu: false,
  },
  {
    path: "/auth/signup",
    component: asyncComponent(() => import("../pages/auth/signup/index.jsx")),
    isLayout: false,
    showInMenu: false,
  },
  {
    path: "/amko/builder",
    component: asyncComponent(
      () => import("../pages/user/createStore/storeForm.jsx"),
    ),
    isLayout: false,
    showInMenu: false,
  },
  {
    path: "/amko/billing",
    component: asyncComponent(() => import("../pages/user/bills/maker.jsx")),
    isLayout: false,
    showInMenu: false,
  },
];

export const appRouters = [
  {
    path: "/user/dashboard",
    title: "Dashboard",
    icon: React.createElement(Dashboard),
    component: asyncComponent(
      () => import("../pages/user/dashboard/index.jsx"),
    ),
    isLayout: true,
    showInMenu: true,
  },
];

export const routers = [...publicRouters, ...appRouters];
