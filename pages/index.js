import Head from "next/head";
import { useState } from "react";
import Banner from "../components/ui/Banner";
import Carousel from "../components/ui/Carousel";
import { Magic } from "@magic-sdk/admin";
import { getPopularVideos, getVideos } from "../lib/videos-util";
import VideoDetails from "../components/VideoDetail";

export default function Home({ rapVideos, vlogVideos, codingVideos, popularVideos }) {
  const [videoDetailData, setVideoDetailData] = useState(null)
  
  const cardClickHandler = (videoData) => {
    setVideoDetailData(videoData);
  }

  const closeVideoDetailHandler = () => {
    setVideoDetailData(null);
  }

  return (
    <div>
      <Head>
        <title>Netflix App</title>
        <meta name='description' content='A Netflix app made using Material UI' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <Banner title='Ironman' subtitle='The guy in an iron suit' imageUrl='/static/ironman.webp' />

      <Carousel title='Rapping' videos={rapVideos} size='small' onCardClick={cardClickHandler} />
      <Carousel title='Popular Videos' videos={popularVideos} size='large' onCardClick={cardClickHandler} />
      <Carousel title='Vlogging' videos={vlogVideos} size='medium' onCardClick={cardClickHandler} />
      <Carousel title='Coding' videos={codingVideos} size='large' onCardClick={cardClickHandler} />
      {videoDetailData && <VideoDetails open={!!videoDetailData} videoDetailData={videoDetailData} onClose={closeVideoDetailHandler} />}
    </div>
  );
}

export async function getServerSideProps(context) {
  try {
    const mAdmin = new Magic(process.env.NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY);
    const {DIDToken} = context.req.cookies;
    const issuer = mAdmin.token.getIssuer(DIDToken);
    if(!issuer) throw new Error("Not Authenticated")
  } catch (err) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  const rapVideos = await getVideos("top rappers");
  const vlogVideos = await getVideos("vlog");
  const codingVideos = await getVideos("coding");
  const popularVideos = await getPopularVideos();

  return {
    props: {
      rapVideos,
      vlogVideos,
      codingVideos,
      popularVideos,
    },
  };
}
