import { useEffect, useState } from "react";
import Channels from "./components/Channels";
import Controls from "./components/Controls";
import Video from "./components/Video";
import VideoList from "./components/VideoList";
// import ReactPlayer from "react-player/youtube";

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
      fetch(
        "https://isaiah.moe:4560/videos?" +
          new URLSearchParams({ url: ch.channelId })
      )
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
    sortedArr = sortedArr.filter(
      (e) => !watchedIds.includes(e["yt:videoId"])
    );
    if (Object.keys(currentVideo).length) {
      sortedArr = sortedArr.filter(
        (e) => e["yt:videoId"] !== currentVideo["yt:videoId"]
      );
      setVideos([...new Set(sortedArr)]);
    } else {
      setCurrentVideo(sortedArr[0]);
      setVideos(sortedArr.slice(1));
    }
    setLoading(false);
  }

  if (!loading && videos.length) {
    return (
      <div className="App">
        <div className="main">
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
      </div>
    );
  } else {
    return (
      <div className="App">
        <div className="main">
          <Channels
            videos={videos}
            setVideos={setVideos}
            setCurrentVideo={setCurrentVideo}
            channels={channels}
            setChannels={setChannels}
            getVideos={getVideos}
          />
        </div>
      </div>
    );
  }
}

export default App;
