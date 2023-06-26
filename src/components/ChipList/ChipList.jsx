import { Tag } from '@mui/icons-material';
import Chip from '@mui/material/Chip';


const ChipList = ({props}) => {

    // const {tags} = props;

    // const tags = ['Breakfast',
    // 'Brunch',
    // 'Lunch',
    // 'Dinner',
    // 'Appetizer',
    // 'Snack',
    // 'Dessert',
    // 'Baking',
    // 'Grilling',
    // 'Roasting',
    // 'Slow Cooker',
    // ];


    return ( 
        <div className="chiplist">
            {props.map((tag) => (
                <Chip key={tag} label={tag} variant="outlined" sx={{margin:"3px"}}/>
            )) }
        </div>
     );
}
 
export default ChipList;