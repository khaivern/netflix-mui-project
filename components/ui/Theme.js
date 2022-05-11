import { createTheme } from "@mui/material/styles";

const netflixRed = "#b71c1c";
const netflixGold = "#d4af37";
const netflixGrey = "#868686";
const netflixBackground = "#121212"

const theme = createTheme({
  
  palette: {
    common:{
      grey: netflixGrey,
      black: netflixBackground,
      gold: netflixGold
    },
    primary: {
      main: netflixRed,
    },
    secondary: {
      main: "#fff"
    },
    background: {
      default: netflixBackground,
    },
  },
  components: {
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: "#fff",
          fontSize: "1.5rem",
        },
      },
    },
    MuiInput: {
      styleOverrides: {
        root: {
          color: netflixGrey,
          fontWeight: 600,
        },
        underline: {
          "&:before": {
            borderBottom: `1px solid ${"#fff"}`,
          },
          "&&:hover:before": {
            borderBottom: `1px solid ${"#fff"}`,
          },
        },
      },
    },
  },
  typography: {
    h3: {
      fontFamily: "Roboto Flex",
      fontSize: "4rem",
      fontWeight: 600,
      color: netflixRed,
      textShadow: "3px 0 0 #000, 0 -3px 0 #000, 0 3px 0 #000, -3px 0 0 #000"
    },
    h4: {
      fontFamily: "Macondo",
      color: netflixGrey,
    },
    h5: {
      fontFamily: "Roboto Flex",
      fontWeight: 800,
      fontSize: "1.3rem",
      color: "#fff"
    },
    body1: {
      fontFamily: "Roboto Flex",
      fontSize: "1.5rem",
      color: "#fff"
    },
    body2 : {
      fontFamily: "Macondo",
      fontSize: "0.9rem",
      color: netflixGrey
    }
  },
});

export default theme;
