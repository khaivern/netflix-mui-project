import { createTheme } from "@mui/material/styles";

const netflixRed = "#b71c1c";
const netflixBlack = "";
const netflixGrey = "#868686";
const netflixBackground = "#121212"

const theme = createTheme({
  
  palette: {
    common:{
      grey: netflixGrey,
    
    },
    primary: {
      main: netflixRed,
    },
    background: {
      default: netflixBackground,
    },
  },

  typography: {
    h3: {
      fontFamily: "Roboto Flex",
      fontSize: "4rem",
    },
    h4: {
      fontFamily: "Macondo",
      color: netflixGrey,
    },
  },
});

export default theme;
