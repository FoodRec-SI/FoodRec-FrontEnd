import './HistoryTable.css'

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';


import { useState } from 'react';
import { useKeycloak } from "@react-keycloak/web";
import { useQuery } from "react-query";

import { PendingApi } from '../../api/PendingApi';

import Loading from '../Loading/Loading';
import RecipeDetail from '../RecipeDetail/RecipeDetail';

const HistoryTable = () => {

    const { keycloak } = useKeycloak();

    const [selectedRecipe, setSelectedRecipe] = useState(null);

    const [openSelectedRecipe, setOpenSelectedRecipe] = useState(false);

    const { data: historyData, isLoading, error, refetch, isSuccess } = useQuery(
        ["pending", 1, 10],
        async () => {
            const response = await PendingApi.getUpdatedPendingRecipes(keycloak.token, 1, 10);
            return response.data.content;
        },
    );
    const statusTemplate = (rowData) => {
        return (
            <div>
                {rowData.postStatus === 'APPROVED' ?

                    <span className="status-approved">{rowData.postStatus}</span>
                    :
                    <span className="status-pending">{rowData.postStatus}</span>
                }
            </div>
        );
    }

    const header = (
        <div className="table-header">
            HELLO
        </div>
    );

    if (isLoading) return <Loading />


    return (
        <>
            {isSuccess &&
                <div className="historyTable">
                    <DataTable
                        selectionMode="single"
                        onSelectionChange={(e) => {
                            setOpenSelectedRecipe(true)
                            setSelectedRecipe(e.value.postId)
                        }}
                        header={header} value={historyData}
                        stripedRows
                        paginator
                        sortMode="multiple"
                        rows={5}
                        rowsPerPageOptions={[5, 10]}
                        size="large">
                        <Column align="center" field="postId" header="PostID"></Column>
                        <Column align="center" field="recipeName" header="Name" sortable></Column>
                        <Column align="center" field="verifiedTime" header="Date" sortable></Column>
                        <Column align="center" field="postStatus" header="Status" body={statusTemplate} sortable></Column>
                    </DataTable>
                </div>}

            <Dialog header="Recipe Detail" visible={openSelectedRecipe} style={{ width: '70vw' }} onHide={() => {setOpenSelectedRecipe(false)}}>
                <RecipeDetail recipeId={selectedRecipe} />
            </Dialog>
        </>
    );
}

export default HistoryTable;