import Head from "next/head";
import { useContext } from "react";
import Banner from "../components/ui/Banner";
import Carousel from "../components/ui/Carousel";
import {
  getListOfVideosByVideoIds,
  getPopularVideos,
  getRandomBannerVideo,
  getVideos,
  getVideoSearchTerms,
} from "../lib/videos-util";
import VideoDetails from "../components/VideoDetail";
import VideoContext from "../store/video-context";
import { getUserWatchedVideoIds } from "../lib/hasura-util";

export default function Home({ videos, popularVideos, sizes, watchedVideos, bannerVideo }) {
  const videoCtx = useContext(VideoContext);
  const selectedVideo = videoCtx.video;

  return (
    <div>
      <Head>
        <title>Netflix App</title>
        <meta name='description' content='A Netflix app made using Material UI' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <Banner
        title={bannerVideo.title}
        subtitle={bannerVideo.subtitle}
        imageUrl={bannerVideo.imageUrl}
        videoId={bannerVideo.videoId}
      />

      {watchedVideos && <Carousel title='Watch It Again' size='medium' videos={watchedVideos} />}

      {videos.map(({ title, videos }, index) => (
        <Carousel key={title} title={title} videos={videos} size={sizes[index]} />
      ))}

      <Carousel title='Popular Videos' videos={popularVideos} size='large' />
      {selectedVideo && (
        <VideoDetails
          open={!!selectedVideo}
          videoDetailData={selectedVideo}
          onClose={() => videoCtx.closeVideo()}
        />
      )}
    </div>
  );
}

export async function getServerSideProps(context) {
  const { token } = context.req.cookies;
  // try {
  //   const mAdmin = new Magic(process.env.NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY);
  //   mAdmin.token.validate(DIDToken); // If DIDToken is forged, method will throw an error
  // } catch (err) {
  //   console.log("FORGED: ", err.message);
  //   return {
  //     redirect: {
  //       destination: "/login",
  //       permanent: false,
  //     },
  //   };
  // }
  const videos = [];
  const samples = getVideoSearchTerms(4); // if changed num of video term to be retrieved, make sure to update the sizes array to accomodate an extra row of cards
  const [_, popularVideos, watchedVideos] = await Promise.all([
    samples.map(async (title) => videos.push({ title, videos: await getVideos(title) })),
    getPopularVideos(),
    getListOfVideosByVideoIds(await getUserWatchedVideoIds({ token })),
  ]);

  const bannerVideo = getRandomBannerVideo();

  return {
    props: {
      bannerVideo,
      videos,
      popularVideos,
      watchedVideos,
      sizes: ["small", "medium", "large", "large"], // Deteremines the order and sizes of the video cards
    },
  };
}
