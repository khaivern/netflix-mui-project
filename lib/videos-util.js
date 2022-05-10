import dummyVideoData from "../data/videos.json";
import axios from "axios";

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

const buildVideoMap = (videoDataArray) => {
  return videoDataArray.map((videoItem) => ({
    id: videoItem.id?.videoId || videoItem.id?.playlistId ||  videoItem.id,
    imageUrl: videoItem.snippet.thumbnails.high.url,
    title: videoItem.snippet.title,
    description: videoItem.snippet.description,
  }));
};

export const getVideos = async (query) => {
  try {
    const videoData = await sendRequest(
      `https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=6&q=${query}&key=${process.env.YOUTUBE_API_KEY}`
    );
    if (videoData.error) {
      throw new Error("Error from sending get request to Youtube", videoData.error);
    }
    const videoItemsArray = videoData.items || dummyVideoData.items;
    return buildVideoMap(videoItemsArray);
  } catch (err) {
    console.log(err);
    return [];
  }
};

export const getPopularVideos = async () => {
  try {
    const videoData = await sendRequest(
      `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&chart=mostPopular&regionCode=US&key=${process.env.YOUTUBE_API_KEY}`
    );
    if (videoData.error) {
      throw new Error("Error from sending popular request to Youtube", videoData.error);
    }
    const videoItemsArray = videoData.items || dummyVideoData.items;
    return buildVideoMap(videoItemsArray);
  } catch (err) {
    console.log(err);
    return [];
  }
  
};
