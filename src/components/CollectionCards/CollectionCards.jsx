import "./CollectionCards.css";
import { useState } from "react";
import AddCircleOutlineRoundedIcon from "@mui/icons-material/AddCircleOutlineRounded";
import { Link } from "react-router-dom";
import { CollectionApi } from "../../api/CollectionApi";
import { useKeycloak } from "@react-keycloak/web";
import { useQuery } from "react-query";
import {useMutation} from 'react-query';
import { useQueryClient } from "react-query";

const CollectionCards = () => {

  const [isEditing, setIsEditing] = useState(false);

  const [collectionName, setCollectionName] = useState("");

  const queryClient = useQueryClient();

  const { keycloak } = useKeycloak();

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const description = "1";
    const response =  await CollectionApi.createCollection({collectionName , description},keycloak.token);
    if (response.status === 200) {
      setCollectionName("");
    }
    setIsEditing(false);
  };


  const {mutate : addCollection} = useMutation(handleSave, {
    onSuccess: () => {
      queryClient.invalidateQueries('collections')
    }
  })


  const fetchCollections = async ({pageParam= 0,pageSize = 30}) => {
    const response = await CollectionApi.getCollection(pageParam,pageSize,keycloak.token);
    return response.data.content;
  };

  const { data : items , status } = useQuery(
    "collections", 
    fetchCollections,
  );

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  console.log(items);

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
              <span className="create-collection-text font-bold" >
                New Collection
              </span>
            </button>
            </>
                )}
         
            {isEditing && ( 
              <>
            <form onSubmit={addCollection}>
            <input
                className="add-collection-input"
                maxLength="20"
                type="text"
                placeholder="Collection Name"
                name="collectionName"
                value={collectionName}
                onChange={(e) => setCollectionName(e.target.value)}
              />
              </form>
        
            <div className="save-cancel-block font-bold">
              <div role="button" className="action primary" onClick={addCollection}>
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
      {items && items.map((item) => (
        <CollectionCard
          key={item.collectionId}
          collectionName={item.collectionName}
          collectionImage={item.image ? item.image : "src/assets/healthyFood.jpg"}
          collectionDescription={item.description}
          id={item.collectionId}
          numberOfRecipes={item.countPost}
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
        <Link to={`/collection/${props.id}`}
          title={props.collectionName}
          aria-label={props.collectionName}
          style={{ backgroundImage: `url(${props.collectionImage})` }}
        />
      </div>
      <Link to={`/collection/${props.id}`}
        title={props.collectionName}
        aria-label={props.collectionName}
      >
        <div className="bottom-content">
          <p>{props.collectionName}</p>
          <div className="flex-expander"></div>
          <p className="count">
            <span>
              {props.numberOfRecipes}
              <span className="count-recipes"> RECIPE </span>
            </span>
          </p>
        </div>
      </Link>
    </div>
  );
};
