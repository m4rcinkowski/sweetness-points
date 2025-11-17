import {useState} from "react";
import {PLAYERS} from "./reducer.ts";
import {
    Box,
    Button,
    Collapse,
    Container,
    FormControlLabel,
    Grid,
    List,
    ListItem,
    Rating,
    Switch,
    Typography
} from "@mui/material";
import {PresetsForm} from "./PresetsForm.tsx";
import {formatRelative} from "./utils.ts";
import {usePoints} from "./usePoints";

export const Points = () => {
    const {state, dispatch} = usePoints()
    const [currentPlayer, setCurrentPlayer] = useState<typeof PLAYERS[number] | undefined>();
    const [showJournal, setShowJournal] = useState(false);

    return <Container sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}
                      disableGutters>
        <Grid flexWrap={'wrap'}>
            {PLAYERS.map(player => (
                <Button key={player}
                        size="large" variant="contained"
                        color={currentPlayer === player ? 'primary' : 'inherit'}
                        onClick={() => setCurrentPlayer(currentPlayer === player ? undefined : player)}
                        sx={{flex: '1 auto'}}>{player}: {state.totals?.[player] ?? 0}</Button>
            ))}
        </Grid>

        {currentPlayer && (<>

            <PresetsForm player={currentPlayer} dispatch={dispatch}/>

            <Box gap={2} sx={{width: '100%', display: 'flex', justifyContent: 'center', flexDirection: 'column'}}>
                <FormControlLabel
                    control={<Switch checked={showJournal} onChange={() => setShowJournal(!showJournal)}/>}
                    label="Historia"
                    sx={{justifyContent: 'center'}}
                />
                <Collapse in={showJournal}>
                    <List>
                        {state.journal.filter(({player}) => player === currentPlayer).reverse().map((item, i) => {
                            return (
                                <ListItem key={item.added ?? i}
                                          style={{color: item.actionType === 'ADD' ? 'green' : 'red'}}>

                                    <Grid container sx={{width: '100%'}}>
                                        <Grid container direction="column" size={6}>
                                            <Grid>
                                                {item.comment}
                                            </Grid>

                                            {item.added && (
                                                <Grid>
                                                    {formatRelative(new Date(item.added))}
                                                </Grid>
                                            )}
                                        </Grid>


                                        <Grid size={6} sx={{display: 'flex', alignItems: 'center'}} gap={1}>
                                            <Rating name="read-only" value={Math.min(5, item.points)} readOnly
                                                    max={5}/>
                                            <Typography>{item.points > 5 ? ' ' + item.points : ''}</Typography>
                                        </Grid>
                                    </Grid>
                                </ListItem>
                            );
                        })}
                    </List>
                </Collapse>
            </Box>
        </>)}
    </Container>
};