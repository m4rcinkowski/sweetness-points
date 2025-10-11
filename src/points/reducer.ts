export const PLAYERS = ['Kuba', 'Wojtek', 'Tomek'];

export type Player = typeof PLAYERS[number];

export type PointsAction = {
    type: 'ADD' | 'SUBTRACT';
    payload: {
        player: Player;
        points: number;
        actionType: 'ADD' | 'SUBTRACT';
        comment: string;
    }
} | {
    type: 'RESET';
} | {
    type: 'MODE';
    payload: {
        mode: 'basic' | 'presets';
    }
}


export type PointsState = {
    totals: Record<Player, number>;
    journal: JournalItem[];
    mode?: 'basic' | 'presets';
}
export type JournalItem = {
    player: Player;
    actionType: 'ADD' | 'SUBTRACT';
    points: number;
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
        mode: 'basic' as const,
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

export const pointsReducer = (state: PointsState, action: PointsAction) => {
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
                        player: action.payload.player,
                        points: action.payload.points,
                        actionType: action.payload.actionType,
                        comment: action.payload.comment
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
                        player: action.payload.player,
                        points: action.payload.points,
                        actionType: action.payload.actionType,
                        comment: action.payload.comment
                    }
                ]
            };
        case "MODE":
            return {
                ...state,
                mode: action.payload.mode,
            };
        case "RESET":
            return {
                totals: {},
                journal: []
            };
        default:
            return state;
    }
}