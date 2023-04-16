import { faListAlt } from "@fortawesome/free-regular-svg-icons";
import { faTimes, faTvAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Channel({ info, i, removeChannel }) {
  // if(info.type === "playlist") console.log(info)
  const { thumbnail, url, channelName, type, playlistName } = info;
  // if(type === "playlist"){
  //   const {playlistName} = info
  // }
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
          <FontAwesomeIcon icon={type === "playlist" ? faListAlt : faTvAlt} />{" "}
          {channelName}
          {type === "playlist" ? `: ${playlistName}` : null}
        </p>
      </a>
      <button
        className="channels-list-close"
        onClick={() => removeChannel(i)}
      >
        <FontAwesomeIcon icon={faTimes} />
      </button>
    </li>
  );
}
