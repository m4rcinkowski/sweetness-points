import {useCallback, useEffect, useMemo, useReducer} from "react";
import {defaultState, pointsReducer, STORAGE_KEY} from "./reducer.ts";
import {PointsContext} from "./PointsContext";

export const PointsProvider = ({children}: { children: React.ReactNode }) => {
    const [state, dispatch] = useReducer(pointsReducer, undefined, defaultState);

    const persist = useCallback(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        } catch (error) {
            console.error("Error saving to localStorage:", error);
        }
    }, [state]);

    useEffect(() => {
        persist();
    }, [state, persist]);

    const value = useMemo(() => ({state, dispatch, persist}), [state, persist]);

    return <PointsContext.Provider value={value}>{children}</PointsContext.Provider>;
};