import { useEffect, useState } from "react";
import { default as ChannelsList } from "./components/Channels";
import Player from "./components/Player";

function App() {
  const [loading, setLoading] = useState(true);
  const [videos, setVideos] = useState([]);
  const [currentVideo, setCurrentVideo] = useState({});
  const [channels, setChannels] = useState([]);
  const [watchedIds, setWatched] = useState([]);

  useEffect(() => {
    let tempChannels = JSON.parse(localStorage.getItem("channels"));
    if (tempChannels) setChannels(tempChannels);
    tempChannels = null;

    let tempWatched = JSON.parse(localStorage.getItem("watched"));
    if (tempWatched) setWatched(tempWatched);
    tempWatched = null;

    return () => {
      setLoading(true);
      setVideos([]);
      setCurrentVideo({});
      setChannels([]);
      setWatched([]);
    };
  }, []);

  function getVideos() {
    let unsortedVideos = [];
    for (let ch of channels) {
      let urlParams = {
        type: ch.type,
        id: ch.type === "playlist" ? ch.playlistId : ch.channelId,
      };
      fetch("/newstube/videos?" + new URLSearchParams(urlParams))
        .then((res) => res.json())
        .then((res) => {
          unsortedVideos.push(res);
          if (unsortedVideos.length === channels.length) {
            sortVideos(unsortedVideos.flat());
          }
        });
    }
  }

  function sortVideos(arr) {
    let sortedArr = arr.sort((a, b) => {
      return Date.parse(b.published) - Date.parse(a.published);
    });
    sortedArr = sortedArr.filter((e) => !watchedIds.includes(e.id));
    if (Object.keys(currentVideo).length) {
      sortedArr = sortedArr.filter((e) => e.id !== currentVideo.id);
      setVideos(sortedArr.slice(0, 15));
    } else {
      setCurrentVideo(sortedArr[0]);
      setVideos(sortedArr.slice(1, 15));
    }
    if (loading) setLoading(false);
  }

  if (!loading && videos.length) {
    return (
      <div className="main">
        <Player
          videos={videos}
          setVideos={setVideos}
          currentVideo={currentVideo}
          setCurrentVideo={setCurrentVideo}
          channels={channels}
          setChannels={setChannels}
          getVideos={getVideos}
        />
      </div>
    );
  } else {
    return (
      <div className="main">
        <ChannelsList
          channels={channels}
          setChannels={setChannels}
          getVideos={getVideos}
        />
      </div>
    );
  }
}

export default App;
