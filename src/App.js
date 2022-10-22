import { useEffect, useState } from "react";
import RemoteStorage from "remotestoragejs";
import { default as ChannelsList } from "./components/Channels";
import Controls from "./components/Controls";
import Video from "./components/Video";
import VideoList from "./components/VideoList";

function App() {
  const [loading, setLoading] = useState(true);
  const [videos, setVideos] = useState([]);
  const [currentVideo, setCurrentVideo] = useState({});
  const [channels, setChannels] = useState([]);
  const [watchedIds, setWatched] = useState([]);

  let Channels = {
    name: "newstube",
    builder: function (privateClient, publicClient) {
      privateClient.declareType("channel", {
        channelId: "string",
        channelName: "string",
        thumbnail: "string",
        url: "string",
        subscribers: "string",
      });
      return {
        exports: {
          addChannel: (channel) => {
            let path = "/channels/" + channel.channelId;
            console.log(path);
            return privateClient
              .storeObject("channel", path, channel)
              .then(() => {
                return channel;
              });
          },
        },
      };
    },
  };

  const remoteStorage = new RemoteStorage({ modules: [Channels] });

  remoteStorage.access.claim("newstube", "rw");
  remoteStorage.caching.enable("/newstube/");
  let rsClient = remoteStorage.scope("/newstube/");

  rsClient.on("change", (e) => {
    // console.log(`remoteStorage change (${e.origin})`)
    // let tempChannels = [...channels]
    // console.log(typeof e.newValue)
    // console.log(e.newValue)
    // if(typeof e.newValue === undefined){
    // }
    // setChannels([...channels, e.newValue])
  });

  remoteStorage.on("error", (err) => console.error);
  remoteStorage.on("connected", () => console.log("remoteStorage connected"));
  remoteStorage.on("not-connected", () =>
    console.log("remoteStorage connected (anonymous)")
  );

  useEffect(() => {
    rsClient.getAll("/channels/").then((e) => {
      let tempChannels = [];
      for (const v of Object.values(e)) {
        tempChannels.push(v);
      }
      tempChannels.sort((a, b) => {
        let nameA = a.channelName.toLowerCase();
        let nameB = b.channelName.toLowerCase();
        nameA = nameA.startsWith("the")
          ? nameA.replace("the", "").trim()
          : nameA;
        nameB = nameB.startsWith("the")
          ? nameB.replace("the", "").trim()
          : nameB;
        return nameA > nameB;
      });
      setChannels(tempChannels);
    });

    let tempWatched = JSON.parse(localStorage.getItem("watched"));
    if (tempWatched) setWatched(tempWatched);

    setLoading(false);

    return () => {
      setLoading(true);
      setVideos([]);
      setCurrentVideo({});
      setChannels([]);
      setWatched([]);
      tempWatched = null;
    };
  }, []);

  function getVideos() {
    console.log("get");
    let unsortedVideos = [];
    for (let ch of channels) {
      fetch("/newstube/videos?" + new URLSearchParams({ url: ch.channelId }))
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
    console.log("sort");
    let sortedArr = arr.sort((a, b) => {
      return Date.parse(b.published) - Date.parse(a.published);
    });
    sortedArr = sortedArr.filter((e) => !watchedIds.includes(e["yt:videoId"]));
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
  } else if (!loading) {
    return (
      <div className="App">
        <div className="main">
          <ChannelsList
            videos={videos}
            setVideos={setVideos}
            setCurrentVideo={setCurrentVideo}
            channels={channels}
            setChannels={setChannels}
            getVideos={getVideos}
            rsClient={rsClient}
            remoteStorage={remoteStorage}
          />
        </div>
      </div>
    );
  }
}

export default App;
