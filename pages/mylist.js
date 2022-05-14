import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import jwt from "jsonwebtoken";

import Grid from "@mui/material/Grid";
import Carousel from "../components/ui/Carousel";
import { readCookie } from "../lib/cookie-util";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import { useRouter } from "next/router";
import { getListOfVideosByVideoIds } from "../lib/videos-util";
import { getUserFavouritedVideoIds } from "../lib/hasura-util";
import VideoDetails from "../components/VideoDetail";
import VideoContext from "../store/video-context";

const MyList = ({videos}) => {
  const [favourites, setFavourites] = useState(videos);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const fetchMyFavouriteVideos = async () => {
      try {
        const { token } = readCookie();

        const response = await axios.post("/api/video/favourites", {
          token,
        });
        const revalidatedVideos = response.data.videos;
        if (!revalidatedVideos) {
          throw new Error("No videos returned from database");
        }
        
        if(revalidatedVideos !== videos) {
          setFavourites(revalidatedVideos);
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchMyFavouriteVideos();
  }, [videos]);

  const router = useRouter();
  useEffect(() => {
    router.events.on("routeChangeStart", () => setIsLoading(true));
    router.events.on("routeChangeComplete", () => setIsLoading(false));
    return () => {
      router.events.off("routeChangeStart", () => setIsLoading(true));
      router.events.off("routeChangeComplete", () => setIsLoading(false));
    };
  }, [router]);

  const selectedVideo = useContext(VideoContext).video

  return (
    <Grid container direction='column' marginTop='6rem'>
      <Grid item container>
        <Carousel
          title='My Favourites'
          videos={favourites}
          size='medium'
          wrap='wrap'
          centered='center'
        />
        {isLoading && <LoadingSpinner asOverlay />}
      </Grid>
      {selectedVideo && (
        <VideoDetails
          open={!!selectedVideo}
          videoDetailData={selectedVideo}
          onClose={() => videoCtx.closeVideo()}
        />
      )}
    </Grid>
  );
};

export default MyList;


export async function getServerSideProps (context) {
  try {
    const {token} = context.req.cookies;
    if(!token) {
      throw new Error("Token does not exist, please try logging in")
    }  
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if(!decodedToken) {
      throw new Error("Failed to verify token");
    }
    const videoIds = await getUserFavouritedVideoIds({userId: decodedToken.issuer, token});
    const videos = await getListOfVideosByVideoIds(videoIds);
    return {
      props: {
        videos
      },
    }
  } catch (err) {
    console.log(err);
    return {
      redirect: {
        destination: "/login",
        permanent: false
      }
    }
  }
}