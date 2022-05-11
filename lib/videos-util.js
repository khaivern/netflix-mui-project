import dummyVideoData from "../data/videos.json";
import axios from "axios";

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
    console.log(err);
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
    const videoItemsArray = videoData.items || dummyVideoData.items;
    return buildVideoMainMap(videoItemsArray);
  } catch (err) {
    console.log(err);
    return [];
  }
};

export const getPopularVideos = async () => {
  try {
    const videoData = await sendRequest(
      `${baseUrl}videos?part=snippet%2CcontentDetails%2Cstatistics&chart=mostPopular&regionCode=US&key=${process.env.YOUTUBE_API_KEY}`
    );
    if (videoData.error) {
      throw new Error("Error from sending popular request to Youtube", videoData.error);
    }
    const videoItemsArray = videoData.items || dummyVideoData.items;
    return buildVideoMainMap(videoItemsArray);
  } catch (err) {
    console.log(err);
    return [];
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
    console.log(err);
    return {};
  }
};
