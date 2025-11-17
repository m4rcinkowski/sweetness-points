import {Divider, Drawer, type DrawerProps, List, ListItem, ListItemButton, ListItemText} from "@mui/material";
import {usePoints} from "./usePoints";
import {enqueueSnackbar} from "notistack";
import {compressText} from "./utils.ts";

export const AdminDrawer = ({open, onClose}: { open: boolean, onClose: DrawerProps['onClose'] }) => {
    const {state, dispatch} = usePoints()

    return (
        <Drawer open={open} onClose={onClose}>
            <List>
                <ListItem>
                    <ListItemButton color="error" onClick={async () => {
                        const link = new URL(location.href);
                        const exportedValue = JSON.stringify(state);
                        const compressedValue = await compressText(exportedValue);
                        const base64 = compressedValue.toBase64({alphabet: 'base64url'});

                        link.searchParams.set('import', base64);
                        await navigator.clipboard.writeText(link.href);
                        enqueueSnackbar('Link skopiowany do schowka.')
                    }}>
                        <ListItemText primary={"Udostępnij punkty"}/>
                    </ListItemButton>
                </ListItem>

                <Divider/>

                <ListItem>
                    <ListItemButton color="error" onClick={() => {
                        dispatch({type: 'RESET'});
                        onClose?.({}, 'escapeKeyDown');
                    }}>
                        <ListItemText primary={"Resetuj"} slotProps={{primary: {color: "error"}}}/>
                    </ListItemButton>
                </ListItem>
            </List>

        </Drawer>
    );
}