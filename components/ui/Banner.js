import React from "react";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import Link from "next/link";
const Banner = ({ title, subtitle, imageUrl, videoId }) => {
  return (
    <Grid container sx={{ height: { xs: "30rem", md: "40rem" }, position: "relative" }}>
      <Grid
        item
        container
        direction='column'
        sx={{ position: "absolute", marginTop: { xs: "6rem", md: "12rem" } }}>
        <Grid item sx={{ marginLeft: { xs: "1rem", md: "4rem" } }}>
          <Typography
            variant='h1'
            sx={{
              color: "#E50914",
              textShadow: "3px 0 0 #000, 0 -3px 0 #000, 0 3px 0 #000, -3px 0 0 #000",
              fontSize: { xs: "4rem", md: "6rem" },
            }}
            gutterBottom>
            <Box component='span'>M </Box>
            <Box
              component='span'
              sx={{ fontSize: { xs: "1.5rem", md: "2.5rem" }, color: "#868686" }}>
              S E R I E S
            </Box>
          </Typography>

          <Typography
            variant='h3'
            sx={{
              color: "#fff",
              fontWeight: "700",
              textShadow: "2px 0 0 #000, 0 -2px 0 #000, 0 2px 0 #000, -2px 0 0 #000",
              fontSize: { xs: "2rem", md: "4rem" },
            }}>
            {title}
          </Typography>
          <Typography
            variant='h4'
            sx={{
              textShadow: "2px 0 0 #000, 0 -2px 0 #000, 0 2px 0 #000, -2px 0 0 #000",
              fontSize: { xs: "1.5rem", md: "2.2rem" },
            }}>
            {subtitle}
          </Typography>
        </Grid>
        <Grid item sx={{ marginTop: "2rem", marginLeft: { xs: "1rem", md: "4rem" } }}>
          <Link href={`/video/${videoId}`}>
            <Button
              variant='contained'
              color='error'
              sx={{
                width: { xs: "6rem", md: "8rem" },
                height: { xs: "2.5rem", md: "3rem" },
                fontSize: { xs: "1rem", md: "1.25rem" },
              }}
              endIcon={<PlayArrowIcon />}>
              Play
            </Button>
          </Link>
        </Grid>
      </Grid>
      <Box
        sx={{
          backgroundImage: `linear-gradient(to top right, rgba(228, 221, 221, 0.2) 10%, rgba(0, 0, 0, 0.3) 95%), url(${imageUrl})`,
          backgroundPosition: "center",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          height: "100%",
          width: "100%",
        }}
      />
    </Grid>
  );
};

export default Banner;
