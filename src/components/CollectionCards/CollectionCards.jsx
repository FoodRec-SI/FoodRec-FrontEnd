import "./CollectionCards.css";
import { useState } from "react";
import AddCircleOutlineRoundedIcon from "@mui/icons-material/AddCircleOutlineRounded";

const CollectionCards = () => {

  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSave = () => {
    setIsEditing(false);
    // write your save logic here
  };


  const items = [
    {
      id: 1,
      collectionName: "Summer Salads",
      collectionImage: "./src/assets/healthyFood.jpg",
      numberOfRecipes: 10,
    },
    {
      id: 2,
      collectionName: "Weeknight Dinners",
      collectionImage: "./src/assets/healthyFood.jpg",
      numberOfRecipes: 20,
    },
    {
      id: 3,
      collectionName: "Holiday Baking",
      collectionImage: "./src/assets/bcb112771cb88230bbe7374e9f43bd1a.jpg",
      numberOfRecipes: 15,
    },
    
  ];

  return (
    <div className="collection-cards">
      <div className={`collection-card ${isEditing ? "add-collection is-editing" : "add-collection"}`}>
        <div className="content">
          <div className="inner-content">
          {!isEditing && ( 
              <>
            <button
              title="New Collection"
              aria-label="New Collection"
              className="button create-collection-button"
              onClick={handleEdit}
            >
              <span >
                <AddCircleOutlineRoundedIcon className="icon y-icon"/>
              </span>
              <span className="create-collection-text font-bold">
                New Collection
              </span>
            </button>
            </>
                )}
         
            {isEditing && ( 
              <>
            <input
                className="add-collection-input"
                maxLength="40"
                placeholder="Collection Name"
              />
        
            <div className="save-cancel-block font-bold">
              <div role="button" className="action primary" onClick={handleSave}>
                Save
              </div>
              <div role="button" className="action secondary" onClick={handleCancel}>
                Cancel
              </div>
            </div>
            </>
               )}
          </div>
        </div>
      </div>
      {items.map((item) => (
        <CollectionCard
          key={item.id}
          id={item.id}
          collectionName={item.collectionName}
          collectionImage={item.collectionImage}
          numberOfRecipes={item.numberOfRecipes}
        />
      ))}
    </div>
  );
};

export default CollectionCards;

const CollectionCard = (props) => {
  return (
    <div className="collection-card">
      <div className="collection-card-content">
        <a
          title={props.collectionName}
          aria-label={props.collectionName}
          href={`/collection/${props.id}`}
          style={{ backgroundImage: `url(${props.collectionImage})` }}
        />
      </div>
      <a
        title={props.collectionName}
        aria-label={props.collectionName}
        href={`/collection/${props.id}`}
      >
        <div className="bottom-content">
          <p>{props.collectionName}</p>
          <div className="flex-expander"></div>
          <p className="count">
            <span>
              {props.numberOfRecipes}
              <span className="count-recipes"> RECIPE</span>
            </span>
          </p>
        </div>
      </a>
    </div>
  );
};
