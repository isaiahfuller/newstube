import React from "react";
import ReactPlayer from "react-player/youtube";
export default function Video({
  id,
  videos,
  setVideos,
  setCurrentVideo,
  getVideos,
  watchedIds,
  setWatched,
}) {

  function onStart(e) {
    getVideos();
    localStorage.setItem("watched", JSON.stringify(watchedIds))
    document.title = `${id.title} | Newstube`
  }

  function onEnded(e) {
    setCurrentVideo(videos[0]);
    setVideos([...videos].slice(1));
    setWatched([...watchedIds, id.id]);
  }

  return (
    <div className="video-player">
      <ReactPlayer
        url={`https://youtu.be/${id.id}`}
        onStart={onStart}
        onEnded={onEnded}
        playing={true}
        controls={true}
        width="100%"
        height="100%"
      />
    </div>
  );
}
