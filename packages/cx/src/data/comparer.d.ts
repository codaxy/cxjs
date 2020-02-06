import {Sorter} from '../core';

export function getComparer(sorters: Sorter[], dataAccessor?: (any) => any, compare?: (a: any, b: any) => number) : (a: any, b: any) => number;

export function indexSorter(sorters: Sorter[], dataAccessor?: (any) => any, compare?: (a: any, b: any) => number) : (data: any[]) => number[];

export function sorter(sorters: Sorter[], dataAccessor?: (any) => any, compare?: (a: any, b: any) => number) : (data: any[]) => any[];
