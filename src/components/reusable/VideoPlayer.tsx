import { forwardRef, useEffect, useState } from "react";
import YouTubePlayer from "react-player/youtube";
import ReactPlayer, { YouTubePlayerProps } from "react-player/youtube";

const VideoPlayer = forwardRef<YouTubePlayer, YouTubePlayerProps>(
  ({ ...props }, ref) => {
    const [hasWindow, setHasWindow] = useState(false);

    useEffect(() => {
      if (typeof window !== "undefined") {
        setHasWindow(true);
      }
    }, []);

    return hasWindow ? <ReactPlayer ref={ref} {...props} /> : <></>;
  }
);

VideoPlayer.displayName = "VideoPlayer";
export default VideoPlayer;
