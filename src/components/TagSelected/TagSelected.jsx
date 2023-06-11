import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import { useTheme } from '@mui/material/styles';



import './TagSelected.css';
import { useState } from 'react';


const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

const names = [
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

function getStyles(name, tag, theme) {
    return {
        fontWeight:
            tag.indexOf(name) === -1
                ? theme.typography.fontWeightRegular
                : theme.typography.fontWeightMedium,
    };
}


const TagSelected = () => {

    const [tag, setTag] = useState([]);
    const theme = useTheme();

    const handleDelete = (chipToDelete) => () => {
        setTag((chips) => chips.filter((chip) => chip !== chipToDelete));
    };


    const handleChange = (event) => {
        const {
            target: { value },
        } = event;
        setTag(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );
    };

    return (
        <div className="tagSelected">
            <div className="tagSelected__title">
                <FormControl sx={{ m: 1, width: "100%" }}>
                    <InputLabel id="demo-multiple-chip-label">Choose your tag for the best description of your recipe</InputLabel>
                    <Select
                        labelId="demo-multiple-chip-label"
                        id="demo-multiple-chip"
                        multiple
                        value={tag}
                        onChange={handleChange}
                        input={<OutlinedInput id="select-multiple-chip" label="Choose your tag for the best description of your"/>}
                        renderValue={(selected) => (
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                {selected.map((value) => (
                                    <Chip key={value} label={value} />
                                ))}
                            </Box>
                        )}
                        MenuProps={MenuProps}
                    >
                        {names.map((name) => (
                            <MenuItem
                                key={name}
                                value={name}
                                style={getStyles(name, tag, theme)}
                            >
                                {name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </div>
        </div>

    );
}



export default TagSelected;
