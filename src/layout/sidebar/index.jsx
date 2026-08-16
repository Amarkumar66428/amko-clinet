import { useState } from "react";
import {
  List,
  ListItemButton,
  ListItemText,
  Collapse,
  ListSubheader,
  ListItemIcon,
} from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { appRouters } from "../../router/router.config";

const SideBar = ({ openSideBar }) => {
  const menuItems = appRouters.filter((item) => item.showInMenu);
  const [openMenus, setOpenMenus] = useState({});

  const handleListItemClick = (item) => {
    if (item.subMenu) {
      setOpenMenus((prevOpenMenus) => ({
        ...prevOpenMenus,
        [item.titleKey]: !prevOpenMenus[item.titleKey],
      }));
    }
  };

  return (
    <aside
      className={`sidebar sidebar-mobile ${openSideBar ? "sidebar-open" : ""}`}
    >
      <List
        subheader={
          <ListSubheader
            className="sidebar-title"
            component="h1"
            id="nested-list-subheader"
            sx={{
              backgroundColor: "transparent",
              textAlign: "center",
              marginTop: "1rem",
              padding: "0 2rem",
            }}
          >
            Amko
          </ListSubheader>
        }
      >
        {menuItems.map((parentItem) => {
          const hasSubMenu = parentItem.subMenu;
          const isOpen = openMenus[parentItem.titleKey] || false;

          return (
            <li key={parentItem.titleKey}>
              <ListItemButton
                onClick={() => handleListItemClick(parentItem)}
                sx={{
                  backgroundColor:
                    window.location.pathname === parentItem.path
                      ? "rgba(255, 255, 255, 0.1)"
                      : "transparent",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                  },
                }}
              >
                {parentItem.icon && (
                  <ListItemIcon>{parentItem.icon}</ListItemIcon>
                )}
                <ListItemText primary={parentItem?.title} />
                {hasSubMenu &&
                  (isOpen ? (
                    <ExpandLess
                      sx={(theme) => ({ color: theme.palette.grey[700] })}
                    />
                  ) : (
                    <ExpandMore
                      sx={(theme) => ({ color: theme.palette.grey[700] })}
                    />
                  ))}
              </ListItemButton>
            </li>
          );
        })}
      </List>
    </aside>
  );
};

export default SideBar;
