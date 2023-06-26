import { useState, useEffect } from 'react';

import { Avatar, Button } from '@mui/material';
import TextField from '@mui/material/TextField';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import ImageIcon from '@mui/icons-material/Image';

import { Button as PButton } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { MultiSelect } from 'primereact/multiselect';

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

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const { data: recipeTags } = useQuery({
        queryKey: ["tags"],
        queryFn: async () => {
            const data = await TagApi.getTags(keycloak.token);
            return data;
        },
    });


    const tags = recipeTags?.data.map((tag) => tag.tagName);


    const handleDrop = (e) => {
        e.preventDefault();
        let file = e.dataTransfer.files[0];
        handleDropImage(file);
    };


    // const handleDropImage = (file) => {
    //     let validExtensions = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/svg+xml'];
    //     if (validExtensions.includes(file.type)) {
    //         const formData = new FormData();
    //         formData.append('image', file);
    //         if(isAvatar){
    //             setFile({ ...file, profileImage: file });
    //         }else{
    //             setFile({ ...file, backgroundImage: file });
    //         }
    //         let fileReader = new FileReader();
    //         fileReader.onload = () => {
    //             let fileURL = fileReader.result;
    //             setPreviewImg(fileURL);
    //         };
    //         fileReader.readAsDataURL(file);
    //     } else {
    //         alert('This is not an Image File!');
    //     }
    // }

    const handleDropImage = (file) => {
        let validExtensions = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/svg+xml'];
        if (validExtensions.includes(file.type)) {
            let fileReader = new FileReader();
            fileReader.onload = () => {
                let fileURL = fileReader.result;
                setPreviewImg(fileURL);
            };
            fileReader.readAsDataURL(file);

            //   const formData = new FormData();
            //   formData.append('image', file);

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

    const footerEditImage = (
        <div style={{ paddingTop: "20px" }}>
            <PButton label="Cancel" icon="pi pi-times" onClick={() => {
                setOpenEditImage(false);
                setTimeout(() => {
                    setPreviewImg(null)
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

    // const handleUpdateProfile = async () => {
    //     const data = {
    //         description: description,
    //         profileImage: file.profileImage,
    //         backgroundImage: file.backgroundImage
    //     }
    //     const response = await EditProfileApi.updateProfile(data, keycloak.token);
    //     if (response.status === 200) {
    //         setVisible(false);
    //         setDescription('');
    //         setBackgroundImage(null);
    //         setProfileImage(null);
    //     }
    // }

    const handleUpdateProfile = async () => {
        const formData = new FormData();
        // formData.append("description", description || "");
        formData.append("profileImage", fileAvatar || "");
        // formData.append("backgroundImage", fileBackground || "");
        // const data ={
        //     description: description || "",
        //     profileImage: fileAvatar || "",
        //     backgroundImage: fileBackground || ""
        // }
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
    const { onSuccess, mutate: updateProfileMutate } = useMutation(
        handleUpdateProfile,
        {
            onSuccess: () => {
                // queryClient.invalidateQueries('profile')
                refetchProfile();
            }
        }
    )


    const footerContent = (
        <div style={{ paddingTop: "20px" }}>
            <PButton label="Cancel" icon="pi pi-times"
                onClick={() => {
                    setVisible(false)
                    setTimeout(() => {
                        setBackgroundImage(null)
                        setProfileImage(null)
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
                    // mutate()
                    setShowTagEdit(false);
                    document.querySelector('body').style.overflow = 'scroll';
                    
                    const tagIds = getMatchingTagIds(selectedTags, recipeTags.data);
                    console.log(tagIds);

                }}
                autoFocus />
        </div>
    )

    const userId = keycloak.tokenParsed.sub;

    const { data: profileData, refetch:refetchProfile, isSuccess } = useQuery({
        queryKey: ["profile"],
        queryFn: async () => {
            const data = await ProfileApi.getProfile(keycloak.token, userId);
            return data;
        },
    });

    const temp = profileData?.data.tagsCollection?.map((tag) => tag.tagName);


    const { data, isLoading, isError } = useQuery({
        queryKey: ["personalRecipes"],
        queryFn: async () => {
            const data = await PersonalRecipeApi.getPersonalRecipe(keycloak.token);
            return data;
        },
    });

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
                            <PButton
                                label="Edit your profile"
                                icon='pi pi-pencil'
                                className='p-button-raised p-button-rounded'
                                onClick={() => { setVisible(true) }}></PButton>
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
                                    setShowTagEdit(true), setSelectedTags(temp),
                                    document.querySelector('body').style.overflow = 'hidden'
                                }}
                            ></PButton>
                        </div>
                        <h6>What do you like ?</h6>
                        <br></br>
                        <ChipList props={temp} />

                    </div>
                    <div className="profile__info__yourRecipe">
                        <div className="profile__info__yourRecipe__title">
                            <h2>Your Recipe</h2>
                            <Button variant="outlined" startIcon={<AddIcon />} onClick={handleAddRecipeNavigate}>
                                Add your recipe
                            </Button>
                        </div>
                        {/* {data && <RecipeCardList props={data.data.content} pending="" />} */}
                    </div>
                </div>
            </div>}
            {profileData && <Dialog header="Style your profile :>" visible={visible} style={{ width: '50vw' }} onHide={() => setVisible(false)} footer={footerContent}>
                <div className="profile__dialog__avatar">
                    <h2>Profile picture: </h2><br />
                    <div className="profile__dialog__avatar__edit" onClick={() => {
                        setIsAvatar(true);
                        setOpenEditImage(true);
                    }}>
                        {profileImage !== null ?
                            <img id='avatar' src={profileImage} style={{ objectFit: "cover", objectPosition: "center" }} alt='' />
                            :
                            <img id='avatar' src={profileData.data.profileImage} alt="" />}
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
                            <img src={profileData.data.backgroundImage} alt="" />}
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
                            fullWidth />
                    </div>
                </div><br />
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
            <Dialog header="Edit your image" visible={openEditImage} style={{ width: '50vw' }}
                footer={footerEditImage}
                onHide={() => {
                    setOpenEditImage(false)
                    if (isAvatar) {
                        setProfileImage(null);
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
            style={{ width: '60vw' }} 
            onHide={() => { setShowTagEdit(false), document.querySelector('body').style.overflow = 'scroll', setSelectedTags(temp) }}
            footer={footerTagEdit}
            >
                <MultiSelect
                    style={{ width: "100%" }}
                    value={selectedTags}
                    options={tags} 
                    onChange={(e) => setSelectedTags(e.value)}
                    display="chip"
                    required
                    placeholder="Select Tags"
                    filter
                    filterInputAutoFocus
                />
            </Dialog>
        </>
    );
}

export default Profile;