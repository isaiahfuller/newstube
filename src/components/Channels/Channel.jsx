export default function Channel({i, thumbnail, url, channelName, removeChannel}){
  
  return (
    <li key={i} className="flex justify-between">
      <div className="channels-list-element">
        <img src={thumbnail} />
        <a href={url} target="_blank" rel="noreferrer">
          <div className="p-2">
            <p>{channelName}</p>
          </div>
        </a>
      </div>
      <button className="px-5" onClick={() => removeChannel(i)}>
        X
      </button>
    </li>
  );
}