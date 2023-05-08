import React, { useEffect, useRef, useState } from "react";
import Channel from "./Channel";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileImport,
  faPlay,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import ChannelSearch from "./ChannelSearch";

export default function Channels({ channels, setChannels, getVideos }) {
  const [url, setUrl] = useState("");
  const [searchResults, setSearchResults] = useState({
    channels: [],
    playlists: [],
    active: false,
  });
  const matchRegex = /youtube.com\/(channel|user|c|@)[/\w\-_]+/;
  const inputFile = useRef(null);

  useEffect(() => {
    document.title = "Newstube";
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    addSource();
  }

  function addSource(source = url) {
    if (source.match(matchRegex) || source.startsWith("@")) {
      fetch(
        "/newstube/channel?" +
          new URLSearchParams({
            url: source.startsWith("@")
              ? "https://youtube.com/" + source
              : source,
          })
      )
        .then((res) => res.json())
        .then((res) => {
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
            setUrl("");
          }
        });
    } else if (source.includes("?list=")) {
      fetch("/newstube/channel?" + new URLSearchParams({ url: source }))
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
                url: source,
                type: "playlist",
              },
            ];
            sortChannels(temp);
            localStorage.setItem("channels", JSON.stringify(temp));
            setUrl("");
          }
        });
    } else {
      const channels = [];
      const playlists = [];
      setSearchResults({ ...searchResults, active: true });
      fetch(
        "/newstube/search?" +
          new URLSearchParams({ term: source, type: "channel" })
      )
        .then((res) => res.json())
        .then((res) => {
          for (const ch of res) {
            let thumbnail = ch.author.thumbnails[1].url;
            if (thumbnail.startsWith("//")) thumbnail = "https:" + thumbnail;
            channels.push({
              channelId: ch.author.id,
              channelName: ch.author.name,
              thumbnail: thumbnail,
              url: ch.author.url,
              type: "channel",
            });
          }
          fetch(
            "/newstube/search?" +
              new URLSearchParams({ term: source, type: "playlist" })
          )
            .then((res) => res.json())
            .then((res) => {
              for (const pl of res) {
                playlists.push({
                  channelId: pl.author.id,
                  channelName: pl.author.name,
                  playlistName: pl.title.text,
                  playlistId: pl.id,
                  thumbnail: pl.thumbnails[0].url,
                  url: "https://www.youtube.com/playlist?list=" + pl.id,
                  type: "playlist",
                });
              }
              setSearchResults({
                channels: channels,
                playlists: playlists,
                active: true,
              });
            });
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
        <form onSubmit={handleSubmit} className="channels-form">
          <input
            name="url"
            className="source-input"
            placeholder="Search or add from URL..."
            onChange={(e) => setUrl(e.target.value)}
            value={url}
          />
          <button className="button" onClick={handleSubmit}>
            <span>
              <p>
                <FontAwesomeIcon icon={faSearch} />
              </p>{" "}
              <p>Search</p>
            </span>
          </button>
        </form>
        <div className="channels-buttons">
          <div className="flex-grow" />
          <button className="button" onClick={() => inputFile.current.click()}>
            <span>
              <p>
                <FontAwesomeIcon icon={faFileImport} />
              </p>
              <p>Import</p>
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
              <span>
                <p>
                  <FontAwesomeIcon icon={faPlay} />
                </p>
                <p>Play</p>
              </span>
            </button>
          ) : null}
        </div>
      </div>
      <hr className="p-1" />
      <div className="channels-bottom">
        {searchResults.active ? (
          <ChannelSearch
            searchResults={searchResults}
            setSearchResults={setSearchResults}
            channels={channels}
            addChannel={addSource}
            term={url}
            setTerm={setUrl}
          />
        ) : (
          <ul className="channels-list">
            {channels.map((ch, i) => (
              <Channel key={i} i={i} info={ch} removeChannel={removeChannel} />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
