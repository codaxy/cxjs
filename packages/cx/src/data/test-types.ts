import { AccessorChain } from "./createAccessorModelProxy";

// Test what AccessorChain<string[]> looks like
type Test1 = AccessorChain<string[]>;
type Test2 = AccessorChain<string[]>["length"];

// The issue: does AccessorChain properly map array properties?
