import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles(theme => ({
    button: {
        margin: theme.spacing(1),
    },
    input: {
        display: 'none',
    },
}));

export default function NewsSortingButton(props: any) {
    let name: string = props.name;

    const classes = useStyles();
    const isAvailable = props.sortBysAvailable.indexOf(name) === -1;

    function handleButtonClick() {
        props.sortedByType(name);
    }

    return (
        <div>
            <Button disabled={isAvailable} onClick={handleButtonClick} variant="contained" color="primary" className={classes.button}>
                {name}
            </Button>
        </div>
    );
}
