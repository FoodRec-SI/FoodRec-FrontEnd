import Rating from '@mui/material/Rating';
import { ProgressBar } from 'primereact/progressbar';
import { Button } from 'primereact/button';

import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import './RatingArea.css'

import { RatingApi } from '../../api/RatingApi';
import { useKeycloak } from "@react-keycloak/web";
import { useQuery, useMutation } from 'react-query';


const labels = {
    1: 'Useless',
    2: 'Poor',
    3: 'Ok',
    4: 'Good',
    5: 'Excellent',
};

function getLabelText(value) {
    return `${value} Star${value !== 1 ? 's' : ''}, ${labels[value]}`;
}

const RatingArea = () => {
    const [value, setValue] = useState(0);
    const [hover, setHover] = useState(-1);

    const location = useLocation();

    const id = location.pathname.split("/")[2];

    const { keycloak } = useKeycloak();

    const { mutate, onSuccess } = useMutation(
        async () => {
            const response = await RatingApi.updateRating({ "postId": id, "score": value }, keycloak.token);
            return response;
        },
        {
            onSuccess: () => {
                console.log("success");
            }
        }
        
    )
    const handleRating = () => {
        mutate();
    }

    return (
        <>
            <div className="rating_area">
                <h3 style={{ justifySelf: "center" }}>What Do You Think About My Recipe ?</h3>
                <div className="rating_area_yourPoint">
                    <div style={{ display: "flex", alignItems: "center" }}>
                        <Rating
                            name="hover-feedback"
                            value={value}
                            precision={1}
                            getLabelText={getLabelText}
                            onChange={(event, newValue) => {
                                if (value !== newValue) {
                                    setValue(newValue);
                                }
                                if (newValue === null || newValue === value) {
                                    setValue(0);
                                }

                            }}
                            onChangeActive={(event, newHover) => {
                                setHover(newHover);
                            }}

                            sx={{ padding: "10px" }}
                        />
                        {value !== null && <h6>{labels[hover !== -1 ? hover : value]}</h6>}
                    </div>
                    {value > 0 && <Button label="Submit" rounded onClick={handleRating} />}
                </div>
                <CountRatingPoint />
                <CountRatingPoint />
                <CountRatingPoint />
                <CountRatingPoint />
                <CountRatingPoint />
            </div>
        </>
    );
}

function CountRatingPoint() {
    return (
        <div className="rating_area_countRatingPoint">
            <p>5 stars</p>
            <div style={{ width: '70%' }}>
                <ProgressBar
                    value={65}
                    showValue={false}
                    color='#FFFF99'
                />
            </div>
            <p>65%</p>
        </div>
    )
}

export default RatingArea;