import { createContext, useState, useCallback } from "react";

const VideoContext = createContext({
  video: {},
  showVideo: () => {},
  closeVideo: () => {},
});

export default VideoContext;

export const VideoProvider = ({ children }) => {
  const [video, setVideo] = useState(null);

  // selectedVideo : {id, title, description}
  const showVideo = useCallback((selectedVideo) => setVideo(selectedVideo), []);

  const closeVideo = useCallback(() => setVideo(null), []);

  const store = { video, showVideo, closeVideo };

  return <VideoContext.Provider value={store}>{children}</VideoContext.Provider>;
};
