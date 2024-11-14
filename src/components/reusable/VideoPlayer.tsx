import { useEffect, useState } from "react";
import ReactPlayer, { YouTubePlayerProps } from "react-player/youtube";

const VideoPlayer = ({ ...props }: YouTubePlayerProps) => {
  const [hasWindow, setHasWindow] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setHasWindow(true);
    }
  }, []);

  return hasWindow ? <ReactPlayer {...props} /> : <></>;
};

export default VideoPlayer;
