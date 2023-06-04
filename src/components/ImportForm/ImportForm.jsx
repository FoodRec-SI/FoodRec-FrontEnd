import { Button } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { TextField } from '@mui/material';
import WallpaperIcon from '@mui/icons-material/Wallpaper';
import Stack from '@mui/material/Stack';
import FolderIcon from '@mui/icons-material/Folder';

import './ImportForm.css'


const ImportForm = () => {
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
                <div className="import-form__Detail__RecipeDescription">
                    <h2>Recipe Description</h2>
                    <br />
                    <TextField
                        label="Enter Your Recipe Description"
                        multiline
                        fullWidth
                        minRows={5}

                    />
                </div>
                <div className="import-form__Detail__RecipeImage">
                    <h2>Recipe Image</h2>
                    <div className="import-form__Detail__RecipeImage__upload">
                        <WallpaperIcon fontSize='large'></WallpaperIcon>
                        <p> Uploading a picture to illustrate your recipe
                            SVG, JPG, PNG ,... resolustion 700 x430px
                        </p>
                        <Button variant="outlined"
                        startIcon={<FolderIcon />}
                        size='large'
                        sx={{ borderRadius: '20px' }}                    
                    >
                        Browse
                    </Button>
                    </div>
                </div>

            </div>


        </div>
    )
}

export default ImportForm;