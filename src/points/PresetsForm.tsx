import {Box, Button, ButtonGroup, Grid} from "@mui/material";
import type {Dispatch} from "react";
import {useState} from "react";
import type {Player, PointsAction, PointsType} from "./reducer.ts";
import {partition} from 'lodash'
import {PresetConfirmationDialog} from "./PresetConfirmationDialog.tsx";
import {Star} from "@mui/icons-material";

export type PresetItem = {
    label: string;
    points: number;
    requiresConfirmation?: boolean;
    icon?: unknown;
    type: PointsType
};

const PRESETS: PresetItem[] = [
    {
        label: 'Kanapka',
        points: 5,
        requiresConfirmation: true,
        type: "ADD",
    },
    {
        label: 'Porcja warzyw',
        points: 1,
        type: "ADD",
    },
    {
        label: 'Mleko',
        points: 1,
        type: "ADD",
    },
    {
        label: 'Coś nowego',
        points: 2,
        type: "ADD",
    },
    {
        label: 'Porcja słodkiego',
        points: 3,
        requiresConfirmation: true,
        type: "SUBTRACT",
    },
    {
        label: '5 minut komputera',
        points: 2,
        type: "SUBTRACT",
    },
]

const [additions, subtractions] = partition(PRESETS, ({type}) => type === 'ADD');

export const PresetsForm = ({player: currentPlayer, dispatch}: {
    player: Player,
    dispatch: Dispatch<PointsAction>
}) => {
    const [confirmationItem, setConfirmationItem] = useState<PresetItem | null>(null);

    return (
        <>
            <Box>
                <Box sx={{m: 4}}>
                    <ButtonGroup color="success" variant="outlined">
                        <Grid container rowSpacing={1} columnSpacing={{xs: 1, sm: 2, md: 3}}>
                            {additions.map((preset, i) => (
                                <Button key={`additions-${i}`} onClick={() => {
                                    if (preset.requiresConfirmation) {
                                        setConfirmationItem(preset);
                                    } else {
                                        dispatch({
                                            type: preset.type,
                                            payload: {
                                                player: currentPlayer,
                                                points: preset.points,
                                                comment: preset.label
                                            }
                                        });
                                    }
                                }} endIcon={preset.requiresConfirmation ? <Star/> : undefined}>
                                    {preset.label}
                                </Button>
                            ))}
                        </Grid>
                    </ButtonGroup>
                </Box>

                <Box sx={{m: 4}}>
                    <ButtonGroup color="error" variant="outlined">
                        <Grid container rowSpacing={1} columnSpacing={{xs: 1, sm: 2, md: 3}}>
                            {subtractions.map((preset, i) => (
                                <Button key={`subtractions-${i}`} onClick={() => {
                                    if (preset.requiresConfirmation) {
                                        setConfirmationItem(preset);
                                    } else {
                                        dispatch({
                                            type: preset.type,
                                            payload: {
                                                player: currentPlayer,
                                                points: preset.points,
                                                comment: preset.label
                                            }
                                        });
                                    }
                                }} endIcon={preset.requiresConfirmation ? <Star/> : undefined}>
                                    {preset.label}
                                </Button>
                            ))}
                        </Grid>
                    </ButtonGroup>
                </Box>
            </Box>

            {confirmationItem && <PresetConfirmationDialog item={confirmationItem} onConfirm={(item) => {
                dispatch({
                    type: item.type,
                    payload: {
                        player: currentPlayer,
                        points: item.points,
                        comment: item.label
                    }
                });
                setConfirmationItem(null);
            }} onCancel={() => {
                setConfirmationItem(null);
            }}/>}
        </>
    )
}