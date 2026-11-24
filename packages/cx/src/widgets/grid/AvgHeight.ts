// Average row heights per kind of row (data rows, and the group header and footer rows of each level), used by
// buffered grids to estimate the height of rows that are not rendered.
export class AvgHeight {
   declare groups: Record<string, { sum: number; count: number }>;

   constructor() {
      this.groups = {};
   }

   add(group: string, height: number) {
      let g = this.groups[group];
      if (!g) g = this.groups[group] = { sum: 0, count: 0 };
      g.sum += height;
      g.count++;
   }

   estimate(group: string): number | null {
      let g = this.groups[group];
      if (!g || g.count == 0) return null;
      return Math.round(g.sum / g.count);
   }
}
