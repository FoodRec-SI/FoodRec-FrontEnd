import { MultiSelect } from 'primereact/multiselect';

import './TagSelected.css';
import { useState } from 'react';

const tags = [
    'Breakfast',
    'Brunch',
    'Lunch',
    'Dinner',
    'Appetizer',
    'Snack',
    'Dessert',
    'Baking',
    'Grilling',
    'Roasting',
    'Slow Cooker',
];




const TagSelected = () => {

    const [tag, setTag] = useState([]);

    return (
        <div className="tagSelected">
            <MultiSelect 
            value={tag} 
            options={tags} 
            onChange={(e) => setTag(e.value)} 
            placeholder="Select Tags" 
            filter
            display='chip'
            
            style={{width:"90%",padding:"10px"}}/>
        </div>

    );
}



export default TagSelected;

