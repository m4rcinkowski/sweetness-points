import {Box, Button, ButtonGroup, Grid} from "@mui/material";
import type {Dispatch} from "react";
import {useRef, useState} from "react";
import type {Player, PointsAction, PointsType} from "./reducer.ts";
import {partition} from 'lodash'
import {PresetConfirmationDialog} from "./PresetConfirmationDialog.tsx";
import {Star} from "@mui/icons-material";
import {usePoints} from "./usePoints.ts";

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


const PresetButton: React.FC<{ preset: PresetItem, currentPlayer: Player, onLongTap: () => void }> = ({
                                                                                                              preset,
                                                                                                              currentPlayer,
                                                                                                              onLongTap
                                                                                                          }) => {
    const {dispatch} = usePoints();
    const pressTimer = useRef<NodeJS.Timeout | null>(null);
    const isLongPress = useRef(false);
    const buttonRef = useRef<HTMLButtonElement>(null);

    const handleMouseDown: React.MouseEventHandler<HTMLButtonElement> = (e) => {
        e.preventDefault();
        e.stopPropagation();

        isLongPress.current = false;
        pressTimer.current = setTimeout(() => {
            isLongPress.current = true;
            onLongTap();
        }, 500);
    };

    const handleMouseUp: React.MouseEventHandler<HTMLButtonElement> = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (pressTimer.current) {
            clearTimeout(pressTimer.current);
        }

        if (!isLongPress.current) {
            dispatch({
                type: preset.type,
                payload: {
                    player: currentPlayer,
                    points: preset.points,
                    comment: preset.label
                }
            });
        }

        buttonRef.current?.blur();
    };

    const handleMouseLeave = () => {
        if (pressTimer.current) {
            clearTimeout(pressTimer.current);
        }
    };

    return <Button
        ref={buttonRef}
        onPointerDown={handleMouseDown}
        onPointerUp={handleMouseUp}
        onPointerOut={handleMouseLeave}
        onContextMenu={(e) => e.preventDefault()}
        endIcon={<div>
            {Array.from({length: preset.points}, (_, i) => <Star key={i}/>)}
        </div>}

    sx={{
        userSelect: 'none',           /* Standard: blocks text selection */
        touchAction: 'none',
    }}>
        {preset.label}
    </Button>
}

const [additions, subtractions] = partition(PRESETS, ({type}) => type === 'ADD');

export const PresetsForm = ({player: currentPlayer, dispatch}: {
    player: Player,
    dispatch: Dispatch<PointsAction>
}) => {
    const [confirmationItem, setConfirmationItem] = useState<PresetItem | null>(null);
    const confirmationDialogRef = useRef<any>(null);

    return (
        <>
            <Box>
                <Box sx={{m: 4}}>
                    <ButtonGroup color="success" variant="outlined">
                        <Grid container rowSpacing={1} columnSpacing={{xs: 1, sm: 2, md: 3}}>
                            {additions.map((preset, i) => (
                                <PresetButton key={`additions-${i}`} currentPlayer={currentPlayer} preset={preset}
                                              onLongTap={() => {
                                                  setConfirmationItem(preset);
                                                  confirmationDialogRef.current?.focus();
                                              }}/>
                            ))}
                        </Grid>
                    </ButtonGroup>
                </Box>

                <Box sx={{m: 4}}>
                    <ButtonGroup color="error" variant="outlined">
                        <Grid container rowSpacing={1} columnSpacing={{xs: 1, sm: 2, md: 3}}>
                            {subtractions.map((preset, i) => (
                                <PresetButton key={`subtractions-${i}`} currentPlayer={currentPlayer} preset={preset}
                                              onLongTap={() => {
                                                  setConfirmationItem(preset);
                                                  confirmationDialogRef.current?.focus();
                                              }}/>
                            ))}
                        </Grid>
                    </ButtonGroup>
                </Box>
            </Box>

            {
                confirmationItem &&
                <PresetConfirmationDialog ref={confirmationDialogRef} item={confirmationItem} onConfirm={(item) => {
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
                }}/>
            }
        </>
    )
}