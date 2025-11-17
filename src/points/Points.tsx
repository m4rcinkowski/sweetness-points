import {useState} from "react";
import {PLAYERS} from "./reducer.ts";
import {
    Box,
    Button,
    ButtonGroup,
    Collapse,
    Container,
    FormControlLabel,
    Grid,
    List,
    ListItem,
    Rating,
    Switch
} from "@mui/material";
import {PresetsForm} from "./PresetsForm.tsx";
import {formatRelative} from "./utils.ts";
import {usePoints} from "./usePoints";

export const Points = () => {
    const {state, dispatch} = usePoints()
    const [currentPlayer, setCurrentPlayer] = useState<typeof PLAYERS[number] | undefined>();
    const [showJournal, setShowJournal] = useState(false);

    return <Container sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
        <Container sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
            <ButtonGroup size="large" variant="contained">
                {PLAYERS.map(player => (
                    <Button key={player}
                            color={currentPlayer === player ? 'primary' : 'inherit'}
                            onClick={() => setCurrentPlayer(currentPlayer === player ? undefined : player)}>{player}: {state.totals?.[player] ?? 0}</Button>
                ))}
            </ButtonGroup>

            {currentPlayer && (<>

                <PresetsForm player={currentPlayer} dispatch={dispatch}/>

                <Box gap={2}>
                    <FormControlLabel
                        control={<Switch checked={showJournal} onChange={() => setShowJournal(!showJournal)}/>}
                        label="Historia"
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


                                            <Grid size={6}>
                                                <Rating name="read-only" value={item.points} readOnly
                                                        max={item.points > 5 ? item.points : 5}/>{item.points > 5 ? ' ' + item.points : ''}
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


    </Container>
};