import { PieChart, PieSlice } from "./PieChart";

import { debug } from "../util/Debug";

debug("The Pie class is deprecated. Please use PieChart instead.");

export const Pie = PieChart as typeof PieChart & { Slice: typeof PieSlice };
Pie.Slice = PieSlice;
