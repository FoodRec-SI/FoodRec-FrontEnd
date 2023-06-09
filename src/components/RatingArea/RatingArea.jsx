import Rating from '@mui/material/Rating';
import { ProgressBar } from 'primereact/progressbar';
import { Button } from 'primereact/button';

import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import './RatingArea.css'

import { RatingApi } from '../../api/RatingApi';
import { useKeycloak } from "@react-keycloak/web";
import { useQuery, useMutation, QueryClient } from 'react-query';

import { Dialog } from 'primereact/dialog';


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

    const [open, setOpen] = useState(false);

    const location = useLocation();

    const id = location.pathname.split("/")[2];

    const { keycloak } = useKeycloak();

    const { data: ratingData, isLoading, error, refetch: ratingDataRefetch } = useQuery(
        ["rating", id],
        async () => {
            const response = await RatingApi.getRating(keycloak.token, id);
            return response.data;
        },
    );

    const { data: personalRatingData, isSuccess: isPersonalRatingSuccess, refetch: personalRatingRefetch } = useQuery(
        ["personalRating", id],
        async () => {
            const response = await RatingApi.getPersonalRating(keycloak.token, id);
            setValue(response.data.rating);
            return response.data;
        },
    );

    const { data: percentageRatingData, isSuccess: isPercentageRatingSuccess, refetch: percentageRatingRefetch } = useQuery(
        ["percentageRating", id],
        async () => {
            const response = await RatingApi.getPercnetageRating(keycloak.token, id);
            console.log(response.data);
            return response.data;
        },
    );

    const { mutate, onSuccess } = useMutation(
        async () => {
            const response = await RatingApi.updateRating({ "postId": id, "score": value }, keycloak.token);
            return response;
        }, {
        onSuccess: () => {
            setOpen(false);
            console.log("success");
            personalRatingRefetch();
            ratingDataRefetch();
            percentageRatingRefetch();
        }
    }

    )
    const handleRating = () => {
        mutate();
    }

    return (
        <>
            <div className="rating_area">
                <h1>Customers Review</h1>
                {ratingData && <div className='rating_area_overView'>
                    <br />
                    <div className="rating_area_overView_score">
                        <Rating
                            name="read-only"
                            value={ratingData.average}
                            precision={0.5}
                            readOnly
                            sx={{ paddingLeft: "15px" }}
                        />
                        <p>{ratingData.average} out of 5</p>
                    </div>
                    <p>{ratingData.raters} Customers rating</p>
                </div>}
                <br />

                <CountRatingPoint />
                <CountRatingPoint />
                <CountRatingPoint />
                <CountRatingPoint />
                <CountRatingPoint />
                <br />
                <Button label="Rating now" text rounded severity="info" onClick={() => {
                    setOpen(true);
                }} />
                <Dialog
                    header="Rating"
                    visible={open}
                    style={{ width: '50vw' }}
                    onHide={() => { setOpen(false), setValue(personalRatingData.rating) }}
                >
                    <div className="rating_area_yourPoint">
                        <div style={{ display: "flex", alignItems: "center", }}>
                            <Rating
                                name="hover-feedback"
                                // value={personalRatingData ? personalRatingData.rating : value}
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
                            {value !== null && <h6 style={{ fontSize: "16px", fontWeight: "100", color: "#747474" }}>{labels[hover !== -1 ? hover : value]}</h6>}
                        </div>
                        {value > 0 && <Button label="Submit" rounded onClick={handleRating} text />}
                    </div>
                </Dialog>
            </div>
        </>
    );
}

function CountRatingPoint() {
    return (
        <div className="rating_area_countRatingPoint">
            <p>5 stars</p>
            <div style={{ width: '70%', }}>
                <ProgressBar
                    value={65}
                    showValue={false}
                    color='#faaf00'
                    style={{ height: '12px' }}
                />
            </div>
            <p>65%</p>
        </div>
    )
}

export default RatingArea;