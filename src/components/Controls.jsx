import React from "react";
export default function Controls({
  currentVideo,
  videos,
  setVideos,
  setCurrentVideo,
  getVideos,
  watchedIds,
  setWatched,
}) {
  function skip() {
    setWatched([...watchedIds, currentVideo["yt:videoId"]]);
    localStorage.setItem(
      "watched",
      JSON.stringify([...watchedIds, currentVideo["yt:videoId"]])
    );
    setCurrentVideo(videos[0]);
    setVideos([...videos].slice(1));
  }
  return (
    <div className="controls">
      <button onClick={skip}>Skip</button>
      <button
        onClick={() => {
          setVideos([]);
        }}
      >
        Channels
      </button>
      <a
        href={`data:text/json;charset=utf-8,${encodeURIComponent(
          localStorage.getItem("channels")
        )}`}
        download="newstube.json"
        target="_blank"
        rel="noreferrer"
      >
        <button type="button">Export</button>
      </a>
    </div>
  );
}
