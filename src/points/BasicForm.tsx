import {Box, Button, TextField} from "@mui/material";
import type {Dispatch} from "react";
import {useState} from "react";
import type {Player, PointsAction} from "./reducer.ts";

export const BasicForm = ({player: currentPlayer, dispatch}: { player: Player, dispatch: Dispatch<PointsAction> }) => {
    const [comment, setComment] = useState('');

    return (
        <>
            <Box sx={{m: 4}}>
                <TextField label="Komentarz" variant="outlined" value={comment}
                           onChange={(e) => setComment(e.target.value)}/>
            </Box>

            <Box sx={{gap: 2, display: 'flex', justifyContent: 'center', m: 4}}>
                <Button color="success" variant="contained" onClick={() => {
                    setComment('');
                    dispatch({
                        type: 'ADD',
                        payload: {player: currentPlayer, points: 1, actionType: 'ADD', comment: comment}
                    });
                }}>
                    +1
                </Button>

                <Button color="error" variant="contained" onClick={() => {
                    setComment('');
                    dispatch({
                        type: 'SUBTRACT',
                        payload: {player: currentPlayer, points: 1, actionType: 'SUBTRACT', comment}
                    });
                }}>
                    -1
                </Button>
            </Box>
        </>
    )
}