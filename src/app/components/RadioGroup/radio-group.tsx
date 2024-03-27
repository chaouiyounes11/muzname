import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import {ChangeEvent} from 'react';

interface RadioGroupProps  {
    nameGroup: string;
    choices: {value1: string, value2: string};
    colors: {colorGroup1: {color1: string, color2: string}, colorGroup2: {color1: string, color2: string}};
    state: string;
    change: (event: ChangeEvent<HTMLInputElement>) => void;
    category: string;
};

export const RadioGroupComponent = (props: RadioGroupProps) => {
    return (
        <FormControl>
            <FormLabel>{props.category}</FormLabel>
            <RadioGroup
                classes={{root: 'flex'}}
                row
                name={props.nameGroup}
            >
                <FormControlLabel value={props.choices.value1} control={<Radio
                    sx={{
                        color: props.colors.colorGroup1.color1,
                        '&.Mui-checked': {
                            color: props.colors.colorGroup1.color2,
                        },
                    }}
                    checked={props.state === props.choices.value1}
                    onChange={props.change}
                    value={props.choices.value1}
                    name={props.category}
                    inputProps={{ 'aria-label': props.choices.value1 }}
                />} label={props.choices.value1.charAt(0).toUpperCase() + props.choices.value1.slice(1)} />
                <FormControlLabel value={props.choices.value2} control={
                    <Radio
                        sx={{
                            color: props.colors.colorGroup2.color1,
                            '&.Mui-checked': {
                                color: props.colors.colorGroup2.color2,
                            },
                        }}
                        checked={props.state === props.choices.value2}
                        onChange={props.change}
                        value={props.choices.value2}
                        name={props.category}
                        inputProps={{ 'aria-label': props.choices.value2 }}
                    />
                } label={props.choices.value2.charAt(0).toUpperCase() + props.choices.value2.slice(1)} />
            </RadioGroup>
        </FormControl>
    )
};
