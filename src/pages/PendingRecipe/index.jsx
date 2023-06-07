import PendingList  from "../../components/PendingList/PendingList";
import { useLocation } from 'react-router-dom';

const PendingRecipe = () => {

    const location = useLocation();
    const status = location.state;

    return (
        <>
            {status && <h1>{status}</h1>}
            <PendingList/>
        </>
    )
}

export default PendingRecipe;