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
  return (
    <div className="video-page">
      <Video
        id={currentVideo}
        videos={videos}
        setVideos={setVideos}
        setCurrentVideo={setCurrentVideo}
        getVideos={getVideos}
        watchedIds={watchedIds}
        setWatched={setWatched}
      />
      <div className="sidebar overflow-hidden">
        <Controls
          currentVideo={currentVideo}
          videos={videos}
          setVideos={setVideos}
          setCurrentVideo={setCurrentVideo}
          getVideos={getVideos}
          watchedIds={watchedIds}
          setWatched={setWatched}
        />
        <VideoList videos={videos} />
      </div>
    </div>
  );
}
