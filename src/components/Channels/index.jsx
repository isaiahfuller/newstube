import React, { useEffect, useRef, useState } from "react";

export default function Channels({
  videos,
  setVideos,
  setCurrentVideo,
  channels,
  setChannels,
  getVideos,
}) {
  const [url, setUrl] = useState("");
  const matchRegex = /youtube.com\/(channel|user|c)\/[\w\-_]+/;
  const inputFile = useRef(null);

  function onSubmit(e) {
    e.preventDefault();
    if (url.match(matchRegex)) {
      fetch(
        "https://isaiah.moe:4560/channel?" +
          new URLSearchParams({
            url: url,
          })
      )
        .then((res) => res.json())
        .then((res) => {
          setUrl("");
          if (!channels.filter((e) => e.channelId === res.authorId).length) {
            setChannels([
              ...channels,
              {
                channelId: res.authorId,
                channelName: res.author,
                thumbnail: res.authorThumbnails[1].url,
                url: res.authorUrl,
                subscribers: res.subscriberText,
              },
            ]);
            localStorage.setItem(
              "channels",
              JSON.stringify([
                ...channels,
                {
                  channelId: res.authorId,
                  channelName: res.author,
                  thumbnail: res.authorThumbnails[1].url,
                  url: res.authorUrl,
                  subscribers: res.subscriberText,
                },
              ])
            );
          }
        });
    }
  }

  function removeChannel(index) {
    let temp = [...channels];
    temp.splice(index, 1);
    setChannels(temp);
  }

  function saveChannels() {
    getVideos();
    localStorage.setItem("channels", JSON.stringify(channels));
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
            <button className="button" onClick={saveChannels}>
              Save
            </button>
          ) : null}
        </div>
      </div>
      <hr />
      <ul className="channels-list">
        {channels.map((ch, i) => {
          return (
            <li key={i} className="flex justify-between">
              <div className="channels-list-element">
                <img src={ch.thumbnail} />
                <a href={ch.url} target="_blank" rel="noreferrer">
                  <div className="p-2">
                    <p>{ch.channelName}</p>
                    <p className="text-sm">{ch.subscribers}</p>
                  </div>
                </a>
              </div>
              <button className="px-5" onClick={() => removeChannel(i)}>
                X
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
