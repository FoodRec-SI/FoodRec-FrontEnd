import { Tag } from '@mui/icons-material';
import Chip from '@mui/material/Chip';




const ChipList = (props) => {

    return ( 
        <div className="chiplist">
            {props.tags.map((tag) => (
                <Chip key={tag.tagId} label={tag.tagName} variant="outlined" sx={{margin:"3px"}}/>
            )) }
        </div>
     );
}
 
export default ChipList;