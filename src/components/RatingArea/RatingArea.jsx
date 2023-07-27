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

const queryClient = new QueryClient();

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

const RatingArea = ({ refetchRecipeDetail, isPostSuccess }) => {
    const [value, setValue] = useState(0);
    const [hover, setHover] = useState(-1);

    const [open, setOpen] = useState(false);

    const location = useLocation();

    const id = location.pathname.split("/")[2];

    const { keycloak } = useKeycloak();

    const { data: ratingData, refetch: ratingDataRefetch, isSuccess: isRatingDataSuccess } = useQuery(
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
            return response.data;
        },
    );

    const { data: percentageRatingData, isSuccess: isPercentageRatingSuccess, refetch: percentageRatingRefetch } = useQuery(
        ["percentageRating", id],
        async () => {
            const response = await RatingApi.getPercnetageRating(keycloak.token, id);
            return response.data;
        },
    );

    const { mutate, onSuccess } = useMutation(
        async () => {
            const dataToRating = { "postId": id, "score": value }
            const response = await RatingApi.updateRating(dataToRating, keycloak.token);
            return response;
        }, {
        onSuccess: () => {
            setOpen(false);
            queryClient.invalidateQueries(["post", id]);
            refetchRecipeDetail();
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

            {isRatingDataSuccess && <div className="rating_area">
                <h1>Customers Review</h1>
                {<div className='rating_area_overView'>
                    <br />
                    <div className="rating_area_overView_score">
                        <Rating
                            value={ratingData == "" ? 0 : ratingData.average}
                            precision={0.5}
                            readOnly
                            sx={{ paddingLeft: "15px" }}
                        />
                        <p>{ratingData == "" ? 0 : ratingData.average} out of 5</p>
                    </div>
                    <p>{ratingData == "" ? 0 : ratingData.raters} Customers rating</p>
                </div>}
                <br />

                <>
                    {percentageRatingData && <CountRatingPoint key={5} value={percentageRatingData.five_stars} star={5} />}
                    {percentageRatingData && <CountRatingPoint key={4} value={percentageRatingData.four_stars} star={4} />}
                    {percentageRatingData && <CountRatingPoint key={3} value={percentageRatingData.three_stars} star={3} />}
                    {percentageRatingData && <CountRatingPoint key={2} value={percentageRatingData.two_stars} star={2} />}
                    {percentageRatingData && <CountRatingPoint key={1} value={percentageRatingData.one_star} star={1} />}
                </>

                <br />
                <Button label="Rating now" text rounded severity="info" onClick={() => {
                    setValue(personalRatingData.rating ? personalRatingData.rating : 0);
                    setOpen(true);
                }} />
                <Dialog
                    header="Rating"
                    visible={open}
                    style={{ width: '50vw' }}
                    onHide={() => { setOpen(false), setValue(personalRatingData.rating ? personalRatingData.rating : 0) }}
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
                                    setHover(newHover !== -1 ? newHover : value);
                                }}

                                sx={{ padding: "10px" }}
                            />
                            {value !== null && <h6 style={{ fontSize: "16px", fontWeight: "100", color: "#747474" }}>{labels[hover !== -1 ? hover : value]}</h6>}
                        </div>
                        {value > 0 && <Button label="Submit" rounded onClick={handleRating} text />}
                    </div>
                </Dialog>
            </div>
            }
        </>
    );
}

function CountRatingPoint({ value, star }) {
    return (
        <div className="rating_area_countRatingPoint">
            <p>{star} stars</p>
            <div style={{ width: '70%', }}>
                <ProgressBar
                    value={value}
                    color='#faaf00'
                    showValue={false}
                    style={{ height: '16px' }}
                />
            </div>
            <p>{value} %</p>
        </div>
    )
}

export default RatingArea;