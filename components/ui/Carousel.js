import React from "react";

import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import CardComponent from "./Card";

const Carousel = ({ title, videos, size, onCardClick }) => {
  return (
    <Grid container direction='column' >
      <Grid item sx={{ marginLeft: "5rem", marginTop: "2rem" }}>
        <Typography variant='h3' gutterBottom>
          {title}
        </Typography>
      </Grid>
      <Grid
        item
        container
        direction='row'
        wrap='nowrap'
        sx={{ overflowX: "scroll", overflowY: "hidden", padding: "2rem 5rem" }}>
        {videos.map((video) => (
          <Grid item key={video.id} sx={{margin: "0 0.2rem"}}>
            <CardComponent onCardClick={onCardClick} id={video.id} size={size} imageUrl={video.imageUrl} title={video.title} description={video.description} />
          </Grid>
        ))}
      </Grid>
    </Grid>
  );
};

export default Carousel;
