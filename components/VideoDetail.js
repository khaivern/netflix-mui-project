import React, { useContext, useEffect } from "react";

import Grid from "@mui/material/Grid";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";

import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import { useMediaQuery, useTheme } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";
import VideoContext from "../store/video-context";

const VideoDetails = ({ videoDetailData, open, onClose }) => {
  // Resize modal for different screen sizes
  const theme = useTheme();
  const matchesLG = useMediaQuery(theme.breakpoints.down("lg"));
  const matchesMD = useMediaQuery(theme.breakpoints.down("md"));
  const matchesSM = useMediaQuery(theme.breakpoints.down("sm"));

  const { id, title, description } = videoDetailData;
  const router = useRouter()
  const {closeVideo} = useContext(VideoContext)
  useEffect(()=> {
    const handleRouteChange = () => {
      closeVideo();
    };
    // subscribe to event changes
    router.events.on("routeChangeComplete", handleRouteChange);
    router.events.on("routeChangeError", handleRouteChange);

    return () => {
      // Unsubscribe from event changes
      router.events.off("routeChangeComplete", handleRouteChange);
      router.events.off("routeChangeError", handleRouteChange);
    }
  },[router, closeVideo])

  return (
    <Grid container sx={{ marginTop: "6rem" }}>
      <Grid item container direction='column'>
        <Grid item>
          <Dialog
            PaperProps={{
              sx: { backgroundColor: "common.black" },
            }}
            fullWidth
            maxWidth={matchesSM ? "xs" : matchesMD ? "sm" : matchesLG ? "md" : "lg"}
            open={open}
            onClose={onClose}
            scroll='paper'
            aria-labelledby='scroll-dialog-title'
            aria-describedby='scroll-dialog-description'>
            <DialogTitle id='scroll-dialog-title' sx={{color: "common.gold", fontWeight: 700, fontSize: "1.75rem"}}>{title}</DialogTitle>
            <DialogContent dividers={true}>
              <Box
                sx={{
                  display: "flex",
                  height: { xs: 300, sm: 400, md: 400, lg: 500 },
                  minHeight: 300,
                }}
                justifyContent='center'>
                <Box
                  component='iframe'
                  id='ytplayer'
                  type='text/html'
                  width='100%'
                  height='100%'
                  sx={{ minHeight: 300 }}
                  src={`https://www.youtube.com/embed/${id}?autoplay=0&origin=http://example.com`}
                  frameBorder='0' />
              </Box>
              <Grid container columnSpacing={10} marginTop='1.75rem'>
                <Grid item container direction='column' md={8}>
                  <Grid item>
                    <Typography variant='body1' paragraph>
                      {description}
                    </Typography>
                  </Grid>
                </Grid>
                <Grid item container direction='column' md={4}>
                  <Grid item>
                    <Typography variant='body1'>
                      <Box component='span' sx={{ color: "common.grey" }}>
                        Cast:
                      </Box>
                      Netflix
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography variant='body1'>
                      <Box component='span' sx={{ color: "common.grey" }}>
                        View Count:
                      </Box>
                      123456
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </DialogContent>

            <DialogActions>
              <Button onClick={onClose}>Cancel</Button>
              <Link href={`/video/${id}`} passHref>
                <Button>View Full Page</Button>
              </Link>
            </DialogActions>
          </Dialog>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default VideoDetails;
