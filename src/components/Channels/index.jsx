import React, { useRef, useState } from "react";
import Channel from "./Channel";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileImport, faPlay } from "@fortawesome/free-solid-svg-icons";

export default function Channels({
  channels,
  setChannels,
  getVideos,
}) {
  const [url, setUrl] = useState("");
  const matchRegex = /youtube.com\/(channel|user|c|@)[/\w\-_]+/;
  const inputFile = useRef(null);

  // useEffect(() => {
  //   if (channels.length) sortChannels();
  // }, []);

  function onSubmit(e) {
    e.preventDefault();
    if (url.match(matchRegex)) {
      fetch(
        "/newstube/channel?" +
          new URLSearchParams({
            url: url,
          })
      )
        .then((res) => res.json())
        .then((res) => {
          setUrl("");
          if (
            !channels.filter((e) => e.channelId === res.header.author.id).length
          ) {
            sortChannels([
              ...channels,
              {
                channelId: res.header.author.id,
                channelName: res.header.author.name,
                thumbnail: res.header.author.thumbnails[1].url,
                url: res.header.author.url,
                type: "channel",
              },
            ]);
          }
        });
    } else if (url.includes("?list=")) {
      fetch("/newstube/channel?" + new URLSearchParams({ url: url }))
        .then((res) => res.json())
        .then((res) => {
          if (
            !channels.filter(
              (e) => e.playlistId === res.endpoint.payload.playlistId
            ).length
          ) {
            let temp = [
              ...channels,
              {
                channelId: res.info.author.id,
                playlistId: res.endpoint.payload.playlistId,
                playlistName: res.info.title,
                channelName: res.info.author.name,
                thumbnail: res.info.author.thumbnails[1].url,
                url: url,
                type: "playlist",
              },
            ];
            sortChannels(temp);
            setUrl("");
            localStorage.setItem("channels", JSON.stringify(temp));
          }
        });
    }
  }

  function sortChannels(newChannels = [...channels]) {
    let temp = newChannels.sort((a, b) => {
      let channelA = a.channelName;
      let channelB = b.channelName;

      if (a.type === "playlist") channelA += ": " + a.playlistName;
      if (b.type === "playlist") channelB += ": " + b.playlistName;

      let lowA = channelA.toLowerCase().replace(/^the/, "").trim();
      let lowB = channelB.toLowerCase().replace(/^the/, "").trim();

      return lowA > lowB;
    });
    setChannels(temp);
    localStorage.setItem("channels", JSON.stringify(temp));
  }

  function removeChannel(index) {
    let tempChannels = [...channels];
    tempChannels.splice(index, 1);
    setChannels(tempChannels);
    saveChannels(tempChannels);
  }
  function saveChannels(newChannels = null) {
    localStorage.setItem("channels", JSON.stringify(newChannels || channels));
  }

  function startPlayer() {
    getVideos();
  }

  function importChannels(e) {
    let file = e.target.files[0];
    file.text().then((text) => {
      let newChannels = JSON.parse(text);
      // console.log(newChannels)
      for (let ch of newChannels) {
        if ("playlistId" in ch) {
          ch.type = "playlist";
        } else ch.type = "channel";
      }
      sortChannels(newChannels);
    });
  }

  return (
    <div className="channels">
      <div className="channels-top">
        <form onSubmit={onSubmit} className="channels-form">
          <input
            name="url"
            type="url"
            placeholder="YouTube channel/playlist URL"
            onChange={(e) => setUrl(e.target.value)}
            value={url}
          />
          <input type="submit" value="Add" className="button" />
        </form>
        <div className="channels-buttons">
          <div className="flex-grow" />
          <button
            className="button"
            onClick={() => inputFile.current.click()}
          >
            <span className="flex items-center">
              <FontAwesomeIcon icon={faFileImport} />
              <p className="px-2">Import</p>
            </span>
          </button>
          <input
            type="file"
            id="file"
            ref={inputFile}
            onChange={importChannels}
            className="hidden"
          />
          {channels.length ? (
            <button className="button" onClick={startPlayer}>
              <span className="flex items-center">
              <FontAwesomeIcon icon={faPlay} />
              <p className="px-2">Play</p>
              </span>
            </button>
          ) : null}
        </div>
      </div>
      <hr className="p-1" />
      <div className="channels-bottom">
        <ul className="channels-list">
          {channels.map((ch, i) => (
            <Channel
              key={i}
              i={i}
              info={ch}
              // thumbnail={ch.thumbnail}
              // url={ch.url}
              // channelName={ch.channelName}
              removeChannel={removeChannel}
              // type={ch.type}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}
