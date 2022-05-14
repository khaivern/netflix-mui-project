import React, { Fragment, useEffect, useState } from "react";
import { useRouter } from "next/router";

import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import { useMediaQuery, useTheme } from "@mui/material";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import { bannerVideos, getVideoDetails } from "../../lib/videos-util";
import axios from "axios";
import { readCookie } from "../../lib/cookie-util";

const IconButtonStyles = (color) => ({
  backgroundColor: "rgba(0,0,0,0.8)",
  border: "3px solid rgba(255,255,255,0.8)",
  "&.Mui-disabled": {
    backgroundColor: "rgba(0,0,0,0.8)",
    cursor: "not-allowed",
    pointerEvents: "auto",
  },
  "&:hover": {
    backgroundColor: "rgba(255,255,255,0.5)",
    border: "3px solid rgba(0,0,0,0.8)",
    "& .MuiSvgIcon-root": {
      color: color,
    },
  },
});

const VideoDetailPage = ({ videoDetailsObject }) => {
  const router = useRouter();
  const theme = useTheme();
  const matchesXS = useMediaQuery(theme.breakpoints.down("xs"));
  const matchesSM = useMediaQuery(theme.breakpoints.down("sm"));
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    router.events.on("routeChangeStart", () => setIsLoading(true));
    router.events.on("routeChangeComplete", () => setIsLoading(false));
    return () => {
      router.events.off("routeChangeStart", () => setIsLoading(true));
      router.events.off("routeChangeComplete", () => setIsLoading(false));
    };
  }, [router]);

  // React Button Handlers
  const [reaction, setReaction] = useState(null);
  const handleReactClick = async (reactionVal) => {
    setReaction(reactionVal);
    const { token, DIDToken } = readCookie();
    await axios.post(
      `/api/video/${videoDetailsObject.id}/${token}`,
      {
        reaction: reactionVal, // cannot use reaction var since it has state updates are batched
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${DIDToken}`,
        },
      }
    );
  };

  useEffect(() => {
    const fetchVideoReaction = async () => {
      const { token, DIDToken } = readCookie();
      try {
        
        const response = await axios.get(`/api/video/${videoDetailsObject.id}/${token}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${DIDToken}`,
          },
        });
        const data = response.data;
        if (data.video) {
          setReaction(data.video.favourited);
        }
      } catch (err) {
        console.log(err);
      }
    };
    if (!videoDetailsObject) {
      return;
    }
    fetchVideoReaction();
  }, [videoDetailsObject, reaction]);

  // end--

  if (!videoDetailsObject) {
    return <LoadingSpinner />;
  }

  const { id, title, description, likeCount, publishedAt, tags, viewCount, channelTitle } =
    videoDetailsObject;

  const humanReadableDate = new Date(publishedAt).toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <>
      <Grid
        container
        direction='column'
        sx={{
          marginTop: { xs: "2rem", md: "6rem" },
          paddingLeft: { xs: 0, md: "3rem" },
          // marginLeft: { xs: 0, md: "2rem", lg: "3rem" },
          // marginRight: { xs: 0, md: "2rem", lg: "3rem" },
        }}>
        <Grid
          item
          container
          direction={{ xs: "column", md: "row" }}
          sx={{ marginTop: "3rem", position: "relative" }}>
          {/* Youtube Player */}
          <Grid
            item
            md
            paddingRight={{ xs: 0, md: "2rem" }}
            sx={{ margin: { xs: "auto", md: "initial", position: "relative" } }}>
            <Box
              component='iframe'
              id='ytplayer'
              type='text/html'
              sx={{
                height: { xs: "100%", sm: 300, md: 400, lg: 450, xl: 600 },
                width: { xs: "100%", sm: 550, md: 600, lg: 750, xl: 1000 },
                minHeight: 200,
                minWidth: 300,
              }}
              src={`https://www.youtube.com/embed/${id}?autoplay=0&origin=http://example.com`}
              frameBorder='0'
            />
            <Grid
              item
              container
              sx={{ position: "absolute", bottom: { xs: 20, md: 50 }, left: { xs: 10, md: 20 } }}>
              <Grid item>
                <IconButton
                  onClick={() => handleReactClick(1)}
                  disabled={reaction === 1 ? true : false}
                  sx={IconButtonStyles("success.light")}>
                  <ThumbUpIcon
                    sx={{ color: reaction === 1 ? "success.light" : "#fff" }}
                    fontSize={matchesXS ? "small" : matchesSM ? "medium" : "large"}
                  />
                </IconButton>
              </Grid>
              <Grid item marginLeft={{ xs: 0, sm: "0.5rem", md: "1rem" }}>
                <IconButton
                  onClick={() => handleReactClick(-1)}
                  disabled={reaction === -1 ? true : false}
                  sx={IconButtonStyles("primary.main")}>
                  <ThumbDownIcon
                    sx={{ color: reaction === -1 ? "primary.main" : "#fff" }}
                    fontSize={matchesXS ? "small" : matchesSM ? "medium" : "large"}
                  />
                </IconButton>
              </Grid>
            </Grid>
          </Grid>
          {/* Tags */}
          <Grid
            item
            md
            paddingRight={{ xs: "3rem", md: "2rem" }}
            paddingLeft={{ xs: "3rem", md: 0 }}
            sx={{ display: { xs: "none", md: "initial" } }}>
            <List
              sx={{
                margin: "auto",
                width: "100%",
                maxWidth: { xs: 300, sm: 500, md: 450, lg: 600, xl: 800 },
                bgcolor: "common.black",
                position: "relative",
                overflow: "auto",
                maxHeight: { xs: 400, lg: 450, xl: 600 },
                "& ul": { padding: 0 },
              }}
              subheader={
                <ListSubheader
                  sx={{
                    backgroundColor: "primary.main",
                    textAlign: "center",
                    fontSize: "2rem",
                    textShadow: "1px 0 0 #000, 0 -1px 0 #000, 0 1px 0 #000, -1px 0 0 #000",
                    color: "#fff",
                  }}>
                  Tags
                </ListSubheader>
              }>
              {tags.map((tag, index) => (
                <Fragment key={`section-${index}`}>
                  <ListItem>
                    <ListItemText primary={tag} />
                  </ListItem>
                  <Divider
                    sx={{
                      "&.MuiDivider-root": {
                        borderWidth: "0.5px",
                        borderStyle: "groove",
                        borderColor: "#fff",
                        backgroundColor: "#fff",
                      },
                    }}
                  />
                </Fragment>
              ))}
            </List>
          </Grid>
        </Grid>
        <Grid container direction={{ xs: "column", md: "row" }} marginTop='1.75rem'>
          {/* Title, Description */}

          <Grid
            item
            container
            direction='column'
            md={8}
            sx={{
              textAlign: { xs: "center", md: "initial" },
              margin: { xs: "auto", md: "initial" },
              paddingLeft: { xs: "3rem", md: "0" },
              paddingRight: { xs: "3rem", md: "0" },
            }}>
            <Grid
              item
              sx={{
                "&.MuiGrid-root.MuiGrid-item": {
                  maxWidth: { xs: 350, sm: 550, md: 600, lg: 750, xl: 1000 },
                },
                "& .MuiTypography-root": { fontSize: { xs: "1rem", md: "1.3rem" } },
                margin: { xs: "auto", md: "initial" },
              }}>
              <Typography variant='h5' sx={{ color: "greenyellow" }} gutterBottom>
                {humanReadableDate}
              </Typography>
              <Typography variant='body1' sx={{ color: "common.gold" }} paragraph>
                {title}
              </Typography>
              <Typography variant='body1' paragraph>
                {description}
              </Typography>
            </Grid>
          </Grid>

          {/* Additional Info */}
          <Grid
            item
            container
            direction='column'
            md={4}
            sx={{
              paddingLeft: { xs: 0, md: "3rem" },
              paddingRight: { xs: 0, md: "3rem" },
              marginTop: { xs: "2rem", md: "5rem" },
              textAlign: { xs: "center", md: "initial" },
            }}>
            <Grid item>
              <Typography variant='body1'>
                <Box component='span' sx={{ color: "common.grey" }}>
                  Cast:{" "}
                </Box>
                {channelTitle}
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant='body1'>
                <Box component='span' sx={{ color: "common.grey" }}>
                  Views:{" "}
                </Box>
                {viewCount}
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant='body1'>
                <Box component='span' sx={{ color: "common.grey" }}>
                  Likes:{" "}
                </Box>
                {likeCount}
              </Typography>
            </Grid>
          </Grid>
          {/* Tags for mobile view */}
          <Grid
            item
            md
            paddingRight={{ xs: "3rem", md: "2rem" }}
            paddingLeft={{ xs: "3rem", md: 0 }}
            sx={{
              display: { xs: "initial", md: "none" },
              marginTop: { xs: "2rem" },
              marginBottom: "5rem",
            }}>
            <List
              sx={{
                margin: "auto",
                width: "100%",
                maxWidth: { xs: 300, sm: 500, md: 450, lg: 600, xl: 800 },
                bgcolor: "common.black",
                position: "relative",
                overflow: "auto",
                maxHeight: { xs: 400, lg: 450, xl: 600 },
                "& ul": { padding: 0 },
              }}
              subheader={<li />}>
              <ListSubheader sx={{ backgroundColor: "primary.main" }} color='primary'>
                <Typography
                  variant='h5'
                  sx={{
                    textAlign: "center",
                    fontSize: "2rem",
                    textShadow: "1px 0 0 #000, 0 -1px 0 #000, 0 1px 0 #000, -1px 0 0 #000",
                  }}>
                  Tags
                </Typography>
              </ListSubheader>
              {tags.map((tag, index) => (
                <Fragment key={`section-${index}`}>
                  <ListItem>
                    <ListItemText primary={tag} />
                  </ListItem>
                  <Divider
                    sx={{
                      "&.MuiDivider-root": {
                        borderWidth: "0.5px",
                        borderStyle: "groove",
                        borderColor: "#fff",
                        backgroundColor: "#fff",
                      },
                    }}
                  />
                </Fragment>
              ))}
            </List>
          </Grid>
        </Grid>
      </Grid>
      {isLoading && <LoadingSpinner asOverlay />}
    </>
  );
};

export default VideoDetailPage;

export async function getStaticProps(context) {
  // return {
  //   props: {
  //     videoDetailsObject: {
  //       id: "jbbNai2HHzI",
  //       title: "The Definitive Greatest Rappers Of All Time Top 10 List 💯",
  //       description:
  //         "The Definitive Greatest Rappers Of All Time Top 10 List. In Rap music there is a lot of references to being the best, the greatest, Number one, the GOAT… Well today we are going to take a look at the greatest rappers in the genre and work out who truly is the greatest of all time. Subscribe: http://goo.gl/Grh1Wg  // Timestamps Below\n\nTimestamps:\n0:17 Lil Wayne\n0:43 Rakim\n1:11 Nas\n1:41 Lauryn Hill\n2:10 Andre 3000\n2:50 Kanye West\n3:21 Jay-Z\n3:57 Tupac\n4:40 The Notorious B.I.G.\n5:23 Eminem\n\nMake Sure To ❤️ SUBSCRIBE ❤️ To Our Channel! https://goo.gl/Grh1Wg\n\nFor Your Chance To 📱🎁 Win An iPhone X! 🎁📱 https://goo.gl/ctZ5Tx\n\nCheck Out Our Latest 📺 VIDEOS 📺 https://goo.gl/sXyUWH\n\nAll clips used for fair use commentary, criticism, and educational purposes. See Hosseinzadeh v. Klein, 276 F.Supp.3d 34 (S.D.N.Y. 2017); Equals Three, LLC v. Jukin Media, Inc., 139 F. Supp. 3d 1094 (C.D. Cal. 2015).",
  //       publishedAt: "2017-07-26T21:00:03Z",
  //       tags: [
  //         "Rappers",
  //         "Hip-Hop",
  //         "Rap Artists",
  //         "Hip-Hop Artists",
  //         "Lyricists",
  //         "MCs",
  //         "the best",
  //         "number one",
  //         "the GOAT",
  //         "GOAT",
  //         "the greatest",
  //         "the greatest of all time",
  //         "Lil Wayne",
  //         "Young Money",
  //         "Rakim",
  //         "Nas",
  //         "Lauryn Hill",
  //         "Fugees",
  //         "Kanye West",
  //         "Yeezy",
  //         "Jay-Z",
  //         "Jayz Tupac",
  //         "2pac",
  //         "The Notorious B.I.G.",
  //         "Biggie Eminem",
  //         "Slim Shady",
  //         "Marshall Mathers",
  //         "History",
  //         "Music",
  //         "Musicians",
  //         "Top 10 List",
  //         "Top 10",
  //         "Top Ten",
  //         "Top Ten List",
  //         "greatest",
  //         "eminem",
  //         "rap",
  //         "best",
  //         "hip hop",
  //         "andre 3000",
  //         "outkast",
  //         "Definitive Greatest Rappers Of All Time",
  //       ],
  //       viewCount: "1138401",
  //       likeCount: "24667",
  //     },
  //   },
  // };
  const { videoId } = context.params;
  try {
    const videoDetailsObject = await getVideoDetails(videoId);
    if (!videoDetailsObject) {
      throw new Error("Failed to fetch video details with static props");
    }
    return {
      props: {
        videoDetailsObject,
      },
      revalidate: 1000,
    };
  } catch (err) {
    console.log(err);
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
}

export async function getStaticPaths(context) {
  // Banner ids to pre-render.
  const bannerIds = bannerVideos.map((video) => video.videoId);
  const pathsWithParams = bannerIds.map((videoId) => ({ params: { videoId } }));
  return {
    paths: pathsWithParams,
    fallback: true,
  };
}
