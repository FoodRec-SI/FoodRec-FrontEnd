import './MyRecipeDetail.css'

import { Button } from 'primereact/button';

import { useQuery, useMutation } from "react-query";
import { useKeycloak } from "@react-keycloak/web";

import { PublicRecipeApi } from '../../api/PublicRecipeApi';

const MyRecipeDetail = ({ recipeId }) => {

    const { keycloak } = useKeycloak();

    const {data: isPublic , refetch}  = useQuery(
        ['isPublic'],
        async ()  => { 
            const response = await PublicRecipeApi.checkIsPublic(keycloak.token, recipeId);
            return response.data;
        }
    )

    const publicNow = async () => {
        const response = await PublicRecipeApi.publicRecipe(keycloak.token, recipeId);
        return response.data;
    }
        
    const { mutate : publicMutate } = useMutation(publicNow, {
        onSuccess: () => {
            refetch()
        },
    })

    return (
        <>
            {isPublic === false ? <div className='myRecipeDetail'>
                <h1>Public this Recipe ?</h1>
                <Button label="Public Now !" severity="info" rounded onClick={publicMutate }/>
            </div> : null}
        </>
    );
}

export default MyRecipeDetail;
