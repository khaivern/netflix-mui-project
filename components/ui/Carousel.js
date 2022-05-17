import React from "react";

import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import CardComponent from "./Card";

const Carousel = ({
  title,
  videos,
  size,
  wrap = "nowrap",
  centered = "initial",
  showSummary = true,
}) => {
  const formatTitle = () => {
    try {
      return title
        .split(" ")
        .map((word) => word?.split("")[0].toUpperCase() + word?.slice(1))
        .join(" ");
    } catch (err) {
      return "Missing Title";
    }
  };

  return (
    <Grid container direction='column'>
      <Grid item sx={{ marginLeft: { xs: "1.5rem", md: "5rem" }, marginTop: "2rem" }}>
        <Typography variant='h3' gutterBottom>
          {formatTitle()}
        </Typography>
      </Grid>
      <Grid
        item
        container
        direction='row'
        justifyContent={centered}
        wrap={wrap}
        sx={{
          overflowX: "scroll",
          overflowY: "hidden",
          padding: { xs: "1rem 3rem", md: centered ? "2rem 3rem" : "2rem 5rem" },
        }}>
        {videos.map((video) => (
          <Grid item key={video.id} sx={{ margin: "0.5rem 0.5rem" }}>
            <CardComponent
              id={video.id}
              size={size}
              imageUrl={video.imageUrl}
              title={video.title}
              description={video.description}
              showSummary={showSummary}
            />
          </Grid>
        ))}
      </Grid>
    </Grid>
  );
};

export default Carousel;
