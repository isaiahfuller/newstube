import {
  faFileDownload,
  faFileExport,
  faForward,
  faStop,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
      <button onClick={skip} title="Skip current video and mark it as played">
        <FontAwesomeIcon icon={faForward} />
      </button>
      <button
        onClick={() => {
          setVideos([]);
        }}
        title="Stop playing and return to channel list"
      >
        <FontAwesomeIcon icon={faStop} />
      </button>
      <a
        href={`data:text/json;charset=utf-8,${encodeURIComponent(
          localStorage.getItem("channels")
        )}`}
        download="newstube.json"
        target="_blank"
        rel="noreferrer"
      >
        <button type="button" title="Export Channel List">
          <FontAwesomeIcon icon={faFileExport} />
        </button>
      </a>
    </div>
  );
}
