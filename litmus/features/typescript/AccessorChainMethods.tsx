import { append, createAccessorModelProxy, Store } from "cx/data";

interface Model {
   p: P;
}

interface P {
   s: string;
   n: number;
   b: boolean;
   s2?: string;
   arr?: number[];
}

const m = createAccessorModelProxy<Model>();

const store = new Store();

// Init store
store.init(m.p, {
   s: "name",
   n: 123,
   b: true,
});

console.log(store.getData());

// set store via record syntax
store.set({
   "p.s": "set via record",
});

console.log("Changed only s prop within p:", store.getData());

store.set({
   p: {
      n: 456,
   },
});
console.log("Replaced whole object p:", store.getData());

// get store value via multiple accessors
const vals1 = store.get(m.p.s, m.p.n);
console.log("Get multiple vals via separate AC args:", vals1);

// get store value via an array of accessors
const vals2 = store.get([m.p.s, m.p.n]);
console.log("Get multiple vals via AC array:", vals2);

// set value via an accessor chain
store.set(m.p.s2, "lastname");
console.log(store.get(m.p));

// delete value via multple accessor chains
store.delete(m.p.n, m.p.s2);
console.log(store.get(m.p));

// delete value via an array of accessor chains
store.delete([m.p.b, m.p.s]);
console.log(store.get(m.p));

// unfortunately, this is still possible, even though arr2 doesn't exist on the Model
store.update(m.p, (p) => ({
   ...p,
   s: "updated",
   arr: [1, 2, 3],
   arr2: [1, 2, 3],
}));

console.log("Updated p: ", store.get(m.p));

// infer udpate fn arg type from accessor chain type
// not possible
// store.update(m.p.arr, append, "a");
// correct
store.update(m.p.arr, append, 4);
console.log("Updated p.arr: ", store.get(m.p.arr));

// update via update function directly
store.update(m.p.arr, (arr) => append(arr, 5));
console.log("Updated p.arr: ", store.get(m.p.arr));

export default () => <cx></cx>;
