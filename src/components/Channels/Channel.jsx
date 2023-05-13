import { faListAlt } from "@fortawesome/free-regular-svg-icons";
import { faPlus, faTimes, faTvAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Channel({
  info,
  i,
  removeChannel = null,
  addChannel = null,
}) {
  const { thumbnail, url, channelName, type, playlistName } = info;

  return (
    <li key={i} className="channels-list-element">
      <a
        className="channels-list-link"
        href={url}
        target="_blank"
        rel="noreferrer"
      >
        <img src={thumbnail} alt="" />
        <p className="channels-list-title">
          {removeChannel ? (
            <FontAwesomeIcon icon={type === "playlist" ? faListAlt : faTvAlt} />
          ) : null}{" "}
          {channelName}
          {type === "playlist" ? `: ${playlistName}` : null}
        </p>
      </a>
      <button
        className="channels-list-close"
        onClick={() => (removeChannel ? removeChannel(i) : addChannel(url))}
      >
        <FontAwesomeIcon icon={removeChannel ? faTimes : faPlus} />
      </button>
    </li>
  );
}
