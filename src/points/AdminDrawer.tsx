import {Box, Divider, Drawer, type DrawerProps, List, ListItem, ListItemButton, ListItemText} from "@mui/material";
import {usePoints} from "./usePoints";
import {enqueueSnackbar} from "notistack";
import {compressText} from "./utils.ts";

export const drawerWidth = 240;

export const AdminDrawer = ({open, onClose, variant}: {
    open: boolean,
    variant: DrawerProps['variant'],
    onClose: DrawerProps['onClose']
}) => {
    const {state, dispatch} = usePoints()

    return (
        <Box
            component="nav"
            sx={{width: {sm: drawerWidth}, flexShrink: {sm: 0}}}
            aria-label="app drawer"
        >
            <Drawer open={open} onClose={onClose} variant={variant}
                    sx={{
                        '& .MuiDrawer-paper': {
                            width: drawerWidth,
                            boxSizing: 'border-box',
                        },
                    }}>
                <Box sx={{width: {sm: drawerWidth}, pt: 8}}>
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
                </Box>
            </Drawer>
        </Box>
    );
}