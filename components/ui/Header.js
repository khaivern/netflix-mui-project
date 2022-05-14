import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import axios from "axios";

import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { constructMagicSDKInstance } from "../../lib/magic-util";


// Specific Styles for this page
const SelectedTabStyles = {
  color: "rgba(255,255,255,0.7)",
  "&.Mui-selected": { color: "#fff" },
  "&:hover": { color: "#fff" },
};

const ListItemButtonStyles = {
  color: "rgba(255,255,255, 0.7)",
  "&.Mui-selected": {
    "& .MuiListItemText-primary": { color: "#fff" },
    backgroundColor: "primary.main",
    "&:hover": { backgroundColor: "primary.light" },
  },
  "&:hover": { backgroundColor: "primary.light" },
};

// Header Section
const Header = () => {
  const router = useRouter();
  const theme = useTheme();
  const matchesMd = useMediaQuery(theme.breakpoints.down("md"));

  // Username of currently authenticated user
  const [username, setUsername] = useState("");
  const magic = constructMagicSDKInstance();
  useEffect(() => {
    if (!magic) {
      return;
    }
    const fetchUserEmail = async () => {
      try {
        const isLoggedIn = await magic.user.isLoggedIn();
        if (!isLoggedIn) {
          throw new Error("Not logged in");
        }
        const { email } = await magic.user.getMetadata();
        setUsername(email);
      } catch (err) {
        console.log("Failed to fetch user email", err.message);
      }
    };
    fetchUserEmail();
  }, [magic]);

  // State to manage the currently active tab
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);

  // When user clicks on a tab/drawer
  const handleRouteChange = (to) => {
    router.push(to);
  };

  // States and functions to manage username dropdown menu component.
  const [menuIsVisible, setMenuIsVisible] = useState(false);
  const headerRef = useRef()
  
  const handleClickListItem = (e) => {
    setMenuIsVisible(true);
  };

  const handleMenuClose = () => {
    setMenuIsVisible(false);
  };

  const handleSignOutClick = async () => {
    try {
      await axios.post("/api/signout")
      await magic.user.logout();
      setUsername("");
      router.push("/login");
    } catch (err) {
      console.log("Error logging out:", err.message);
      router.push("/login");
    }
  };

  const tabs = (
    <>
      <Tabs
        value={selectedTabIndex}
        onChange={(e, value) => setSelectedTabIndex(value)}
        sx={{ marginLeft: "auto" }}
        indicatorColor='primary'>
        <Tab
          label='Home'
          sx={SelectedTabStyles}
          disableRipple
          onClick={() => handleRouteChange("/")}
        />
        <Tab
          label='My List'
          sx={SelectedTabStyles}
          disableRipple
          onClick={() => handleRouteChange("/mylist")}
        />
        <Tab
          label={username}
          icon={<ArrowDropDownIcon />}
          iconPosition='end'
          sx={SelectedTabStyles}
          disableRipple
          onMouseOver={handleClickListItem}
        />
      </Tabs>
      <Menu
        id='username-dropdown-menu'
        anchorEl={headerRef.current}
        open={menuIsVisible}
        onClose={handleMenuClose}
        MenuListProps={{
          onMouseLeave: handleMenuClose,
        }}
        sx={{
          "& .MuiMenu-paper": {
            backgroundColor: "common.black",
            color: "rgba(255, 255, 255, 0.7)",
            borderRadius: 0,
          },
        }}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        keepMounted>
        <MenuItem
          onClick={handleSignOutClick}
          sx={{
            "&:hover": { color: "#fff" },
          }}>
          Sign out
        </MenuItem>
      </Menu>
    </>
  );

  // States to manage drawer component
  const [drawerIsVisible, setDrawerIsVisible] = useState(false);
  const iOS = typeof navigator !== "undefined" && /iPad|iPhone|iPod/.test(navigator.userAgent);

  const drawer = (
    <>
      <SwipeableDrawer
        anchor='right'
        disableBackdropTransition={!iOS}
        disableDiscovery={iOS}
        open={drawerIsVisible}
        onOpen={() => setDrawerIsVisible(true)}
        onClose={() => setDrawerIsVisible(false)}
        sx={{ "& .MuiDrawer-paper": { backgroundColor: "common.black" } }}>
        <Box sx={{ minHeight: { xs: "4rem", lg: "6rem" } }} />
        <List disablePadding>
          <ListItemButton
            divider
            selected={selectedTabIndex === 0}
            onClick={() => {
              setDrawerIsVisible(false);
              setSelectedTabIndex(0);
              handleRouteChange("/")
            }}
            sx={ListItemButtonStyles}>
            <ListItemText>Home</ListItemText>
          </ListItemButton>

          <ListItemButton
            divider
            selected={selectedTabIndex === 1}
            onClick={() => {
              setDrawerIsVisible(false);
              setSelectedTabIndex(1);
              handleRouteChange("/mylist");
            }}
            sx={ListItemButtonStyles}>
            <ListItemText>My List</ListItemText>
          </ListItemButton>

          <ListItemButton
            divider
            onClick={() => {
              setDrawerIsVisible(false);
              setSelectedTabIndex()
              handleSignOutClick();
            }}
            sx={ListItemButtonStyles}>
            <ListItemText>Sign Out</ListItemText>
          </ListItemButton>
        </List>
      </SwipeableDrawer>
      <IconButton
        onClick={() => setDrawerIsVisible(!drawerIsVisible)}
        disableRipple
        sx={{ marginLeft: "auto" }}>
        <MenuIcon
          sx={{
            height: "50px",
            width: "50px",
            color: "primary.main",
            "&:hover": { color: "primary.light" },
          }}
        />
      </IconButton>
    </>
  );

  return (
    <AppBar
      ref={headerRef}
      position='fixed'
      color='transparent'
      sx={(theme) => ({
        backgroundImage: "linear-gradient(to top, rgba(0,0,0,0.3) 10%, rgba(0,0,0,0.9))",
        height: { xs: "4rem", md: "6rem" },
        justifyContent: "center",
        zIndex: theme.zIndex.drawer + 1,
      })}>
      <Toolbar>
        <Link href='/'>
          <Button sx={{ marginLeft: "1rem" }} disableRipple onClick={()=> setSelectedTabIndex(0)}>
            <Box
              component='img'
              src='/static/netflix-icon.svg'
              alt='Netflix Logo'
              sx={{ height: { xs: "2rem", md: "3rem" } }}
            />
          </Button>
        </Link>
        {!username ? null : matchesMd ? drawer : tabs}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
