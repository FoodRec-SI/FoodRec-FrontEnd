import './skeleton.css'
import { Skeleton } from 'primereact/skeleton';



const SkeletonRecipeDetail = () => {
    return (
        <div className="skeleton-wrapper">
            <div className="skeleton-image"
                style={{
                    width: "95%",
                    margin: "0 auto"

                }}
            >
                <Skeleton height='400px' />
            </div>
            <div className='skeleton-introduction'
                style={{ width: "95%", padding: "20px" }}
            >
                <Skeleton height='3em' className="mb-2" width='50%' />
                <Skeleton className="mb-2" width='200px' />
                <Skeleton width='170px' height='30px' />
                <div className="skeleton_tag" style={{ display: "flex", padding: "10px" }}>
                    <Skeleton width='100px' height='30px' className="mr-2" borderRadius='25px' />
                    <Skeleton width='100px' height='30px' className="mr-2" borderRadius='25px' />
                    <Skeleton width='100px' height='30px' className="mr-2" borderRadius='25px' />
                    <Skeleton width='100px' height='30px' className="mr-2" borderRadius='25px' />
                </div>
                <div className="skeleton_button" style={{ display: "flex", padding: "10px" }}>
                    <Skeleton shape='circle' size='50px' className="mr-2" />
                    <Skeleton shape='circle' size='50px' className="mr-2" />
                    <Skeleton shape='circle' size='50px' className="mr-2" />
                </div>
                <div className='skeleton_statistic' style={{ display: "flex" }}>
                    <Skeleton width='60px' height='120px' className="mr-4" borderRadius='25px' />
                    <Skeleton width='60px' height='120px' className="mr-4" borderRadius='25px' />
                    <Skeleton width='60px' height='120px' className="mr-4" borderRadius='25px' />
                </div>

            </div>
            <div className="skeleton-ingredients" style={{ padding: "20px" }}>
                <Skeleton width='250px' height='30px' />
                <div className="skeleton-ingredients-list" style={{ marginTop: "30px" }}>
                    <Skeleton width='250px' height='20px' className="mb-2" />
                    <Skeleton width='300px' height='20px' className="mb-2" />
                    <Skeleton width='270px' height='20px' className="mb-2" />
                    <Skeleton width='190px' height='20px' className="mb-2" />
                    <Skeleton width='200px' height='20px' className="mb-2" />
                    <Skeleton width='250px' height='20px' className="mb-2" />
                    <Skeleton width='240px' height='20px' className="mb-2" />

                </div>
            </div>
            <div className='skeleton-description' style={{ padding: "20px" }}>
                <Skeleton height='30px' width='300px' className="mb-2" />
                <Skeleton height='300px' width='100%' />
            </div>
            <div className='skeleton-instruction' style={{ gridColumn: " 1/3",marginTop:"20px" }}>
                <Skeleton height='30px' className="mb-2" width='200px'/>
                <Skeleton height='200px' />
            </div>
        </div>
    );
}

export default SkeletonRecipeDetail;