import {Box, Button, ButtonGroup, TextField} from "@mui/material";
import {useState} from "react";
import type {Player, PointsAction} from "./reducer.ts";
import type {Dispatch} from "react";

export const PresetsForm = ({player: currentPlayer, dispatch}: { player: Player, dispatch: Dispatch<PointsAction> }) => {
    const [comment, setComment] = useState('');

    return (
        <>
            <Box sx={{m: 4}}>
                <TextField label="Komentarz" variant="outlined" value={comment}
                           onChange={(e) => setComment(e.target.value)}/>
            </Box>

            <Box sx={{m: 4}}>
                <ButtonGroup color="success" variant="outlined">
                    <Button onClick={() => {
                        setComment('');
                        dispatch({
                            type: 'ADD',
                            payload: {
                                player: currentPlayer,
                                points: 1,
                                actionType: 'ADD',
                                comment: comment || 'Porcja warzyw'
                            }
                        });
                    }}>
                        Porcja warzyw
                    </Button>
                    <Button onClick={() => {
                        setComment('');
                        dispatch({
                            type: 'ADD',
                            payload: {
                                player: currentPlayer,
                                points: 2,
                                actionType: 'ADD',
                                comment: comment || 'Coś nowego'
                            }
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
                            payload: {
                                player: currentPlayer,
                                points: 3,
                                actionType: 'SUBTRACT',
                                comment: comment || 'Porcja słodkiego'
                            }
                        });
                    }}>
                        Porcja słodkiego
                    </Button>
                    <Button onClick={() => {
                        setComment('');
                        dispatch({
                            type: 'SUBTRACT',
                            payload: {
                                player: currentPlayer,
                                points: 2,
                                actionType: 'SUBTRACT',
                                comment: comment || '5 minut komputera'
                            }
                        });
                    }}>
                        5 minut komputera
                    </Button>
                </ButtonGroup>
            </Box>
        </>
    )
}