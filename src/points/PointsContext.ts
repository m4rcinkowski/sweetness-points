import {createContext, type Dispatch} from "react";
import {type PointsState, type PointsAction} from "./reducer";

export const PointsContext = createContext<{
    state: PointsState;
    dispatch: Dispatch<PointsAction>;
    persist: () => void;
}>({
    state: {} as PointsState,
    dispatch: () => {},
    persist: () => {},
});
