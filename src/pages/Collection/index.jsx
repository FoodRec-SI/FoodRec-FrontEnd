import CollectionCards from "../../components/CollectionCards/CollectionCards";

const Collection = () => {
  return (
    <div className="collection-outline">
      <div className="collection-header">
        <div className="collection-title">My Collection</div>
      </div>
      <div className="collection-container">
        {/* <div className="collection-instruction">
          <div>
            How It Works
          </div>
        </div> */}
        <div className="collection-wrapper">
          <CollectionCards />
        </div>
      </div>
    </div>
  );
};

export default Collection;
