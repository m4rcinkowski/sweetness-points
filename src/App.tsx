import {AppBar, Box, CssBaseline, IconButton, Toolbar, useMediaQuery, useTheme} from "@mui/material";
import {Menu as MenuIcon} from "@mui/icons-material";
import {Points} from "./points/Points.tsx";
import {PointsProvider} from "./points/PointsProvider.tsx";
import {AdminDrawer, drawerWidth} from "./points/AdminDrawer.tsx";
import {useState} from "react";
import {SnackbarProvider} from "notistack";
import {Import} from "./points/Import.tsx";

function App() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [drawerOpen, setDrawerOpen] = useState(false);
    const importParam = !!(new URLSearchParams(window.location.search).get('import')?.trim().length);

    return (
        <SnackbarProvider>
            <PointsProvider>
                <Box sx={{display: 'flex', height: '100vh', width: '100vw'}}>
                    <CssBaseline/>
                    <AppBar position="fixed" sx={{zIndex: (theme) => theme.zIndex.drawer + 1}}>
                        <Toolbar>
                            <IconButton
                                size="large"
                                edge="start"
                                color="inherit"
                                aria-label="menu"
                                sx={{mr: 2}}
                                onClick={() => setDrawerOpen(!drawerOpen)}
                            >
                                <MenuIcon/>
                            </IconButton>
                        </Toolbar>
                    </AppBar>

                    <AdminDrawer variant={isMobile ? 'temporary' : undefined}
                                 open={drawerOpen} onClose={() => setDrawerOpen(false)}/>

                    <Box component="main"
                         sx={{
                             flexGrow: 1,
                             p: 3,
                             width: {sm: `calc(100% - ${drawerWidth}px)`},
                             mt: '64px', // height of AppBar (Toolbar)
                             overflowY: 'auto',
                             height: `calc(100vh - 64px)`,
                         }}>
                        {importParam ? <Import/> : <Points/>}
                    </Box>
                </Box>
            </PointsProvider>
        </SnackbarProvider>
    )
}

export default App
