import { Button, IconButton } from '@mui/material';
import InputBase from '@mui/material/InputBase';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { TextField } from '@mui/material';
import Stack from '@mui/material/Stack';
import ImageIcon from '@mui/icons-material/Image';
import CancelIcon from '@mui/icons-material/Cancel';
import AddIcon from '@mui/icons-material/Add';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import RemoveIcon from '@mui/icons-material/Remove';
import EditIcon from '@mui/icons-material/Edit';

import { useState, forwardRef, useEffect } from 'react';
import './ImportForm.css'

import TagSelected from '../TagSelected/TagSelected';


const Alert = forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function debounce(fn, ms) {
    let timer;

    return function () {
        // Nhận các đối số
        const args = arguments;
        const context = this;

        if (timer) clearTimeout(timer);

        timer = setTimeout(() => {
            fn.apply(context, args);
        }, ms)
    }
}

const ImportForm = () => {


    const [newRecipe, setNewRecipe] = useState({});

    const [open, setOpen] = useState(false);
    const [previewImg, setPreviewImg] = useState(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [tag, setTag] = useState([]);
    const [ingredient, setIngredient] = useState([]);
    const [instruction, setInstruction] = useState("");

    const [error, setError] = useState(null);

    const [openSnackbar, setOpenSnackbar] = useState(false);

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpenSnackbar(false);
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

    const handleSubmit = () => {
        let tempRecipe = {
            title: title ? title.trim() : "",
            description: description ? description.trim() : "",
            tag: tag || "",
            ingredient: ingredient || [],
            instruction: instruction ? instruction.trim() : "",
            image: previewImg || ""
        }
        let errors = [];
        for (const [key, value] of Object.entries(tempRecipe)) {
            if (value === "" || value.length === 0) {
                errors.push(key);
            }
        }
        if (errors.length === 0 || errors.length === null) {
            setNewRecipe(tempRecipe);
        }
        else {
            console.log(errors);
            setError(errors);
            setOpenSnackbar(true);
        }

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
                        onClick={handleSubmit}
                        startIcon={<CheckCircleOutlineIcon />}
                        size='large'
                        sx={{ borderRadius: '20px' }}
                        color='success'
                    >

                        Submit
                    </Button>
                </Stack>

            </div>


            <Snackbar open={openSnackbar} autoHideDuration={1000 * 2} key={'top' + 'right'} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
                <Alert severity={'error'} sx={{ width: '100%' }}>
                    <>
                        {error && error.map((item, index) => (
                            <span key={index}>
                                {item.charAt(0).toUpperCase() + item.slice(1)}
                                {index !== error.length - 1 ? ' , ' : ' '}
                            </span>
                        ))}
                        {error && error.length !== 1 ? ' are' : ' is'} empty !!!
                    </>
                </Alert>
            </Snackbar>

            <h1>1-Information</h1>
            <div className="import-form__Detail">
                <div className="import-form__Detail__RecipeTitle">
                    <h2>Recipe Title</h2>
                    <p>250 characters max</p>

                    <TextField label="Enter Your Recipe Title"
                        fullWidth
                        variant="filled"
                        size="larger"
                        required={true}
                        onChange={(e) => debounce(setTitle(e.target.value), 500)}
                    />
                </div>
                <br />
                <div className="import-form__Detail__RecipeDescription">
                    <h2 style={{ margin: "10px", marginTop: "30px" }}>Recipe Description</h2>

                    <TextField
                        label="Enter Your Recipe Description"
                        variant="filled"
                        multiline
                        fullWidth
                        minRows={5}
                        required
                        onChange={(e) => debounce(setDescription(e.target.value), 500)}
                    />
                </div>
                <br />
                <div className="import-form__Detail__RecipeImage">
                    <h2 style={{ margin: "10px", marginTop: "30px" }}>Recipe Image</h2>
                    <div className="import-form__Detail__RecipeImage__upload__preview">
                        <h2>Upload Your Image</h2>
                        <p>Uploading a picture to illustrate your recipe
                            SVG, JPG, PNG ,... resolustion 1920x1080px</p>
                        <div className="import-form__Detail__RecipeImage__upload__preview__dragArea" onDragOver={handleDragOver} onDrop={handleDrop} >
                            {/* <p>Drag and drop your image here</p> */}

                            {!previewImg && <ImageIcon fontSize='large' />}
                            {!previewImg && <span> Drag and Drop</span>}
                            {!previewImg && <span> or</span>}

                            {!previewImg && <Button onClick={handleBrowseOnClick} variant="text">Browes</Button>}
                            {!previewImg && <input type='file' hidden onChange={handleInputFileChange} />}

                            {previewImg && <img src={previewImg} alt="" />}

                        </div>
                        {previewImg && <div className="import-form__Detail__RecipeImage__upload__preview__dragArea__clearImg">
                            <IconButton aria-label="delete" size="large" color='error' onClick={() => setPreviewImg(null)}>
                                <CancelIcon />
                            </IconButton>
                        </div>}
                    </div>
                </div>

            </div>
            <h1>2-Detail</h1>
            <div className="import-form__Detail">
                <div className="import-form__Detail__Tag">
                    <h2>Tag</h2>
                    <div className="import-form__Detail__Tag__list">
                        <TagSelected tag={tag} setTag={setTag} />
                    </div>
                </div>
                <br />
                <div className="import-form__Detail__Ingredient">

                    <h2 style={{ margin: "10px", marginTop: "30px", }}>Ingredient</h2>
                    <StepGenerate step={ingredient} setStep={setIngredient} fullWidth/>
                </div>
                <div className="import-form__Detail__Step">
                    <h2 style={{ margin: "10px", marginTop: "30px" }}>Instruction</h2>
                    <TextField
                        label="Enter Your Recipe Instruction"   
                        variant="filled"
                        multiline
                        fullWidth
                        minRows={5}
                        required
                        onChange={(e) => debounce(setInstruction(e.target.value), 500)}
                    />
                </div>

            </div>


        </div >
    )
}

function StepGenerate(props) {
    const { step, setStep } = props;
    const [tempInput, setTempInput] = useState("");

    const handleAddItem = () => {
        const tempArray = [...step];
        if (tempInput === "") return;
        tempArray.push(tempInput);
        setStep(tempArray);
        setTempInput("");
    }

    useEffect(() => {
        console.log(step);
    }, [step])
    return (
        <>
            <div className="import-form__Detail__Ingredient__list">
                <InputBase sx={{ ml: 1, flex: 1 }} placeholder="Enter Your Ingredient" value={tempInput} onChange={(e) => setTempInput(e.target.value)} />
                <Button onClick={handleAddItem} color='info' size='large' startIcon={<AddIcon />}>Add</Button>
            </div>
            <div className="import-form__Detail__Ingredient__list__display">
                {step && step.map((item, index) => (
                <IngredientForm props={{step,setStep,item,index}} key={index}/>
            ))}
            </div>
        </>
    )
}

function IngredientForm({props}) {
    const { step, setStep , item, index} = props;

    const [tempInput, setTempInput] = useState(item);

    // const [edit, setEdit] = useState(false);

    const handleDelete = () => {
        const tempArray = [...step];
        tempArray.splice(index, 1);
        setStep(tempArray);
    }

    // const handleEdit = () => {
    //     setEdit(!edit);
    // }

    return (
        <div className="import-form__Detail__Ingredient__list__display__item" key={index}>
            <InputBase sx={{ ml: 1, flex: 1 }} value={item} disabled
            onChange={(e) =>{
                setTempInput(e.target.value);
                if(tempInput === "") return;
                const tempArray = [...step];
                tempArray[index] = e.target.value;
                setStep(tempArray);
            }}/>
            {/* <IconButton ara-lable="edit" size="large" onClick={handleEdit}>
                <EditIcon />
            </IconButton> */}
            <IconButton aria-label="delete" size="large" onClick={handleDelete}>
                <RemoveIcon />
            </IconButton>
        </div>
    )
}




export default ImportForm;