import { faTvAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
export default function VideoList({ videos }) {
  return (
    <div className="videolist">
      <ul>
        {videos.map((video) => (
          <li key={video.id} className="videolist-item" title={video.title}>
            <div className="videolist-video">
              <img
                src={`https://i3.ytimg.com/vi/${video.id}/maxresdefault.jpg`}
                alt={video.title}
              />
              <div className="videolist-text">
                <p>{video.title}</p>
                <p className="italic my-1 text-sm"><FontAwesomeIcon icon={faTvAlt} /> {video.author}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
