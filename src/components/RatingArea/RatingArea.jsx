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
import { startOfDay } from 'date-fns/fp';

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
            if(response.status === 200){
                setOpen(false);
                
            }
            return response;
        }, {
        onSuccess: () => {
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
                {<div className='rating_area_overView'>
                    <br />
                    <div className="rating_area_overView_score">
                        <Rating
                            value={ratingData != null ? ratingData.average : 0}
                            precision={0.5}
                            readOnly
                            sx={{ paddingLeft: "15px" }}
                        />
                        <p>{ratingData.average == null ? 0 : ratingData.average } out of 5</p>
                    </div>
                    <p>{ratingData.raters== null ? 0 : ratingData.raters } Customers rating</p>
                </div>}
                <br />
                
                    <>
                    {percentageRatingData && <CountRatingPoint key={5} value={percentageRatingData.five_stars} star={5}/>}
                    {percentageRatingData && <CountRatingPoint key={4} value={percentageRatingData.four_stars} star={4}/>}
                    {percentageRatingData && <CountRatingPoint key={3} value={percentageRatingData.three_stars} star={3}/>}
                    {percentageRatingData && <CountRatingPoint key={2} value={percentageRatingData.two_stars} star={2}/>}
                    {percentageRatingData && <CountRatingPoint key={1} value={percentageRatingData.one_star} star={1}/>}
                    </>
                    
                

                
                
                <br />
                <Button label="Rating now" text rounded severity="info" onClick={() => {
                    setValue(personalRatingData.rating);
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
                                    setHover( newHover !== -1 ? newHover : value);
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

function CountRatingPoint({value, star}) {
    return (
        <div className="rating_area_countRatingPoint">
            <p>{star} stars</p>
            <div style={{ width: '70%', }}>
                <ProgressBar
                    value={value}
                    showValue={value}
                    color='#faaf00'
                    
                    style={{ height: '16px' }}
                />
            </div>
            <p>65%</p>
        </div>
    )
}

export default RatingArea;