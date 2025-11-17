import * as React from "react";
import {useState} from "react";
import type {PresetItem} from "./PresetsForm";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField} from "@mui/material";

type Props = { item: PresetItem, onConfirm: (confirmedItem: PresetItem) => void, onCancel: () => void }

export const PresetConfirmationDialog: React.FC<Props> = ({item, onConfirm, onCancel}) => {
    const [label, setLabel] = useState(item.label);
    const [points, setPoints] = useState(item.points);

    return (
        <Dialog open>
            <DialogTitle>Potwierdź</DialogTitle>
            <DialogContent sx={{
                '&&&': {pt: 1},
                flexDirection: 'column',
                display: 'flex',
                gap: 2,
            }}>
                <TextField
                    label="Label"
                    value={label}
                    onChange={(e) => setLabel(e.target.value)}
                />
                <TextField
                    label="Points"
                    value={points}
                    onChange={(e) => setPoints(Number(e.target.value))}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={() => {
                    onCancel()
                }}>Anuluj</Button>
                <Button onClick={() => {
                    onConfirm({
                        ...item,
                        label,
                        points,
                    })
                }}>Potwierdź</Button>
            </DialogActions>
        </Dialog>
    )
}