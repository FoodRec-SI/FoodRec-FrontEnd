import { Skeleton } from 'primereact/skeleton';

const SkeletonCard = () => {
    return (
        <div className='recipeCard_Skeleton' style={{ width: "270px" }}>
            <Skeleton height='160px'></Skeleton>
            <div style={{ paddingTop: "10px" }}>
                <Skeleton height='24px' width='70%' ></Skeleton>
            </div>
            <div style={{ paddingTop: "10px", paddingBottom: "3px" }}>
                <Skeleton height='16px' ></Skeleton>
            </div>
            <div style={{ paddingBottom: "3px",}}>
                <Skeleton height='16px' ></Skeleton>
            </div>
            <div style={{paddingBottom: "5px", borderBottom: "1px solid #a29e9e" }}>
                <Skeleton height='16px' ></Skeleton>
            </div>
            <div style={{ paddingTop: "3px", marginBottom:"30px" }}>
                <Skeleton height='24px' width='100%' ></Skeleton>
            </div>
        </div>
    );
}

export default SkeletonCard;