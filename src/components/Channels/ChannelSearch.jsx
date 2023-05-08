import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Channel from "./Channel";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useMemo } from "react";

export default function ChannelSearch({
  searchResults,
  setSearchResults,
  channels,
  addChannel,
  term,
  setTerm,
}) {
  const channelIds = useMemo(
    () => channels.map((ch) => (ch.playlistId ? ch.playlistId : ch.channelId)),
    [channels]
  );

  function closeSearch() {
    setSearchResults({ channels: [], playlists: [], active: false });
    setTerm("");
  }

  useEffect(() => {
    document.title = `"${term}" - Search Results | Newstube`;
  }, [term]);

  return (
    <div className="channels-search">
      <span className="search-header">
        <h1>Channels</h1>
        <button className="button" onClick={closeSearch}>
          <span>
            <p>
              <FontAwesomeIcon icon={faTimes} />
            </p>
            <p>Close</p>
          </span>
        </button>
      </span>
      <ul className="channels-list">
        {searchResults.channels.map((ch, i) => {
          if (!channelIds.includes(ch.channelId))
            return <Channel key={i} i={i} info={ch} addChannel={addChannel} />;
          return null;
        })}
      </ul>
      <span className="search-header">
        <h1>Playlists</h1>
        <button className="button" onClick={closeSearch}>
          <span>
            <p>
              <FontAwesomeIcon icon={faTimes} />
            </p>
            <p>Close</p>
          </span>
        </button>
      </span>{" "}
      <ul className="channels-list">
        {searchResults.playlists.map((ch, i) => {
          if (!channelIds.includes(ch.playlistId))
            return <Channel key={i} i={i} info={ch} addChannel={addChannel} />;
          return null;
        })}
      </ul>
    </div>
  );
}
