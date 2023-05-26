import { useMemo, useState } from "react";
import Controls from "./Controls";
import Video from "./Video";
import VideoList from "./VideoList";

export default function Player({
  videos,
  setVideos,
  currentVideo,
  setCurrentVideo,
  getVideos,
  watchedIds,
  setWatched,
}) {
  const [full, setFull] = useState(false);
  const pageClass = useMemo(
    () => "video-page" + (full ? " flex-col" : ""),
    [full]
  );

  const controls = (
    <Controls
      currentVideo={currentVideo}
      videos={videos}
      setVideos={setVideos}
      setCurrentVideo={setCurrentVideo}
      getVideos={getVideos}
      watchedIds={watchedIds}
      setWatched={setWatched}
      full={full}
      setFull={setFull}
    />
  );

  const sidebar = (
    <div className="sidebar overflow-hidden">
      {controls}
      <VideoList videos={videos} />
    </div>
  );

  return (
    <div className={pageClass}>
      <Video
        id={currentVideo}
        videos={videos}
        setVideos={setVideos}
        setCurrentVideo={setCurrentVideo}
        getVideos={getVideos}
        watchedIds={watchedIds}
        setWatched={setWatched}
        full={full}
      />
      {full ? controls : sidebar}
    </div>
  );
}
