
import CollectionCards from "../../components/CollectionCards/CollectionCards";

const Collection = () => {
  return ( 
    <div className="collection-page-container">
      <h1
      style={{margin: "1rem"}}
      >Collections</h1>
      <CollectionCards/>
    </div>
   );
}
 
export default Collection;