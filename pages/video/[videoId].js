import React from 'react'
import { useRouter } from 'next/router'

import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

const VideoDetailPage = () => {
  const {videoId} = useRouter().query;
  
  return (
    <Grid container>
      <Grid item container direction="column">
        <Grid item>
          <Typography variant="h1">{videoId}</Typography>
        </Grid>
      </Grid>

    </Grid>
  )
}

export default VideoDetailPage