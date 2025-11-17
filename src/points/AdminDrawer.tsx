import {Divider, Drawer, type DrawerProps, List, ListItem, ListItemButton, ListItemText} from "@mui/material";
import {usePoints} from "./usePoints";
import {enqueueSnackbar} from "notistack";

export const AdminDrawer = ({open, onClose}: { open: boolean, onClose: DrawerProps['onClose'] }) => {
    const {state, dispatch} = usePoints()

    return (
        <Drawer open={open} onClose={onClose}>
            <List>
                <ListItem>
                    <ListItemButton color="error" onClick={() => {
                        const link = new URL(location.href);
                        link.searchParams.set('reset', JSON.stringify(state));
                        navigator.clipboard.writeText(link.href).then(() => {
                            enqueueSnackbar('Link skopiowany do schowka.')
                        })
                    }}>
                        <ListItemText primary={"Udostępnij"}/>
                    </ListItemButton>
                </ListItem>

                <Divider/>

                <ListItem>
                    <ListItemButton color="error" onClick={() => {
                        dispatch({type: 'RESET'});
                    }}>
                        <ListItemText primary={"Resetuj"} slotProps={{primary: {color: "error"}}}/>
                    </ListItemButton>
                </ListItem>
            </List>

        </Drawer>
    )
        ;
}