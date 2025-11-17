import {useContext} from "react";
import {PointsContext} from "./PointsContext";

export const usePoints = () => useContext(PointsContext);
