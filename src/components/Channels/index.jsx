import React, { useEffect, useRef, useState } from "react";
import Channel from "./Channel";

export default function Channels({
  channels,
  setChannels,
  getVideos,
}) {
  const [url, setUrl] = useState("");
  const matchRegex = /youtube.com\/(channel|user|c)\/[\w\-_]+/;
  const inputFile = useRef(null);

  useEffect(()=>{
    sortChannels()
  },[])

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
          if (!channels.filter((e) => e.channelId === res.authorId).length) {
            sortChannels([
              ...channels,
              {
                channelId: res.authorId,
                channelName: res.author,
                thumbnail: res.authorThumbnails[1].url,
                url: res.authorUrl,
              },
            ])
            localStorage.setItem(
              "channels",
              JSON.stringify([
                ...channels,
                {
                  channelId: res.authorId,
                  channelName: res.author,
                  thumbnail: res.authorThumbnails[1].url,
                  url: res.authorUrl,
                },
              ])
            );
          }
        });
    }
  }

  function sortChannels(newChannels=[...channels]){
    newChannels.sort((a,b) => {
      let lowA = a.channelName.toLowerCase().replace(/^the/,'').trim()
      let lowB = b.channelName.toLowerCase().replace(/^the/,'').trim()

      return lowA > lowB
    })
    setChannels(newChannels)
  }

  function removeChannel(index) {
    let tempChannels = [...channels];
    tempChannels.splice(index, 1);
    setChannels(tempChannels);
    saveChannels();
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
      setChannels(JSON.parse(text));
      localStorage.setItem("channels", text);
    });
  }

  return (
    <div className="channels">
      <div className="channels-top">
        <form onSubmit={onSubmit} className="channels-form">
          <input
            name="url"
            type="url"
            placeholder="YouTube channel URL"
            onChange={(e) => setUrl(e.target.value)}
            value={url}
          />
          <input type="submit" value="Add" className="button" />
        </form>
        <div className="channels-buttons">
          <button className="button" onClick={() => inputFile.current.click()}>
            Import
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
              Save
            </button>
          ) : null}
        </div>
      </div>
      <hr />
      <ul className="channels-list">
        {channels.map((ch, i) => (
          <Channel
            i={i}
            thumbnail={ch.thumbnail}
            url={ch.url}
            channelName={ch.channelName}
            removeChannel={removeChannel}
          />
        ))}
      </ul>
    </div>
  );
}
