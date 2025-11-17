import {useMemo, useReducer} from "react";
import {defaultState, pointsReducer} from "./reducer.ts";
import {PointsContext} from "./PointsContext";

export const PointsProvider = ({children}: {children: React.ReactNode}) => {
    const [state, dispatch] = useReducer(pointsReducer, undefined, defaultState);
    const value = useMemo(() => ({state, dispatch}), [state]);

    return <PointsContext.Provider value={value}>{children}</PointsContext.Provider>;
};