import Rating from '@mui/material/Rating';
import { ProgressBar  } from 'primereact/progressbar';

import { useState } from 'react';
import './RatingArea.css'


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
    const [hover, setHover] = useState(-1);ProgressBar


    return (
        <>
        <div className="rating_area">
            <h3>What Do You Think About My Recipe ?</h3>
            <div className="rating_area_yourPoint">
                <Rating
                    name="hover-feedback"
                    value={value}
                    precision={1}
                    getLabelText={getLabelText}
                    onChange={(event, newValue) => {
                        if(value !== newValue){
                            setValue(newValue);
                        }
                        if(newValue === null || newValue === value){
                            setValue(0);
                        }
                        
                    }}
                    onChangeActive={(event, newHover) => {
                        setHover(newHover);
                    }}

                    sx={{ padding: "10px"}}
                />
                {value !== null && <h6>{labels[hover !== -1 ? hover : value]}</h6>}
            </div>
            <CountRatingPoint/>
            <CountRatingPoint/>
            <CountRatingPoint/>
            <CountRatingPoint/>
            <CountRatingPoint/>
        </div>
        </>
    );
}

function CountRatingPoint(){
    return(
        <div className="rating_area_countRatingPoint">
            <p>5 stars</p>
            <ProgressBar 
            value={65} 
            showValue={false}
            color= '#FFFF99'
            style={{width:'70%'}}/>
            <p>65%</p>
        </div>
    )
}

export default RatingArea;