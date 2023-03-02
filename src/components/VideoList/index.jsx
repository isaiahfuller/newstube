import React from "react";
export default function VideoList({ videos }) {
  return (
    <div className="videolist">
      <ul>
        {videos.map((video) => (
          <li key={video.id} className="videolist-item">
            <div className="videolist-video">
              {/* <img
                src={`https://i3.ytimg.com/vi/${video.id}/maxresdefault.jpg`}
                alt={video.title}
              /> */}
              <div className="videolist-text">
                <p>{video.title}</p>
                <p className="italic my-1 text-sm">{video.author}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
