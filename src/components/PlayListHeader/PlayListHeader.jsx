import "./PlayListHeader.css";


const PlayListHeader = () => {
  
  return (
    <div className="playlist-header" >
      <div className="playlist-wrapper">
        <div className="playlist-not-scroll">
        <div className="playlist-header-image">
          <img src="./src/assets/healthyFood.jpg" alt="" />
        </div>
        <div className="playlist-header-title">Liked Recipes</div>
        <div className="playlist-detail">
          <div className="playlist-owner">User...</div>
        <div className="playlist-sub-detail">
          <div className="playlist-header-subtitle">3 recipes</div>
          <div className="playlist-update-time">Last update on 1 June 2023</div>
          </div>  
        </div>
      </div>
      </div>
    </div>
  );
};

export default PlayListHeader;
