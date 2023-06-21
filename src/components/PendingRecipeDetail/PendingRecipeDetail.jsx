import { useState } from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { useNavigate } from 'react-router-dom';

import { ApproveRejectApi } from '../../api/ApproveRejectApi';
import { useQuery } from 'react-query';
import { useKeycloak } from "@react-keycloak/web";

import './PendingRecipeDetail.css';



const PendingRecipeDetail = () => {

    const navigate = useNavigate();

    const [selectedValue, setSelectedValue] = useState([]);

    const { keycloak } = useKeycloak();

    const [isApprove, setIsApprove] = useState('approve');

    const { isError, isSuccess } = useQuery({
        queryKey: ["pendingRecipes", { postId: 'POS000027'}],
        queryFn: async () => {
            const data = await ApproveRejectApi.updateStatusPost('POS000027', keycloak.token, isApprove );
            return data;
        },
        enabled: false,  
    });

    const handleApproveAndReject = async (status) => {
        let state = status;
        if (state === 'approve') {
            setIsApprove('approve');

            navigate('/pendingRecipe', { state: state });   
        }
        if (state === 'reject') {
            try {
                await new Promise((resolve) => {
                    document.getElementById('openDialog').click();

                });
            } catch (error) {
                // Handle any errors that occur during the rejection process
                console.error('Error occurred during rejection:', error);
            }

        }
    };


    const handleClose = (value) => {
        const filteredValue = value.filter((item) => item !== undefined && item !== null);

        if (value.length != 0) {
            setSelectedValue(filteredValue);
            setIsApprove('reject');
            console.log(filteredValue);
           
            refetch();
            navigate('/pendingRecipe', { state: 'reject' });
            

        }
    };


    return (
        <div className="recipeDetailPending">
            <h1>Public this recipe ???</h1>
            <div className="recipeDetailPending__btn">
                <Button color='error' variant="outlined" sx={{ fontSize: "27px", height: "52px", width: "170px", borderRadius: "25px", margin: "10px" }}
                    onClick={() => handleApproveAndReject('reject')}
                >
                    Reject
                </Button>

                <Button color='success' variant="outlined" sx={{ fontSize: "27px", height: "52px", width: "170px", borderRadius: "25px", margin: "10px" }}
                    onClick={() => handleApproveAndReject('approve')}
                >
                    Approve
                </Button>
            </div>
            <DialogPending handleClose={handleClose} selectedValue={selectedValue} />
            {/* <NavLink to='/pendingRecipe' className="pendingPage__button" >
                <button id='navigateButton' style={{ display: "none" }}></button>
            </NavLink> */}
        </div>

    );
}



function DialogPending(props) {

    const { handleClose, selectedValue } = props;

    const [open, setOpen] = useState(false);


    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleCloseDialog = (value) => {
        setOpen(false);
        handleClose(value);
    };

    return (
        <div>
            <button id='openDialog' style={{ display: "none" }} onClick={handleClickOpen}>Open simple dialog</button>
            <PopUpDialog
                open={open}
                onClose={handleCloseDialog}
            />
        </div>


    );
};

function PopUpDialog(props) {
    const { onClose, open } = props;

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



        if (value === 'OK') {
            onClose(selectItem);

        }
        if (value === 'Cancel') {
            setSelectItem([]);
            onClose([]);
        }
    };

    const handleSeletedItem = (e) => {
        // console.log(e.target.value);

        const itemSelected = e.target.value;
        if (selectItem.includes(itemSelected)) {
            setSelectItem(selectItem.filter(item => item !== itemSelected));
            // setSelectItem(selectItem.filter(item => item !== ' '));
        } else {
            setSelectItem([...selectItem, itemSelected]);
        }
    }

    return (
        <Dialog onClose={handleClose} open={open} >

            <DialogTitle>Why did you reject this recipe to be public ? </DialogTitle>
            <FormGroup sx={{ padding: "20px", paddingBottom: "5px" }} >
                {listOfRejectReason.map((item, index) => (
                    <FormControlLabel key={index} label={item} value={item} control={<Checkbox />} onClick={handleSeletedItem} />
                ))}
            </FormGroup>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                <Button onClick={() => handleClose("Cancel")}>Cancel</Button>
                <Button onClick={() => handleClose("OK")}>OK</Button>
            </div>
        </Dialog>
    );
}


export default PendingRecipeDetail;