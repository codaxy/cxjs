import {Sorter} from '../core';

export function getComparer(sorters: Sorter[], dataAccessor?: (any) => any) : (a: any, b: any) => number;

export function indexSorter(sorters: Sorter[], dataAccessor?: (any) => any) : (data: any[]) => number[];

export function sorter(sorters: Sorter[], dataAccessor?: (any) => any) : (data: any[]) => any[];
