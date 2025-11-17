import {useEffect, useState} from "react";
import {usePoints} from "./usePoints.ts";
import {enqueueSnackbar} from "notistack";
import {Box, Button, CircularProgress, Grid, Typography} from "@mui/material";

const goRoot = () => {
    window.location.replace(new URL(window.location.href).pathname)
}

export const Import = () => {
    const importParam = new URLSearchParams(window.location.search).get('import');
    const {dispatch} = usePoints();
    const [importState, setImportState] = useState<null | 'PENDING' | 'SUCCESS' | 'FAILURE'>(null);
    const pending = importState === 'PENDING';

    useEffect(() => {
        if (importState === 'PENDING' && importParam) {

            const state = JSON.parse(importParam);
            dispatch({type: 'SET_STATE', payload: state});

            enqueueSnackbar('Punkty zostały zaimportowane')
            goRoot();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [importState]);

    if (!importParam) {
        enqueueSnackbar('Nieprawidłowy parametr import', {variant: 'error'})
        goRoot();
        return null;
    }

    return <Grid container direction="column" sx={{alignItems: 'center'}}>

        <Typography variant="h6" sx={{m: 4}}>Czy na pewno chcesz zaimportować punkty?</Typography>
        {pending && <CircularProgress enableTrackSlot/>}

        <Box sx={{display: 'flex', justifyContent: 'space-between', width: '100%'}}>
            <Button onClick={goRoot} disabled={pending}>Anuluj</Button>
            <Button onClick={() => {
                setImportState('PENDING')
            }} disabled={pending}>Potwierdź</Button>
        </Box>
    </Grid>
}