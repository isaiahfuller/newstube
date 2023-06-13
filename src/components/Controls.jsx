import {
  faDownLeftAndUpRightToCenter,
  faFileExport,
  faForward,
  faStop,
  faUpRightAndDownLeftFromCenter,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
export default function Controls({
  currentVideo,
  videos,
  setVideos,
  setCurrentVideo,
  watchedIds,
  setWatched,
  full,
  setFull
}) {
  function skip() {
    const nextVideo = videos[0];
    const newVideos = videos.slice(1);
    setVideos(newVideos);
    setWatched([...watchedIds, currentVideo.id]);
    setCurrentVideo(nextVideo);
  }
  function playerSize(){
    setFull(!full)
  }
  const expand = (
    <button onClick={playerSize} title="Hide video queue">
      <FontAwesomeIcon icon={faUpRightAndDownLeftFromCenter} />
    </button>
  );

  const hide = (
    <button onClick={playerSize} title="Show video queue">
      <FontAwesomeIcon icon={faDownLeftAndUpRightToCenter} />
    </button>
  );  return (
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
      {full ? hide : expand}
    </div>
  );
}
