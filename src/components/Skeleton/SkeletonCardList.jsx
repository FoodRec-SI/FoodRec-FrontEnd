import SkeletonCard from "./SkeletonCard";

const SkeletonCardList = () => {
    return ( 
        <div className='recipeCardList_Skeleton'
            style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", marginTop: "20px" }}
        >
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
        </div>
     );
}
 
export default SkeletonCardList;