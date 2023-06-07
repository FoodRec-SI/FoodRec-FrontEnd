import { useState } from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';

import { forwardRef, useImperativeHandle } from 'react';


const DialogPending = forwardRef((props, ref) => {

    const [open, setOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState([]);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = (value) => {
        setOpen(false);
        if (value.length != 0) {
            setSelectedValue(value);
            props?.navigate('/pendingRecipe');
        }
    };

    useImperativeHandle(ref, () => ({
        handleClickOpen: () => {
            setOpen(true);
        }
    }));

    return (
        <div>
            {/* <Typography variant="subtitle1" component="div">
                Selected: {selectedValue}
            </Typography> */}
            <br />
            {/* <Button variant="outlined" onClick={handleClickOpen}>
                Open simple dialog
            </Button> */}
            <button id='openDialog' style={{ display: "none" }} onClick={handleClickOpen}>Open simple dialog</button>
            <SimpleDialog
                selectedValue={selectedValue}
                open={open}
                onClose={handleClose}
            />
        </div>

        
    );
});

function SimpleDialog(props) {
    const { onClose, open, selectedValue } = props;

    const [selectItem, setSelectItem] = useState([]);

    const listOfRejectReason = [
        'Inaccurate or Incomplete Instructions',
        'Missing Ingredients',
        'Lack of Originality',
        'Unappealing Presentation',
        'Safety Concerns',
        'Unverified Claims',
        'Offensive or Inappropriate Content',
        'Copyright Infringement',
    ];

    const handleClose = (value) => {
        // console.log(selectItem);
        // onClose(selectedValue);
        if (value == 'OK') {
            onClose(selectItem);
        }
        if (value == 'Cancel') {
            setSelectItem([]);
            onClose(selectItem);
        }
    };

    const handleSeletedItem = (e) => {
        // console.log(e.target.value);

        const itemSelected = e.target.value;
        if (selectItem.includes(itemSelected)) {
            setSelectItem(selectItem.filter(item => item !== itemSelected));
        } else {
            setSelectItem([...selectItem, itemSelected]);
        }
    }

    return (
        <Dialog onClose={handleClose} open={open} >

            <DialogTitle>Why did you reject this recipe to be public ? </DialogTitle>
            <FormGroup sx={{ padding: "20px" , paddingBottom:"5px"}} >
                {listOfRejectReason.map((item, index) => (
                    <FormControlLabel key={index} label={item} value={item} control={<Checkbox />} onClick={handleSeletedItem} />
                ))}
            </FormGroup>
            <div style={{display:"flex",justifyContent:"center",alignItems:"center"}}>
            <Button onClick={() => handleClose("Cancel")}>Cancel</Button>
            <Button onClick={() => handleClose("OK")}>OK</Button>
            </div>
        </Dialog>
    );
}

SimpleDialog.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    selectedValue: PropTypes.array.isRequired,
};


export default DialogPending;