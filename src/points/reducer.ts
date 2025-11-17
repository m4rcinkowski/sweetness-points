export const PLAYERS = ['Kuba', 'Wojtek', 'Tomek'];

export type Player = typeof PLAYERS[number];

export type PointsType = 'ADD' | 'SUBTRACT';

export type PointsAction = {
    type: PointsType;
    payload: {
        player: Player;
        points: number;
        comment: string;
    }
} | {
    type: 'RESET';
} | {
    type: 'SET_STATE';
    payload: PointsState;
}


export type PointsState = {
    totals: Record<Player, number>;
    journal: JournalItem[];
}
export type JournalItem = {
    player: Player;
    actionType: 'ADD' | 'SUBTRACT';
    points: number;
    added?: number;
    comment: string;
}
export const STORAGE_KEY = 'POINTS_JOURNAL';

export const defaultState = () => {
    const defaultState = {
        totals: {
            [PLAYERS[0]]: 0,
            [PLAYERS[1]]: 0,
            [PLAYERS[2]]: 0,
        },
        journal: [],
    };

    try {
        const stateString = localStorage.getItem(STORAGE_KEY);
        if (!stateString) return defaultState;

        return JSON.parse(stateString) as PointsState;
    } catch (e) {
        console.error("Can't load the state", e)
        return defaultState
    }
}

export const pointsReducer = (state: PointsState, action: PointsAction): PointsState => {
    switch (action.type) {
        case "ADD":
            return {
                ...state,
                totals: {
                    ...state.totals,
                    [action.payload.player]: (state.totals[action.payload.player] ?? 0) + action.payload.points
                },
                journal: [
                    ...state.journal,
                    {
                        actionType: action.type,
                        player: action.payload.player,
                        points: action.payload.points,
                        comment: action.payload.comment,
                        added: +Date.now(),
                    }
                ]
            };
        case "SUBTRACT":
            return {
                ...state,
                totals: {
                    ...state.totals,
                    [action.payload.player]: (state.totals[action.payload.player] ?? 0) - action.payload.points
                },
                journal: [
                    ...state.journal,
                    {
                        actionType: action.type,
                        player: action.payload.player,
                        points: action.payload.points,
                        comment: action.payload.comment,
                        added: +Date.now(),
                    }
                ]
            };
        case "RESET":
            return {
                totals: {},
                journal: []
            };
        case "SET_STATE":
            return action.payload;
        default:
            return state;
    }
}