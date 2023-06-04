import { Button, IconButton } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { TextField } from '@mui/material';
import WallpaperIcon from '@mui/icons-material/Wallpaper';
import Stack from '@mui/material/Stack';
import FolderIcon from '@mui/icons-material/Folder';
import ImageIcon from '@mui/icons-material/Image';
import CancelIcon from '@mui/icons-material/Cancel';


import { useState } from 'react';

import './ImportForm.css'


const ImportForm = () => {

    const [open, setOpen] = useState(false);
    const [previewImg, setPreviewImg] = useState(null);

    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

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
        } else {
            alert('This is not an Image File!');
        }
    }

    const handleBrowseOnClick = () => {
        document.querySelector('input[type="file"]').click();
    }

    const handleInputFileChange = (e) => {
        e.preventDefault();
        let file = e.target.files[0];
        handleDropImage(file);
    }



    return (
        <div className="import-form">
            <div className="import-form__title">
                <h1>Recipe Detail</h1>
                <Stack direction="row" spacing={2}>
                    <Button variant="outlined"
                        startIcon={<HighlightOffIcon />}
                        size='large'
                        sx={{ borderRadius: '20px' }}
                        color='error'
                    >
                        Cancel
                    </Button>
                    <span></span>
                    <Button variant="outlined"
                        startIcon={<CheckCircleOutlineIcon />}
                        size='large'
                        sx={{ borderRadius: '20px' }}
                        color='success'
                    >

                        Publish
                    </Button>
                </Stack>

            </div>
            <h1>1-Information</h1>
            <div className="import-form__Detail">
                <div className="import-form__Detail__RecipeTitle">
                    <h2>Recipe Title</h2>
                    <p>250 characters max</p>
                    
                    <TextField label="Enter Your Recipe Title"
                        fullWidth
                        variant="outlined"
                        size="larger" />
                </div>
                <br />
                <div className="import-form__Detail__RecipeDescription">
                    <h2>Recipe Description</h2>
                    
                    <TextField
                        label="Enter Your Recipe Description"
                        multiline
                        fullWidth
                        minRows={5}

                    />
                </div>
                <br />
                <div className="import-form__Detail__RecipeImage">
                    <h2>Recipe Image</h2>
                    
                    {/* <div className="import-form__Detail__RecipeImage__upload">
                        <WallpaperIcon fontSize='large'></WallpaperIcon>
                        <p> Uploading a picture to illustrate your recipe
                            SVG, JPG, PNG ,... resolustion 1920x1080px
                        </p>
                        <Button variant="outlined"
                            onClick={handleClickOpen}
                            startIcon={<FolderIcon />}
                            size='large'
                            sx={{ borderRadius: '20px' }}
                        >
                            Browse
                        </Button>
                    </div> */}
                    <div className="import-form__Detail__RecipeImage__upload__preview">
                        <h2>Upload Your Image</h2>
                        <div className="import-form__Detail__RecipeImage__upload__preview__dragArea" onDragOver={handleDragOver} onDrop={handleDrop}>
                            {/* <p>Drag and drop your image here</p> */}

                            {!previewImg && <ImageIcon fontSize='large' />}
                            {!previewImg && <span> Darg and Drop</span>}
                            {!previewImg && <span> or</span>}
                            
                            {!previewImg && <Button onClick={handleBrowseOnClick} variant="text">Browes</Button>}
                            {!previewImg && <input type='file' hidden onChange={handleInputFileChange}/>}
                        
                            {previewImg && <img src={previewImg} alt="" />}
                            {previewImg && <div className="import-form__Detail__RecipeImage__upload__preview__dragArea__clearImg">
                            <IconButton aria-label="delete" size="large" color='error' onClick={() => setPreviewImg(null)}>
                                <CancelIcon />
                            </IconButton>
                        </div>}
                        </div>
                    </div>
                </div>

            </div>


        </div >
    )
}

export default ImportForm;