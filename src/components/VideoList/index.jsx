import React from "react";
export default function VideoList({ videos }) {
  return (
    <div className="videolist">
      <ul>
        {videos.map((video) => (
          <li key={video.videoId} className="videolist-item">
            <div className="videolist-video">
              {/* <img
                src={`https://i3.ytimg.com/vi/${video["yt:videoId"]}/maxresdefault.jpg`}
              /> */}
              <div className="videolist-text">
                <p>{video.title}</p>
                <p className="italic my-1 text-sm">{video.author.name}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
