import { useState } from 'react';

import { Button } from '@mui/material';
import TextField from '@mui/material/TextField';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';

import { Button as PButton } from 'primereact/button';
import { Dialog } from 'primereact/dialog';

import { useNavigate } from 'react-router-dom';

import { useKeycloak } from "@react-keycloak/web";
import { useQuery } from 'react-query';

import { PersonalRecipeApi } from '../../api/PersonalRecipeApi';
import { ProfileApi } from '../../api/ProfileApi';

import ChipList from '../ChipList/ChipList';
import RecipeCardList from '../RecipeCardList/RecipeCardList'
import './Profile.css'

const Profile = () => {

    const navigate = useNavigate();

    const { keycloak } = useKeycloak();

    const [visible, setVisible] = useState(false);

    const footerContent = (
        <div>
            <PButton label="Cancel" icon="pi pi-times" onClick={() => setVisible(false)} className="p-button-text" />
            <PButton label="Save" icon="pi pi-check" onClick={() => setVisible(false)} autoFocus />
        </div>
    );

    const userId = keycloak.tokenParsed.sub;

    const { data: profileData } = useQuery({
        queryKey: ["profile"],
        queryFn: async () => {
            const data = await ProfileApi.getProfile(keycloak.token, userId);
            console.log(data);
            return data;
        },
    });

    const { data, isLoading, isError } = useQuery({
        queryKey: ["personalRecipes"],
        queryFn: async () => {
            const data = await PersonalRecipeApi.getPersonalRecipe(keycloak.token);
            console.log(data);
            return data;
        },
    });

    const handleAddRecipeNavigate = () => {
        navigate('/AddRecipe');
    }

    return (
        <>
            {profileData && <div className="profile">
                <div className="profile__cover">
                    <img src={profileData.data.backgroundImage} alt="" />
                    <div className="profile__cover__avatar">
                        <img id='avatar' src={profileData.data.profileImage} alt="" />
                        <div className="profile__cover__name">
                            <h2>{profileData.data.name}</h2>
                            <p>{profileData.data.description && profileData.data.description}</p>
                        </div>
                        <div className='profile__cover__editBtn'>
                        {/* <Button variant="outlined" startIcon={<EditIcon />}>
                            Edit your profile
                        </Button> */}
                        <PButton 
                        label="Edit your profile"
                        icon='pi pi-pencil' 
                        className='p-button-raised p-button-rounded'
                        onClick={()=>{setVisible(true)}}></PButton>
                        </div>
                    </div>
                </div>
                <div className="profile__info">
                    <div className="profile__info__preference">
                        <h2>Preference</h2>
                        <h6>What do you like ?</h6> 
                        <br></br>
                        <ChipList />

                    </div>
                    <div className="profile__info__yourRecipe">
                        <div className="profile__info__yourRecipe__title">
                            <h2>Your Recipe</h2>
                            <Button variant="outlined" startIcon={<AddIcon />} onClick={handleAddRecipeNavigate}>
                                Add your recipe
                            </Button>
                        </div>
                        {data && <RecipeCardList props={data.data.content} pending="" />}
                    </div>
                </div>
            </div>}
            {profileData && <Dialog header="Style your profile :>" visible={visible} style={{ width: '50vw' }} onHide={() => setVisible(false)} footer={footerContent}>
                <div className="profile__dialog__avatar">
                    <h2>Profile picture: </h2><br/>
                    <div className="profile__dialog__avatar__edit">
                        <img id='avatar' src={profileData.data.profileImage} alt="" />
                        <div className="profile__dialog__avatar__edit__btn">
                            <EditIcon fontSize='large' />
                        </div>
                    </div>
                </div>
                <div className="profile__dialog__cover">
                    <h2>Cover picture: </h2><br/>
                    <div className='profile__dialog__avatar__edit'>
                        <img src={profileData.data.backgroundImage} alt="" />
                        <div className="profile__dialog__avatar__edit__btn">
                            <EditIcon fontSize='large' />
                        </div>
                    </div>
                </div>
                <div className="profile__dialog__name">
                    <h2>Name:</h2>
                    <div className="profile__dialog__name__edit">
                        <TextField id="outlined-basic" 
                        label="Name" 
                        variant="outlined" 
                        defaultValue={profileData.data.name} 
                        fullWidth/>
                    </div>
                </div><br/>
                <div className="profile__dialog__description">
                    <h2>Description:</h2>
                    <div className="profile__dialog__description__edit">
                        <TextField id="outlined-basic" 
                        label="Description" 
                        variant="outlined" 
                        defaultValue={profileData.data.description} 
                        fullWidth
                    />
                    </div>
                </div>

            </Dialog>}
        </>
    );
}

export default Profile;