import React, { useEffect, useMemo, useRef, useState } from "react";
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
  const [loading, setLoading] = useState(true);
  const matchRegex = /youtube.com\/(channel|user|c|@)[/\w\-_]+/;
  const inputFile = useRef(null);
  const emptyList = useMemo(() => !channels.length);

  useEffect(() => {
    document.title = "Newstube";
    setLoading(false)
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    addSource();
  }

  function addSource(source = url) {
    if (source.match(matchRegex) || source.startsWith("@")) {
      return fetch(
        "/newstube/channel?" +
          new URLSearchParams({
            url: source.startsWith("@")
              ? "https://youtube.com/" + source
              : source,
          })
      )
        .then((res) => res.json())
        .then((res) => {
          let plCount = 0;
          let matching = channels.filter((e) => {
            if (e.channelId === res.header.author.id && "playlistId" in e)
              plCount++;
            return e.channelId === res.header.author.id;
          });
          if (!matching.length || matching.length === plCount) {
            const newChannelInfo = {
              channelId: res.header.author.id,
              channelName: res.header.author.name,
              thumbnail: res.header.author.thumbnails[1].url,
              url: res.header.author.url,
              type: "channel",
            };
            let temp = [...channels, newChannelInfo];
            sortChannels(temp);
            localStorage.setItem("channels", JSON.stringify(temp));
            setUrl("");
            return newChannelInfo;
          }
        });
    } else if (source.includes("?list=")) {
      return fetch("/newstube/channel?" + new URLSearchParams({ url: source }))
        .then((res) => res.json())
        .then((res) => {
          if (
            !channels.filter(
              (e) => e.playlistId === res.endpoint.payload.playlistId
            ).length
          ) {
            const newPlaylistInfo = {
              channelId: res.info.author.id,
              playlistId: res.endpoint.payload.playlistId,
              playlistName: res.info.title,
              channelName: res.info.author.name,
              thumbnail: res.info.author.thumbnails[1].url,
              url: source,
              type: "playlist",
            };
            let temp = [...channels, newPlaylistInfo];
            sortChannels(temp);
            localStorage.setItem("channels", JSON.stringify(temp));
            setUrl("");
            return newPlaylistInfo;
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
            if (ch.type === "ShowingResultsFor") continue;
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
                if (pl.type === "ShowingResultsFor") continue;
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

  async function setExampleList(type) {
    const newList = [];
    let urls;
    setLoading(true)
    switch (type) {
      case "gaming":
        urls = [
          "http://www.youtube.com/user/DigitalFoundry",
          "http://www.youtube.com/c/ForceGamingYT",
          "http://www.youtube.com/user/gameranxTV",
          "https://www.youtube.com/@jessecox",
          "http://www.youtube.com/c/kotaku",
          "http://www.youtube.com/c/MrSujano",
          "http://www.youtube.com/c/theScoreesports",
          "http://www.youtube.com/c/SkillUp",
          "https://www.youtube.com/@LukeStephensTV",
          "https://www.youtube.com/@gamespot",
          "https://www.youtube.com/@IGN",
          "https://www.youtube.com/@PlayStationAccess",
          "https://www.youtube.com/@GamingBolt",
          "https://www.youtube.com/@pcgamer",
          "https://www.youtube.com/@TheGamerUpdate",
        ];
        for (const url of urls) {
          let temp = await addSource(url);
          newList.push(temp);
        }
        break;
      case "tech":
        urls = [
          "https://www.youtube.com/playlist?list=PLsuVSmND84Qu-VT1jBNdAXWDhhtgUqErv",
          "http://www.youtube.com/c/Jayztwocents",
          "http://www.youtube.com/c/TheLinuxExperiment",
          "http://www.youtube.com/c/LMGClips",
          "https://www.youtube.com/@NoTextToSpeech",
          "https://www.youtube.com/playlist?list=PL3T6FdDHnjthQUVinzFGYRrZnKphzUFQt",
          "https://www.youtube.com/@BloombergTechnology",
          "https://www.youtube.com/@techlinked",
          "https://www.youtube.com/@paulshardware",
          "http://www.youtube.com/c/WaveformClips",
          "https://www.youtube.com/@TickerSymbolYOU",
          "https://www.youtube.com/@Tyrielwood",
          "https://www.youtube.com/@UFDTech",
          "https://www.youtube.com/@TrakinTech",
          "https://www.youtube.com/@mkbhd",
          "https://www.youtube.com/@TheVerge",
          "https://www.youtube.com/@CNET",
          "https://www.youtube.com/@DistroTube",
        ];
        for (const url of urls) {
          let temp = await addSource(url);
          newList.push(temp);
        }
        break;
      default:
        break;
    }
    console.log(newList);
    sortChannels(newList);
    setLoading(false)
  }
  if(loading) return <p>Loading...</p>
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
        ) : emptyList ? (
          <div className="welcome">
            <h1>Welcome to Newstube!</h1>
            <p>
              To get started, add some YouTube channels or playlists. You can
              use the bar above to search or link them directly.
            </p>
            <p>You can also get started with some example lists below.</p>
            <ul>
              <li onClick={() => setExampleList("gaming")}>Gaming</li>
              <li onClick={() => setExampleList("tech")}>Tech</li>
            </ul>
          </div>
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
