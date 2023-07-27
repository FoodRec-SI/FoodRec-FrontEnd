import { useState, useEffect } from 'react';

import { Button } from '@mui/material';
import TextField from '@mui/material/TextField';
import EditIcon from '@mui/icons-material/Edit';
import ImageIcon from '@mui/icons-material/Image';

import { Button as PButton } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { MultiSelect } from 'primereact/multiselect';
import { ConfirmDialog } from 'primereact/confirmdialog';

import { useNavigate,useLocation } from 'react-router-dom';

import { useKeycloak } from "@react-keycloak/web";
import { useQuery, useMutation, useInfiniteQuery } from 'react-query';

import { PersonalRecipeApi } from '../../api/PersonalRecipeApi';
import { TagApi } from '../../api/TagApi';
import { ProfileApi } from '../../api/ProfileApi';
import { EditProfileApi } from '../../api/EditProfileApi';

import ChipList from '../ChipList/ChipList';
import Loading from '../Loading/Loading';
import RecipeCardList from '../RecipeCardList/RecipeCardList'
import AddRecipeForm from '../AddRecipeForm/AddRecipeForm';
import './Profile.css'
import { set } from 'date-fns';

const Profile = () => {

    const navigate = useNavigate();

    const { keycloak } = useKeycloak();

    const [visible, setVisible] = useState(false);
    const [openEditImage, setOpenEditImage] = useState(false);
    const [isAvatar, setIsAvatar] = useState(false);
    const [previewImg, setPreviewImg] = useState(null);

    const [newdescription, setNewdescription] = useState('');
    const [newprofileImage, setNewprofileImage] = useState(null);
    const [newbackgroundImage, setNewbackgroundImage] = useState(null);

    const [isError, setIsError] = useState(null);

    const [fileAvatar, setFileAvatar] = useState(null);
    const [fileBackground, setFileBackground] = useState(null);

    const [showTagEdit, setShowTagEdit] = useState(false);

    const [selectedTags, setSelectedTags] = useState([]);

    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [showAddRecipe, setShowAddRecipe] = useState(false);

    const location = useLocation();
    
    const [status, setStatus] = useState(location.state);

   

    const fetchPersonalRecipe = async ({ pageParam, pageSize }) => {
        const response = await PersonalRecipeApi.getPersonalRecipe(keycloak.token, pageParam, pageSize);
        return response.data;
    }

    const { data: personalRecipe, hasNextPage, fetchNextPage } = useInfiniteQuery({
        queryKey: ["personalRecipes"],
        queryFn: ({ pageParam = 0, pageSize = 6 }) => fetchPersonalRecipe({ pageParam, pageSize }),
        getNextPageParam: (lastPage) => {
            if (lastPage.totalElements === 0) return undefined;
            const maxPages = lastPage.totalElements / 6;
            const nextPage = lastPage.number + 1;
            return nextPage <= maxPages ? nextPage : undefined;
        },
    });

    useEffect(() => {
        const onScroll = (event) => {
            let fetching = false;
            const { scrollTop, clientHeight, scrollHeight } =
                event.target.scrollingElement;

            if (!fetching && scrollHeight - scrollTop <= clientHeight * 1.5) {
                fetching = true;
                if (hasNextPage) {
                    fetchNextPage();
                }
                // console.log("fetching");
                fetching = false;
            }
        };
        document.addEventListener("scroll", onScroll);
        return () => {
            document.removeEventListener("scroll", onScroll);
        };
    }, [hasNextPage, fetchNextPage]);




    const { data: recipeTags } = useQuery({
        queryKey: ["tags"],
        queryFn: async () => {
            const data = await TagApi.getTags(keycloak.token);
            return data;
        },
    });

    const tagNames = recipeTags?.data?.map((tag) => tag.tagName);

    const { data: profileData, status: ProfileStatus, refetch } = useQuery({
        queryKey: ["profile"],
        queryFn: async () => {
            const data = await ProfileApi.getProfile(keycloak.token, keycloak.tokenParsed.sub);
            return data;
        },

    });

    const tempTag = profileData?.data?.tagsCollection?.map((tag) => tag.tagName);

    //-------Update Data-------
    const handleUpdateProfile = async () => {
        const formData = new FormData();
        if (newdescription !== profileData.data.description) {
            formData.append("description", newdescription);
        }
        if (fileAvatar !== null) {
            formData.append("profileImage", fileAvatar);
        }
        if (fileBackground !== null) {
            formData.append("backgroundImage", fileBackground);
        }
        try {
            const response = await EditProfileApi.updateProfile(formData, keycloak.token);
            if (response.status === 200) {
                setVisible(false);
                setNewdescription('');
                setNewbackgroundImage(null);
                setNewprofileImage(null);
                refetch();
            }
        } catch (error) {
            // Handle error
        }
    };
    const { mutate: updateProfileMutate, isLoading: updatingProfile } = useMutation(
        handleUpdateProfile,
    )



    const handleUpdateProfileTag = async () => {
        const tagIds = getMatchingTagIds(selectedTags, recipeTags.data);
        const paramTag = tagIds.map(tagId => `tagIds=${tagId}`).join('&');
        try {
            const response = await EditProfileApi.updateProfileTag(paramTag, keycloak.token);
            if (response.status === 200) {
                setShowTagEdit(false);
                document.querySelector('body').style.overflow = 'scroll';
                refetch();
            }
        } catch (error) {
            // Handle error 
        }
    };
    const { mutate: mutateUpdateTag, isLoading: loadingUpdateTag, isError: tagError } = useMutation(
        handleUpdateProfileTag,
        {
            tagError: () => {
                console.log("error")
            }
        }
    )


    if (loadingUpdateTag || updatingProfile) {
        return <Loading />
    }
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
        let validExtensions = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
        if (file.size > 3000000) {
            setIsError("Image size must be less than 3MB");
            return;
        }
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
            setIsError(null);
        } else {
            setIsError("Invalid file type");
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
                        setNewprofileImage(previewImg);
                    } else {
                        setNewbackgroundImage(previewImg);
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
                        setNewbackgroundImage(null)
                        setNewprofileImage(null)
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
                    setStatus(null)
                    mutateUpdateTag();
                }}
                autoFocus />
        </div>
    )


    //-------End Dialog Footer-------

    if (ProfileStatus === 'loading') {
        return (<Loading />)
    }

    return (
        <>
            {profileData.data && <div>
                <div className="profile">
                    <div className="profile__cover">
                        <img src={profileData?.data?.backgroundImage} alt="" />
                        <div className="profile__cover__avatar">
                            <img id='avatar' src={profileData?.data?.profileImage} alt="" />
                            <div className="profile__cover__name">
                                <h2>{profileData?.data?.name}</h2>
                                <p>{profileData?.data?.description && profileData?.data?.description}</p>
                            </div>
                            <div className='profile__cover__editBtn'>

                                <PButton
                                    label="Edit your profile"
                                    icon='pi pi-pencil'
                                    rounded

                                    onClick={() => { setVisible(true), setNewdescription(profileData.data.description) }}></PButton>
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
                                    label='Edit your tag'
                                    onClick={() => {
                                        setShowTagEdit(true),
                                            setSelectedTags(tempTag),
                                            document.querySelector('body').style.overflow = 'hidden'
                                    }}
                                ></PButton>
                            </div>
                            <h6>What do you like ?</h6>
                            <br></br>
                            {profileData && <ChipList tags={profileData.data?.tagsCollection} />}

                        </div>
                        <div className="profile__info__yourRecipe">
                            <div className="profile__info__yourRecipe__title">
                                <h2>Your Recipe</h2>
                                <PButton icon='pi pi-plus' rounded onClick={() => setShowAddRecipe(true)} label='Add New Recipe'></PButton>
                                {/* <Button variant="outlined" startIcon={<AddIcon />} onClick={handleAddRecipeNavigate}>
                                Add your recipe
                            </Button> */}
                            </div>
                            {personalRecipe != null ? <RecipeCardList props={personalRecipe?.pages.flatMap((page) => page.content)} pending="myRecipe" /> : <div>Loading...</div>}
                        </div>
                    </div>
                </div>
                <Dialog header="Style your profile :>" visible={visible} style={{ width: '50vw' }} onHide={() => { setVisible(false), setNewbackgroundImage(null), setNewprofileImage(null) }} footer={footerContent}>
                    <div className="profile__dialog__avatar">
                        <h2>Profile picture: </h2><br />
                        <div className="profile__dialog__avatar__edit" onClick={() => {
                            setIsAvatar(true);
                            setOpenEditImage(true);
                        }}>
                            {newprofileImage !== null ?
                                <img id='avatar' src={newprofileImage} style={{ objectFit: "cover", objectPosition: "center" }} alt='' />
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
                            {newbackgroundImage !== null ?
                                <img src={newbackgroundImage} style={{ width: "100%", height: "100%" }} alt='' />
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
                                    setNewdescription(e.target.value)
                                }
                                }
                            />
                        </div>
                    </div>

                </Dialog>
                <Dialog header="Edit your image" visible={openEditImage} style={{ width: '70vw' }}
                    footer={footerEditImage}
                    onHide={() => {
                        setOpenEditImage(false)
                        if (isAvatar) {
                            setNewprofileImage(null);
                        }
                        else {
                            setNewbackgroundImage(null);
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
                        {isError && <p style={{ color: "red" }}>{isError}</p>}
                    </div>
                </Dialog>
                <Dialog
                    modal="true"
                    blockScroll="true"
                    header="Custom your tag"
                    visible={showTagEdit || status === 'new'}
                    style={{ width: '60vw', minHeight: "50vh" }}
                    onHide={() => { setShowTagEdit(false), document.querySelector('body').style.overflow = 'scroll', setSelectedTags([]), setStatus(null)}}
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
                            panelStyle={{ maxHeight: "300px", maxWidth: "70vw" }}
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
                <Dialog
                    header="Add your recipe"
                    visible={showAddRecipe}
                    style={{ width: '90vw' }}
                    onHide={() => setShowAddRecipe(false)}
                    footer={null}
                >
                    <AddRecipeForm />
                </Dialog>
            </div>}
        </>

    );
}

export default Profile;