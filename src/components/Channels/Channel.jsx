export default function Channel({info, i, removeChannel}){
  // if(info.type === "playlist") console.log(info)
  const {thumbnail, url, channelName, type, playlistName} = info
  // if(type === "playlist"){
  //   const {playlistName} = info
  // }
  return (
    <li key={i} className="flex justify-between">
      <div className="channels-list-element">
        <img src={thumbnail} />
        <a href={url} target="_blank" rel="noreferrer">
          <div className="p-2">
            <p>{channelName}{type === "playlist" ? `: ${playlistName}` : null}</p>
          </div>
        </a>
      </div>
      <p>{type}</p>
      <button className="px-5" onClick={() => removeChannel(i)}>
        X
      </button>
    </li>
  );
}