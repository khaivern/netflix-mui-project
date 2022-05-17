import "../styles/globals.css";
import { ThemeProvider } from "@mui/material/styles";

import theme from "../components/ui/Theme";
import Header from "../components/ui/Header";
import { VideoProvider } from "../store/video-context";

function MyApp({ Component, pageProps }) {
  return (
    <VideoProvider>
      <ThemeProvider theme={theme}>
        <Header>
          <Component {...pageProps} />
        </Header>
      </ThemeProvider>
    </VideoProvider>
  );
}

export default MyApp;
