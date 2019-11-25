import React from 'react';
import { createStyles, makeStyles, useTheme, Theme } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Chip from '@material-ui/core/Chip';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        formControl: {
            margin: theme.spacing(1),
            minWidth: 120,
            maxWidth: 300,
        },
        chips: {
            display: 'flex',
            flexWrap: 'wrap',
        },
        chip: {
            margin: 2,
        },
        noLabel: {
            marginTop: theme.spacing(3),
        },
    }),
);

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

const category = [
    'business',
    'entertainment',
    'gaming',
    'general',
    'music',
    'politics',
    'science-and-nature',
    'sport',
    'technolo'
];

const language = [
    'en', 'de', 'fr'
]

const country = [
    'au', 'de', 'gb', 'in', 'it', 'us'
]

let name: string[];

function getStyles(name: string, personName: string[], theme: Theme) {
    return {
        fontWeight:
            personName.indexOf(name) === -1
                ? theme.typography.fontWeightRegular
                : theme.typography.fontWeightMedium,
    };
}

function detectType(type: string) {
    switch (type) {
        case 'category':
            name = category
            break;
        case 'language':
            name = language
            break;
        case 'country':
            name = country
            break;
    }
}

export default function MultipleSelect(props: any) {
    detectType(props.type);
    const classes = useStyles();
    const theme = useTheme();
    const [personName, setPersonName] = React.useState<string[]>([]);

    const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        setPersonName(event.target.value as string[]);
        props.filterChange(event.target.value as string[], props.type);
    };

    return (
        <>
            <FormControl className={classes.formControl}>
                <InputLabel id="demo-mutiple-chip-label">{props.type}</InputLabel>
                <Select
                    labelId="demo-mutiple-chip-label"
                    id="demo-mutiple-chip"
                    multiple
                    value={props.value}
                    onChange={handleChange}
                    input={<Input id="select-multiple-chip" />}
                    renderValue={selected => (
                        <div className={classes.chips}>
                            {(selected as string[]).map(value => (
                                <Chip key={value} label={value} className={classes.chip} />
                            ))}
                        </div>
                    )}
                    MenuProps={MenuProps}
                >
                    {name.map(name => (
                        <MenuItem key={name} value={name} style={getStyles(name, personName, theme)}>
                            {name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

        </>
    );
}
