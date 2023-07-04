import { Skeleton } from 'primereact/skeleton';
import './skeleton.css'

import SkeletonCardList from './SkeletonCardList';

const SkeletonProfile = () => {
    return (
        <div className='profile_skeleton' style={{
            width: "95%",
            margin: "0 auto",
            padding: "0",
            height: "100%",
            border: "1px solid #000000",
            borderRadius: "16px",
            paddingBottom: "20px",
            backgroundColor: "white"
        }}>
            <Skeleton height='50vh' borderRadius='16px 16px 0px 0px' />
            <div className="profile_skeleton_avatar" >
                <div className='profile_skeleton_avatar_img'>
                    <Skeleton shape="circle" size="200px" />
                </div>
                <div>
                    <Skeleton width='250px' height='30px' className='mb-2' />
                    <Skeleton width="60%" />
                </div>
            </div>

            <div className="profile_skeleton_info">
                <div className="profile_skeleton_info_reference" style={{ width: "32%", padding: "10px", backgroundColor: "f4f4f4", borderRadius: "16px" }}>
                    <Skeleton width='60%' height='30px' className='mb-2' />
                    <div className="skeleton_tag" style={{ display: "flex", padding: "10px" }}>
                        <Skeleton width='100px' height='30px' className="mr-2" borderRadius='25px' />
                        <Skeleton width='100px' height='30px' className="mr-2" borderRadius='25px' />
                        <Skeleton width='100px' height='30px' className="mr-2" borderRadius='25px' />
                        <Skeleton width='100px' height='30px' className="mr-2" borderRadius='25px' />
                    </div>
                </div>
                <div className="profile_skeleton_info_recipeList" style={{ width: "48%", padding:"20px" }}>
                    <SkeletonCardList />
                </div>
            </div>
        </div>
    );
}

export default SkeletonProfile;