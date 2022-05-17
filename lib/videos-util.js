import dummyVideoData from "../data/videos.json";
import axios from "axios";

import * as _ from "lodash";

const baseUrl = "https://youtube.googleapis.com/youtube/v3/";

const sendRequest = async (url) => {
  try {
    const videoResponse = await axios.get(url);
    const videoData = videoResponse.data;
    if (videoData.error) {
      throw new Error("Youtube API error: " + videoData.error);
    }
    return videoData;
  } catch (err) {
    // console.log(err);
    return { error: err.message };
  }
};

// Filter for Core Details only (Home page)
const buildVideoMainMap = (videoDataArray) =>
  videoDataArray.map((videoItem) => ({
    id: videoItem.id?.videoId || videoItem.id?.playlistId || videoItem.id,
    imageUrl: videoItem.snippet.thumbnails.high.url,
    title: videoItem.snippet.title,
    description: videoItem.snippet.description,
  }));

// Filter for the Video Detail Page
const buildVideoDetailsMap = (videoData) => ({
  id: videoData.id,
  title: videoData.snippet.title,
  description: videoData.snippet.description,
  publishedAt: videoData.snippet.publishedAt,
  tags: videoData.snippet.tags,
  channelTitle: videoData.snippet.channelTitle,
  viewCount: videoData.statistics.viewCount,
  likeCount: videoData.statistics.likeCount,
});

export const getVideos = async (query) => {
  try {
    const videoData = await sendRequest(
      `${baseUrl}search?part=snippet&maxResults=6&q=${query}&key=${process.env.YOUTUBE_API_KEY}`
    );
    if (videoData.error) {
      throw new Error("Error from sending get request to Youtube", videoData.error);
    }
    const videoItemsArray = videoData.items;
    return buildVideoMainMap(videoItemsArray);
  } catch (err) {
    // console.log(err);
    return buildVideoMainMap(dummyVideoData.items);
  }
};

export const getPopularVideos = async () => {
  try {
    const videoData = await sendRequest(
      `${baseUrl}videos?part=snippet%2CcontentDetails%2Cstatistics&chart=mostPopular&regionCode=US&key=${process.env.YOUTUBE_API_KEY}`
    );
    if (videoData.error) {
      throw new Error("Error from sending popular request to Youtube: " + videoData.error);
    }
    const videoItemsArray = videoData.items;
    return buildVideoMainMap(videoItemsArray);
  } catch (err) {
    // console.log(err);
    return buildVideoMainMap(dummyVideoData.items);
  }
};

export const getVideoDetails = async (videoId) => {
  try {
    const videoData = await sendRequest(
      `${baseUrl}videos?part=snippet%2CcontentDetails%2Cstatistics&id=${videoId}&key=${process.env.YOUTUBE_API_KEY}`
    );
    if (videoData.error || !videoData.items[0]) {
      throw new Error("Error fetching video details for given ID", videoData.error);
    }
    return buildVideoDetailsMap(videoData.items[0]);
  } catch (err) {
    // console.log(err);
    return {
      id: "missing",
      title: "Missing Title",
      description: "Missing Description",
      publishedAt: new Date().toISOString(),
      tags: [],
      channelTitle: "Missing Channel",
      viewCount: -1,
      likeCount: -1,
    };
  }
};

export const getListOfVideosByVideoIds = async (videoIdArray) => {
  try {
    const formattedIds = videoIdArray.join("%2C");
    const videoData = await sendRequest(
      `${baseUrl}videos?part=snippet%2CcontentDetails%2Cstatistics&id=${formattedIds}&key=${process.env.YOUTUBE_API_KEY}`
    );
    if (!videoData.items) {
      throw new Error("Items does not exist");
    }
    return buildVideoMainMap(videoData.items);
  } catch (err) {
    // console.log(err);
    return buildVideoMainMap(dummyVideoData.items);
  }
};

// Q.O.L Features
export const getVideoSearchTerms = (numOfTerms) => {
  const data = `pewdiepie	45,71,398
  2	asmr	40,36,274
  3	music	33,47,560
  4	markiplier	29,69,267
  5	old town road	25,01,430
  6	billie eilish	23,55,459
  7	pewdiepie vs t series	21,79,597
  8	fortnite	20,10,834
  9	david dobrik	20,06,263
  10	jacksepticeye	19,56,498
  11	joe rogan	19,22,619
  12	james charles	18,52,057
  13	baby shark	18,43,336
  14	bts	16,48,962
  15	dantdm	16,48,379
  16	snl	15,69,452
  17	game grumps	13,99,182
  18	cnn	13,83,248
  19	wwe	13,51,784
  20	lofi	13,17,905
  21	minecraft	12,94,920
  22	shane dawson	12,18,344
  23	fox news	11,94,207
  24	msnbc	11,62,435
  25	mrbeast	11,55,660
  26	fgteev	11,32,139
  27	ssundee	11,30,356
  28	lofi hip hop	11,15,248
  30	gacha life	10,88,275
  31	stephen colbert	10,71,076
  32	flamingo	10,53,715
  33	ariana grande	10,45,804
  34	nightcore	99,2960
  35	songs	94,5140
  36	jake paul	938,932
  37	lazarbeam	921,944
  38	tyt	905,280
  39	eminem	901,503
  40	taylor swift	894,841
  41	post malone	888,713
  42	vanossgaming	888,357
  43	memes	871,174
  44	jeffree star	861,302
  45	trump	853,570
  46	study music	840,359
  47	cardi b	833,307
  48	juice wrld	809,349
  49	game of thrones	807,388
  50	espn	801,990
  51	unspeakable	794,403
  52	john oliver	784,305
  53	logan paul	775,211
  54	nba youngboy	770,299
  55	try not to laugh	766,004
  56	blackpink	761,919
  57	coryxkenshin	759,131
  58	avengers endgame	752,274
  59	roblox	735,723
  60	andrew yang	732,854
  61	dude perfect	730,066
  62	last week tonight	726,970
  63	peppa pig	725,073
  64	mr beast	715,461
  65	chad wild clay	708,328
  66	dunkey	706,010
  67	ufc	699,040
  68	game theory	693,334
  69	nfl	688,779
  70	jre	687,693
  71	buzzfeed unsolved	682,198
  72	popularmmos	679,442
  73	drake	679,361
  74	borderlands 3	670,494
  75	ninja	670,413
  76	colbert	669,343
  77	sml	662,973
  78	tik tok	658,256
  79	itsfunneh	652,226
  80	undisputed	651,707
  81	ben shapiro	650,475
  82	seth meyers	650,378
  83	rachel maddow	648,303
  84	projared	641,203
  85	pokemon sword and shield	640,846
  86	jeffy	640,603
  87	trevor noah	640,279
  88	critical role	637,750
  89	trisha paytas	636,567
  90	blippi	634,897
  91	gmm	623,242
  92	first take	622,691
  93	nintendo	620,470
  94	queen	619,303
  95	sssniperwolf	618,963
  96	ryans toy review	611,976
  97	tati	604,341
  98	funny videos	601,083
  99	sis vs bro	599,916
  100	jenna marbles`;

  const filteredDataArray = data
    .replace(/[\t\n\,]/g, "")
    .replace(/[\d]/g, ";")
    .split(";")
    .filter((term) => term.trim().length !== 0);
  const samples = _.sampleSize(filteredDataArray, numOfTerms);
  return samples;
};

export const bannerVideos = [
  {
    title: "Ironman",
    subtitle: "The rich dude in an iron suit of armor",
    videoId: "8ugaeA-nMTc",
    imageUrl: "/static/ironman.webp",
  },
  {
    title: "Doctor Pelik",
    subtitle: "Benedict Cucumber in the multiverse of kegilaan",
    videoId: "Rf8LAYJSOL8",
    imageUrl: "/static/strange.webp",
  },
  {
    title: "DUMMO",
    subtitle: "I don't know what planet I'm on",
    videoId: "wrvN87l3s08",
    imageUrl: "/static/dummo.webp",
  },
];

export const getRandomBannerVideo = () => {
  return _.sample(bannerVideos);
};
