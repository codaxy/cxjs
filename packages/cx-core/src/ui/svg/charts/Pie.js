import {PieChart, PieSlice} from './PieChart';

import {Debug} from '../../../util/Debug';

Debug.log('The Pie class is deprecated. Please use PieChart instead.')

export const Pie = PieChart;
Pie.Slice = PieSlice;
