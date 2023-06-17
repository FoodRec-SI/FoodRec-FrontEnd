import { useState, forwardRef } from "react";

import MuiAlert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import PendingList from "../../components/PendingList/PendingList";
import { useLocation } from 'react-router-dom';








const PendingRecipe = () => {
    
    const location = useLocation();
    const status = location.state;

    const [open, setOpen] = useState(true);

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    return (
        <>
            {status &&
                <Snackbar open={open} autoHideDuration={1000*2} key={'top' + 'right'} onClose={handleClose} anchorOrigin= {{vertical:'top',horizontal:'right'}}>
                    <Alert severity={status == "approve" ? 'success' : 'error'} sx={{ width: '100%' }}>
                        {status === "approve" ? "Recipe has been Approved !" : "Recipe has been Rejected !"}
                    </Alert>
                </Snackbar>
            }

            <PendingList />
        </>
    )
}

const Alert = forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default PendingRecipe;