import Head from "next/head";
import Banner from "../components/ui/Banner";
import CardComponent from "../components/ui/Card";
import Header from "../components/ui/Header";

export default function Home() {
  return (
    <div>
      <Head>
        <title>Netflix App</title>
        <meta name='description' content='A Netflix app made using Material UI' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <Header username="tester@gmail.com" />
      <Banner title="Ironman" subtitle="The guy in an iron suit" imageUrl="/static/ironman.webp" />
      <CardComponent />
      <CardComponent />
      <CardComponent />
    </div>
  );
}
