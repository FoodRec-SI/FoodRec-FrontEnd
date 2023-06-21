import { useState } from 'react'


import RecipeCardList from "../RecipeCardList/RecipeCardList"
import IconButton from '@mui/material/IconButton';
import SortIcon from '@mui/icons-material/Sort';

import { useKeycloak } from "@react-keycloak/web";
import { useQuery } from "react-query";
import { PendingApi } from "../../api/PendingApi";
import './PendingList.css'


const PendingList = () => {
    const { keycloak } = useKeycloak();

    const [soft, setSoft] = useState(true);

    const handleClck = () => {
        setSoft(!soft);
    }

    const fetchPendingRecipes = async () => {
        const data = await PendingApi.getPendingRecipes(keycloak.token);
        console.log(data);
        return data;
    }

    const { data, isLoading, isError } = useQuery({
        queryKey: ["pendingRecipes"],
        queryFn: fetchPendingRecipes,
    });

    return (
        <>
            <div className="pendingPage">
                {isLoading ? (
                    <div>Loading...</div>
                ) : isError ? (
                    <div>Error occurred while fetching data</div>
                ) : (
                    <div>
                        <div className="pendingPage__header">
                            {soft == true ? <h1>Newest</h1> : <h1>Oldest</h1>}
                            <IconButton aria-label="delete" onClick={handleClck}>
                                {soft == true ? <SortIcon fontSize="large" /> : <SortIcon fontSize="large" sx={{ transform: "scaleY(-1)" }} />}
                            </IconButton>
                        </div>
                        <RecipeCardList props={data.data.content} pending="pending" />
                    </div>
                )}
            </div>
        </>
    )
}

export default PendingList;