import {useEffect, useReducer, useState} from "react";
import {defaultState, PLAYERS, pointsReducer, STORAGE_KEY} from "./reducer.ts";
import {
    Box,
    Button,
    ButtonGroup,
    Collapse,
    Container,
    FormControlLabel,
    Grid,
    List,
    ListItem,
    Rating,
    Switch
} from "@mui/material";
import {BasicForm} from "./BasicForm.tsx";
import {PresetsForm} from "./PresetsForm.tsx";

export const Points = () => {
    const [state, dispatch] = useReducer(pointsReducer, undefined, defaultState);
    const [currentPlayer, setCurrentPlayer] = useState<typeof PLAYERS[number] | undefined>();
    const [showJournal, setShowJournal] = useState(false);

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        } catch (error) {
            console.error("Error saving to localStorage:", error);
        }
    }, [state]);

    return <>
        <Container>
            <ButtonGroup size="large" variant="contained">
                {PLAYERS.map(player => (
                    <Button key={player}
                            color={currentPlayer === player ? 'primary' : 'inherit'}
                            onClick={() => setCurrentPlayer(player)}>{player}: {state.totals?.[player] ?? 0}</Button>
                ))}
            </ButtonGroup>

            {currentPlayer && (<>

                {state.mode === 'basic' ? <BasicForm player={currentPlayer} dispatch={dispatch} /> : <PresetsForm player={currentPlayer} dispatch={dispatch} />}

                <Box gap={2}>
                    <FormControlLabel
                        control={<Switch checked={showJournal} onChange={() => setShowJournal(!showJournal)} />}
                        label="Historia"
                    />
                    <Collapse in={showJournal}>
                        <List>
                            {state.journal.filter(({player}) => player === currentPlayer).reverse().map((item) => {
                                return (
                                    <ListItem
                                        style={{color: item.actionType === 'ADD' ? 'green' : 'red'}}>

                                        <Grid container>
                                            <Grid size={8}>
                                                {item.comment}
                                            </Grid>
                                            <Grid>
                                                <Rating name="read-only" value={item.points} readOnly />
                                            </Grid>
                                        </Grid>
                                    </ListItem>
                                );
                            })}
                        </List>
                    </Collapse>
                </Box>


            </>)}
        </Container>

        <Button variant="contained" onClick={() => {
            dispatch({type: 'MODE', payload: {mode: state.mode === 'basic' ? 'presets' : 'basic'}});
        }} sx={{ mt: 4 }}>Change mode</Button>
        <Button variant="contained" color="error" onClick={() => {
            dispatch({type: 'RESET'});
        }} sx={{ mt: 4 }}>Reset</Button>
    </>
};