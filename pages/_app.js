import "../styles/globals.css";
import { ThemeProvider } from "@mui/material/styles";

import theme from "../components/ui/Theme";
import Header from "../components/ui/Header";
import { constructMagicSDKInstance } from "../lib/magic-util";

function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider theme={theme}>
      <Header />
      <Component {...pageProps} />
    </ThemeProvider>
  );
}

export default MyApp;

