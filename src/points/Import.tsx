import {useEffect, useState} from "react";
import {usePoints} from "./usePoints.ts";
import {enqueueSnackbar} from "notistack";
import {Box, Button, CircularProgress, Grid, Typography} from "@mui/material";
import {decompressText} from "./utils.ts";
import type {PointsState} from "./reducer.ts";

const goRoot = () => {
    window.location.replace(new URL(window.location.href).pathname)
}

export const Import = () => {
    const importParam = new URLSearchParams(window.location.search).get('import');
    const {dispatch} = usePoints();
    const [importState, setImportState] = useState<null | 'PENDING' | 'SUCCESS' | 'FAILURE'>(null);
    const pending = importState === 'PENDING';

    const [importedState, setImportedState] = useState<PointsState>();

    useEffect(() => {
        if(!importParam) return;
        
        const buffer = Uint8Array.fromBase64(importParam, {alphabet: 'base64url'})
        decompressText(buffer).then((result) => {
            try {
                const state = JSON.parse(result);
                setImportedState(state);
            } catch (e) {
                console.error(e);
                enqueueSnackbar('Nieprawidłowy parametr import', {variant: 'error'})
                goRoot();
            }
        });
    }, [importParam]);

    useEffect(() => {
        if (importState === 'PENDING' && importedState) {
            dispatch({type: 'SET_STATE', payload: importedState});

            enqueueSnackbar('Punkty zostały zaimportowane')
            goRoot();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [importState]);


    if (!importParam || !importedState) {
        return null;
    }

    return <Grid container direction="column" sx={{alignItems: 'center'}}>

        <Typography variant="h6" sx={{m: 4, mb: 1}}>Czy na pewno chcesz zaimportować punkty?</Typography>
        <Typography variant="body1" sx={{mb: 4}}>{(Object.entries(importedState.totals).map(([player, points]) => `${player}: ${points}`).join(', '))}</Typography>
        {pending && <CircularProgress enableTrackSlot/>}

        <Box sx={{display: 'flex', justifyContent: 'space-between', width: '100%'}}>
            <Button onClick={goRoot} disabled={pending}>Anuluj</Button>
            <Button onClick={() => {
                setImportState('PENDING')
            }} disabled={pending}>Potwierdź</Button>
        </Box>
    </Grid>
}