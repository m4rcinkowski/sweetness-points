import {AppBar, Container, CssBaseline, IconButton, Toolbar} from "@mui/material";
import {Menu as MenuIcon} from "@mui/icons-material";
import {Points} from "./points/Points.tsx";
import {PointsProvider} from "./points/PointsProvider.tsx";
import {AdminDrawer} from "./points/AdminDrawer.tsx";
import {useState} from "react";
import {SnackbarProvider} from "notistack";

function App() {
    const [drawerOpen, setDrawerOpen] = useState(false);

    return (
        <PointsProvider>
            <CssBaseline/>
            <AppBar position="static">
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
            <AdminDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)}/>

            <Container maxWidth={false} disableGutters
                       sx={{height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <Points/>
            </Container>

            <SnackbarProvider/>
        </PointsProvider>
    )
}

export default App
