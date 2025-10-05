import {useEffect, useReducer, useState} from "react";
import {PLAYERS, pointsReducer} from "./reducer.ts";
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
    Switch,
    TextField
} from "@mui/material";

export type PointsState = {
    totals: Record<typeof PLAYERS[number], number>;
    journal: JournalItem[];
}

export type JournalItem = {
    player: typeof PLAYERS[number];
    actionType: 'ADD' | 'SUBTRACT';
    points: number;
    comment: string;
}

const STORAGE_KEY = 'POINTS_JOURNAL';

const defaultState = () => {
    const defaultState = {
        totals: {
            [PLAYERS[0]]: 0,
            [PLAYERS[1]]: 0,
            [PLAYERS[2]]: 0,
        },
        journal: []
    };

    try {
        const stateString = localStorage.getItem(STORAGE_KEY);
        if (!stateString) return defaultState;

        return JSON.parse(stateString) as PointsState;
    } catch (e) {
        console.error("Can't load the state", e)
        return defaultState
    }
}

export const Points = () => {
    const [state, dispatch] = useReducer(pointsReducer, undefined, defaultState);
    const [currentPlayer, setCurrentPlayer] = useState<typeof PLAYERS[number] | undefined>();
    const [comment, setComment] = useState('');
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

                <Box sx={{m: 2}}>
                    <TextField label="Komentarz" variant="outlined" value={comment}
                               onChange={(e) => setComment(e.target.value)}/>
                </Box>

                <Box>
                    <ButtonGroup color="success" variant="outlined">
                        <Button onClick={() => {
                            setComment('');
                            dispatch({
                                type: 'ADD',
                                payload: {player: currentPlayer, points: 1, actionType: 'ADD', comment: comment || 'Porcja warzyw'}
                            });
                        }}>
                            Porcja warzyw
                        </Button>
                        <Button onClick={() => {
                            setComment('');
                            dispatch({
                                type: 'ADD',
                                payload: {player: currentPlayer, points: 2, actionType: 'ADD', comment: comment || 'Coś nowego'}
                            });
                        }}>
                            Coś nowego
                        </Button>
                    </ButtonGroup>
                </Box>

                <Box>
                    <ButtonGroup color="error" variant="outlined">
                        <Button onClick={() => {
                            setComment('');
                            dispatch({
                                type: 'SUBTRACT',
                                payload: {player: currentPlayer, points: 3, actionType: 'SUBTRACT', comment: comment || 'Porcja słodkiego'}
                            });
                        }}>
                            Porcja słodkiego
                        </Button>
                        <Button onClick={() => {
                            setComment('');
                            dispatch({
                                type: 'SUBTRACT',
                                payload: {player: currentPlayer, points: 2, actionType: 'SUBTRACT', comment: comment || '5 minut komputera'}
                            });
                        }}>
                            5 minut komputera
                        </Button>
                    </ButtonGroup>
                </Box>

                <Box gap={2}>
                    <FormControlLabel
                        control={<Switch checked={showJournal} onChange={() => setShowJournal(!showJournal)} />}
                        label="Show"
                    />
                    <Collapse in={showJournal}>
                        <List>
                            {state.journal.filter(({player}) => player === currentPlayer).reverse().map((item) => {
                                console.log({ item})
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

        <Button variant="contained" color="error" onClick={() => {
            dispatch({type: 'RESET'});
        }} sx={{ mt: 4 }}>Reset</Button>
    </>
};