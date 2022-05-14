import Head from "next/head";
import { useContext} from "react";
import Banner from "../components/ui/Banner";
import Carousel from "../components/ui/Carousel";
import { Magic } from "@magic-sdk/admin";
import { getPopularVideos, getRandomBannerVideo, getVideos, getVideoSearchTerms } from "../lib/videos-util";
import VideoDetails from "../components/VideoDetail";
import VideoContext from "../store/video-context";

export default function Home({ videos, popularVideos, sizes, bannerVideo }) {
  const videoCtx = useContext(VideoContext)
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
      {videos.map(({ title, videos }, index) => (
        <Carousel
          key={title}
          title={title}
          videos={videos}
          size={sizes[index]}
        />
      ))}

      <Carousel
        title='Popular Videos'
        videos={popularVideos}
        size='large'
      />
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
  try {
    const mAdmin = new Magic(process.env.NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY);
    const { DIDToken } = context.req.cookies;
    // console.log({DIDToken})
    mAdmin.token.validate(DIDToken); // If DIDToken is forged, method will throw an error
  } catch (err) {
    console.log("FORGED: ", err.message);
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
  const videos = [];
  const samples = getVideoSearchTerms(4); // if changed num of video term to be retrieved, make sure to update the sizes array to accomodate an extra row of cards
  await Promise.all(
    samples.map(async (title) => videos.push({ title, videos: await getVideos(title) }))
  );

  const popularVideos = await getPopularVideos();
  const bannerVideo = getRandomBannerVideo()
  return {
    props: {
      bannerVideo,
      videos,
      popularVideos,
      sizes: ["small", "medium", "large", "large"], // Deteremines the order and sizes of the video cards
    },
  };
}
