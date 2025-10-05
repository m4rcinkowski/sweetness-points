import type { PointsState } from "./Points";

export const PLAYERS = ['Kuba', 'Wojtek', 'Tomek'];

type PointsAction = {
    type: 'ADD' | 'SUBTRACT';
    payload: {
        player: typeof PLAYERS[number];
        points: number;
        actionType: 'ADD' | 'SUBTRACT';
        comment: string;
    }
} | {
    type: 'RESET';
}


export const pointsReducer = (state: PointsState, action: PointsAction) => {
    switch (action.type) {
        case "ADD":
            return {
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
        case "RESET":
            return {
                totals: {},
                journal: []
            };
        default:
            return state;
    }
}