import Head from "next/head";
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import jwt from "jsonwebtoken";

import Grid from "@mui/material/Grid";
import Carousel from "../components/ui/Carousel";
import { readCookie } from "../lib/cookie-util";
import { getListOfVideosByVideoIds } from "../lib/videos-util";
import { getUserFavouritedVideoIds } from "../lib/hasura-util";
import VideoDetails from "../components/VideoDetail";
import VideoContext from "../store/video-context";
import { decodeToken } from "../lib/token-util";

const MyList = ({ videos }) => {
  const [favourites, setFavourites] = useState(videos);
  // useEffect(() => {
  //   const fetchMyFavouriteVideos = async () => {
  //     try {
  //       const { token } = readCookie();

  //       const response = await axios.post("/api/video/favourites", {
  //         token,
  //       });
  //       const revalidatedVideos = response.data.videos;
  //       if (!revalidatedVideos) {
  //         throw new Error("No videos returned from database");
  //       }

  //       if (revalidatedVideos !== videos) {
  //         setFavourites(revalidatedVideos);
  //       }
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   };
  //   fetchMyFavouriteVideos();
  // }, [videos]);

  const selectedVideo = useContext(VideoContext).video;

  return (
    <>
      <Head>
        <title>My List</title>
        <meta name='description' content='My Favourited Videos' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Grid container direction='column' marginTop='6rem'>
        <Grid item container direction={{ xs: "column", md: "row" }}>
          {favourites && (
            <Carousel
              title='My Favourites'
              videos={favourites}
              size='medium'
              wrap='wrap'
              centered='center'
              showSummary={false}
            />
          )}
        </Grid>
        {selectedVideo && (
          <VideoDetails
            open={!!selectedVideo}
            videoDetailData={selectedVideo}
            onClose={() => videoCtx.closeVideo()}
          />
        )}
      </Grid>
    </>
  );
};

export default MyList;

export async function getServerSideProps(context) {
  try {
    const { token } = context.req.cookies;
    if (!token) {
      throw new Error("Token does not exist, please try logging in");
    }
    const decodedToken = await decodeToken(token);
    const videoIds =
      decodedToken.issuer &&
      (await getUserFavouritedVideoIds({ userId: decodedToken.issuer, token }));
    const videos = (videoIds && (await getListOfVideosByVideoIds(videoIds))) || [];
    return {
      props: {
        videos,
      },
    };
  } catch (err) {
    // console.log(err);
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
}
