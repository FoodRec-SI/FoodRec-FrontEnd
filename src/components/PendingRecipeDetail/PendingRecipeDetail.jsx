import { useState } from 'react';
import Button from '@mui/material/Button';
import { Button as PButton } from 'primereact/button';
import { useNavigate } from 'react-router-dom';

import { ApproveRejectApi } from '../../api/ApproveRejectApi';
import { useQuery, useMutation, QueryClient } from 'react-query';
import { useKeycloak } from "@react-keycloak/web";

import { Dialog } from 'primereact/dialog';
import { ListBox } from 'primereact/listbox';

import './PendingRecipeDetail.css';



const PendingRecipeDetail = (props) => {
    const { postId } = props;

    const navigate = useNavigate();

    const [selectedValue, setSelectedValue] = useState([]);

    const [isOpen, setIsOpen] = useState(false);

    const { keycloak } = useKeycloak();

    const [isApprove, setIsApprove] = useState('APPROVED');

    const cities = [
        { name: 'New York', code: 'NY' },
        { name: 'Rome', code: 'RM' },
        { name: 'London', code: 'LDN' },
        { name: 'Istanbul', code: 'IST' },
        { name: 'Paris', code: 'PRS' }
    ]

    const { mutate, isSuccess } = useMutation({
        mutationFn: async () => {
            const data = await ApproveRejectApi.updateStatusPost({ postId, isApprove }, keycloak.token);

            return data;
        },
        onSuccess: () => {
            console.log('success update');
            setIsOpen(false);
            navigate('/pendingRecipe', { state: isApprove });
        },
        onError: () => {
            console.log('error update');
        }
    });

    const handleApproveAndReject = (updateState) => {
        if (updateState === 'approve') {
            setIsApprove('APPROVED');
        }
        if (updateState === 'reject') {
            setIsApprove('REJECTED');
        }
        mutate();
    }

    const dialogFooter = (
        <div>
            {selectedValue.length > 0 && <PButton label="Submit" icon="pi pi-check" onClick={() => handleApproveAndReject('reject')} />}
        </div>
    );

    return (
        <div className="recipeDetailPending">
            <h1>Public this recipe ???</h1>
            <div className="recipeDetailPending__btn">
                <Button color='error' variant="outlined" sx={{ fontSize: "27px", height: "52px", width: "170px", borderRadius: "25px", margin: "10px" }}
                    onClick={() => setIsOpen(true)}
                >
                    Reject
                </Button>

                <Button color='success' variant="outlined" sx={{ fontSize: "27px", height: "52px", width: "170px", borderRadius: "25px", margin: "10px" }}
                    onClick={() => handleApproveAndReject('approve')}
                >
                    Approve
                </Button>
                <Dialog header="Why do you want to reject this recipe ???" visible={isOpen} style={{ width: '50vw' }} modal={true} onHide={() => setIsOpen(false)} footer={dialogFooter} >
                    <ListBox multiple value={selectedValue} onChange={(e) => setSelectedValue(e.value)} options={cities} optionLabel="name" />
                </Dialog>
            </div>

        </div>
    );
}

export default PendingRecipeDetail;