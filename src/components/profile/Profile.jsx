import { useState, useEffect } from 'react';

import { Avatar, Button } from '@mui/material';
import TextField from '@mui/material/TextField';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import ImageIcon from '@mui/icons-material/Image';

import { Button as PButton } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { MultiSelect } from 'primereact/multiselect';
import { ConfirmDialog } from 'primereact/confirmdialog';

import { useNavigate } from 'react-router-dom';

import { useKeycloak } from "@react-keycloak/web";
import { useQuery, useMutation } from 'react-query';

import { PersonalRecipeApi } from '../../api/PersonalRecipeApi';
import { TagApi } from '../../api/TagApi';
import { ProfileApi } from '../../api/ProfileApi';
import { EditProfileApi } from '../../api/EditProfileApi';

import ChipList from '../ChipList/ChipList';
import RecipeCardList from '../RecipeCardList/RecipeCardList'
import './Profile.css'

const Profile = () => {

    const navigate = useNavigate();

    const { keycloak } = useKeycloak();

    const [visible, setVisible] = useState(false);
    const [openEditImage, setOpenEditImage] = useState(false);
    const [isAvatar, setIsAvatar] = useState(false);
    const [previewImg, setPreviewImg] = useState(null);

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [profileImage, setProfileImage] = useState(null);
    const [backgroundImage, setBackgroundImage] = useState(null);

    const [fileAvatar, setFileAvatar] = useState(null);
    const [fileBackground, setFileBackground] = useState(null);

    const [showTagEdit, setShowTagEdit] = useState(false);

    const [selectedTags, setSelectedTags] = useState([]);

    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);


    //-------Call API-------
    const { data: profileData, isLoading: loadingProfile } = useQuery({
        queryKey: ["profile"],
        queryFn: async () => {
            const data = await ProfileApi.getProfile(keycloak.token, keycloak.tokenParsed.sub);
            return data;
        },
        refetchInterval: 1000 * 2
    });

    const tempTag = profileData?.data?.tagsCollection?.map((tag) => tag.tagName);

    const { data: personalRecipe, isLoading, isError } = useQuery({
        queryKey: ["personalRecipes"],
        queryFn: async () => {
            const data = await PersonalRecipeApi.getPersonalRecipe(keycloak.token);
            return data;
        },
    });

    

    const { data: recipeTags, isSuccess: isTagSuccessFetch } = useQuery({
        queryKey: ["tags"],
        queryFn: async () => {
            const data = await TagApi.getTags(keycloak.token);
            return data;
        },
    });

    const tagNames = recipeTags?.data?.map((tag) => tag.tagName);




    //-------End Call API-------

    //-------Update Data-------
    const handleUpdateProfile = async () => {
        const formData = new FormData();
        if (description !== profileData.data.description) {
            formData.append("description", description || "");
        }
        if (fileAvatar !== null) {
            formData.append("profileImage", fileAvatar || "");
        }
        if (fileBackground !== null) {
            formData.append("backgroundImage", fileBackground || "");
        }
        try {
            const response = await EditProfileApi.updateProfile(formData, keycloak.token);
            if (response.status === 200) {
                setVisible(false);
                setDescription('');
                setBackgroundImage(null);
                setProfileImage(null);
            }
        } catch (error) {
            // Handle error
        }
    };
    const { mutate: updateProfileMutate, data: updateProfileData } = useMutation(
        handleUpdateProfile,
        {
            onSucess: () => {
                console.log(updateProfileData)
                queryClient.invalidateQueries('profile')
            }
        }
    )



    const handleUpdateProfileTag = async () => {
        const tagIds = getMatchingTagIds(selectedTags, recipeTags.data);
        const paramTag = tagIds.map(tagId => `tagIds=${tagId}`).join('&');
        console.log(paramTag)
        try {
            const response = await EditProfileApi.updateProfileTag(paramTag, keycloak.token);
            if (response.status === 200) {
                setShowTagEdit(false);
                document.querySelector('body').style.overflow = 'scroll';
            }
        } catch (error) {
            // Handle error 
        }
    };
    const { mutate: mutateUpdateTag, isLoading: loadingUpdateTag, isError: tagError } = useMutation(
        handleUpdateProfileTag,
        {
            onSucess: () => {
                queryClient.invalidateQueries('profile')
                setSelectedTags([]);
            },
            tagError: () => {
                console.log("error")
            }
        }
    )
    //-------End Update Data-------

    //-------Event Fucntion-------

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        let file = e.dataTransfer.files[0];
        handleDropImage(file);
    };

    const handleDropImage = (file) => {
        let validExtensions = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/svg+xml'];
        if (validExtensions.includes(file.type)) {
            let fileReader = new FileReader();
            fileReader.onload = () => {
                let fileURL = fileReader.result;
                setPreviewImg(fileURL);
            };
            fileReader.readAsDataURL(file);
            if (isAvatar) {
                setFileAvatar(file)
            } else {
                setFileBackground(file)
            }
        } else {
            alert('This is not an Image File!');
        }
    };

    const handleBrowseOnClick = () => {
        document.querySelector('input[type="file"]').click();
    }

    const handleInputFileChange = (e) => {
        e.preventDefault();
        let file = e.target.files[0];
        handleDropImage(file);
    }

    const handleAddRecipeNavigate = () => {
        navigate('/AddRecipe');
    }

    const getMatchingTagIds = (tagNames, tagObjects) => {
        const matchingTagIds = [];
        for (let i = 0; i < tagObjects.length; i++) {
            const tagObject = tagObjects[i];
            if (tagNames.includes(tagObject.tagName)) {
                matchingTagIds.push(tagObject.tagId);
            }
        }
        return matchingTagIds;
    }

    //-------End Event Fucntion-------  


    //-------Dialog Footer-------
    const footerEditImage = (
        <div style={{ paddingTop: "20px" }}>
            <PButton label="Cancel" icon="pi pi-times" onClick={() => {
                setOpenEditImage(false);
                setTimeout(() => {
                    setPreviewImg(null)
                    setFileAvatar(null)
                    setFileBackground(null)
                }, 1000 * 0.5);
            }}
                className="p-button-text" />
            <PButton label="Save" icon="pi pi-check" onClick={() => {
                setOpenEditImage(false);
                if (previewImg !== null) {
                    if (isAvatar) {
                        setProfileImage(previewImg);
                    } else {
                        setBackgroundImage(previewImg);
                    }
                    setPreviewImg(null);
                }
            }} autoFocus />
        </div>
    )

    const footerContent = (
        <div style={{ paddingTop: "20px" }}>
            <PButton label="Cancel" icon="pi pi-times"
                onClick={() => {
                    setVisible(false)
                    setTimeout(() => {
                        setBackgroundImage(null)
                        setProfileImage(null)
                        setFileAvatar(null)
                        setFileBackground(null)
                    }, 1000 * 0.5);
                }}
                className="p-button-text" />

            <PButton label="Save" icon="pi pi-check"
                onClick={() => {
                    updateProfileMutate()
                }}
                autoFocus />
        </div>
    )

    const footerTagEdit = (
        <div style={{ paddingTop: "20px" }}>
            <PButton label="Save" icon="pi pi-check"
                onClick={() => {
                    mutateUpdateTag();
                }}
                autoFocus />
        </div>
    )


    //-------End Dialog Footer-------

    if (loadingProfile)
        return (<div>Loading...</div>)

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

                            <span className="p-buttonset">
                                <PButton
                                    label="Delete"
                                    icon="pi pi-trash"
                                    rounded
                                    onClick={() => setShowDeleteConfirm(true)}
                                    size="small"
                                />
                                <PButton
                                    label="Edit your profile"
                                    icon='pi pi-pencil'
                                    rounded
                                    size="small"
                                    onClick={() => { setVisible(true), setDescription(profileData.data.description) }}></PButton>
                            </span>
                        </div>
                    </div>
                </div>
                <div className="profile__info">
                    <div className="profile__info__preference">
                        <div style={{ display: "flex", alignItems: "center", witdh: "100%", justifyContent: "space-between" }}>
                            <h2>Preference</h2>
                            <PButton
                                icon='pi pi-pencil'
                                rounded
                                outlined
                                onClick={() => {
                                    setShowTagEdit(true),
                                    setSelectedTags(tempTag),
                                    document.querySelector('body').style.overflow = 'hidden'
                                }}
                            ></PButton>
                        </div>
                        <h6>What do you like ?</h6>
                        <br></br>
                        {profileData && <ChipList tags={profileData.data.tagsCollection} />}

                    </div>
                    <div className="profile__info__yourRecipe">
                        <div className="profile__info__yourRecipe__title">
                            <h2>Your Recipe</h2>
                            <Button variant="outlined" startIcon={<AddIcon />} onClick={handleAddRecipeNavigate}>
                                Add your recipe
                            </Button>
                        </div>
                        {personalRecipe && <RecipeCardList props={personalRecipe?.data.content} pending="" />}
                    </div>
                </div>
            </div>}
            {profileData && <Dialog header="Style your profile :>" visible={visible} style={{ width: '50vw' }} onHide={() => { setVisible(false), setBackgroundImage(null), setProfileImage(null) }} footer={footerContent}>
                <div className="profile__dialog__avatar">
                    <h2>Profile picture: </h2><br />
                    <div className="profile__dialog__avatar__edit" onClick={() => {
                        setIsAvatar(true);
                        setOpenEditImage(true);
                    }}>
                        {profileImage !== null ?
                            <img id='avatar' src={profileImage} style={{ objectFit: "cover", objectPosition: "center" }} alt='' />
                            :
                            <img id='avatar' src={profileData.data.profileImage} style={{ objectFit: "cover", objectPosition: "center" }} alt="" />}
                        <div className="profile__dialog__avatar__edit__btn">
                            <EditIcon fontSize='large' />
                        </div>
                    </div>
                </div>
                <div className="profile__dialog__cover">
                    <h2>Cover picture: </h2><br />
                    <div className='profile__dialog__avatar__edit' onClick={() => {
                        setIsAvatar(false);
                        setOpenEditImage(true);
                    }}>
                        {backgroundImage !== null ?
                            <img src={backgroundImage} style={{ width: "100%", height: "100%" }} alt='' />
                            :
                            <img src={profileData.data.backgroundImage} style={{ width: "100%", height: "100%" }} alt="" />}
                        <div className="profile__dialog__avatar__edit__btn">
                            <EditIcon fontSize='large' />
                        </div>
                    </div>
                </div>
                <div className="profile__dialog__description">
                    <h2>Description:</h2>
                    <div className="profile__dialog__description__edit">
                        <TextField id="outlined-basic"
                            label="Description"
                            variant="outlined"
                            defaultValue={profileData.data.description}
                            fullWidth
                            onChange={(e) => {
                                setDescription(e.target.value)
                            }
                            }
                        />
                    </div>
                </div>

            </Dialog>}
            <Dialog header="Edit your image" visible={openEditImage} style={{ width: '50vw' }}
                footer={footerEditImage}
                onHide={() => {
                    setOpenEditImage(false)
                    if (isAvatar) {
                        setProfileImage(null);
                    }
                    else {
                        setBackgroundImage(null);
                    }
                }}>
                <div className="edit_form">
                    <h2>Upload Your BackGround</h2>
                    <div className="edit_form_dragArea" style={isAvatar ? { borderRadius: "50%", width: "400px", height: "400px", boxSizing: "border-box" } : null} onDragOver={handleDragOver} onDrop={handleDrop} >
                        {/* <p>Drag and drop your image here</p> */}
                        {!previewImg && <ImageIcon fontSize='large' />}
                        {!previewImg && <span> Drag and Drop</span>}
                        {!previewImg && <span> or</span>}
                        {!previewImg && <Button onClick={handleBrowseOnClick} variant="text">Browes</Button>}
                        {!previewImg && <input type='file' hidden onChange={handleInputFileChange} />}
                        {previewImg && <img src={previewImg} style={isAvatar ? { borderRadius: "50%", objectFit: "cover", objectPosition: "center", height: "100%", width: "100%" } : { width: "100%", height: "100%" }} alt="" />}
                    </div>
                </div>
            </Dialog>
            <Dialog
                modal="true"
                blockScroll="true"
                header="Custom your tag"
                visible={showTagEdit}
                style={{ width: '60vw', minHeight: "50vh" }}
                onHide={() => { setShowTagEdit(false), document.querySelector('body').style.overflow = 'scroll', setSelectedTags([]) }}
                footer={footerTagEdit}
            >
                {loadingUpdateTag ?
                    <div>Loading...</div>
                    :
                    <MultiSelect
                        style={{ width: "100%" }}
                        value={selectedTags}
                        options={tagNames}
                        onChange={(e) => setSelectedTags(e.value)}
                        display="chip"
                        required
                        placeholder="Select Tags"
                        filter
                        filterInputAutoFocus
                        panelStyle={{ maxHeight: "300px", maxWidth: "50vw" }}
                        className='multiSelectTag'
                        closeIcon="pi pi-times"
                    />}
            </Dialog>
            <ConfirmDialog
                visible={showDeleteConfirm}
                onHide={() => setShowDeleteConfirm(false)}
                message="Are you sure you want to proceed?"
                header="Confirmation"
                icon="pi pi-exclamation-triangle"
                accept={() => setShowDeleteConfirm(false)}
                reject={() => setShowDeleteConfirm(false)}
            />
        </>

    );
}

export default Profile;