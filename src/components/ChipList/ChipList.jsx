
import Chip from '@mui/material/Chip';




const ChipList = (props) => {


    const { tags } = props;

    return ( 
        <div className="chiplist">
            {tags && tags.map((tag) => (
                <Chip key={tag.tagId} label={tag.tagName} variant="outlined" sx={{margin:"3px"}}/>
            )) }
        </div>
     );
}
 
export default ChipList;