# Debugging Examples

## Example 1: Binding Not Updating

**Issue:**
Store value changes but UI doesn't update

**Prompt:**
```
/cxjs My TextField value isn't updating when I change the store. Here's the code:
<TextField value:bind="user.name" />
```

**Expected Analysis:**
- Check accessor chain correctness
- Verify store initialization
- Check for controller interference
- Suggest using CxJS Inspector
- Provide debugging steps

## Example 2: Controller Not Computing

**Issue:**
Computed value not recalculating

**Prompt:**
```
/cxjs This computed value isn't updating when dependencies change:
this.store.init("fullName", this.computable("user", user => `${user.first} ${user.last}`));
```

**Expected Analysis:**
- Check dependency paths
- Verify controller lifecycle
- Look for circular dependencies
- Suggest proper trigger setup
- Provide corrected code

## Example 3: Performance Issues

**Issue:**
Grid rendering slowly with many records

**Prompt:**
```
/cxjs My Grid with 1000+ records is very slow. How can I optimize it?
```

**Expected Analysis:**
- Suggest virtualization
- Check for unnecessary re-renders
- Review column configuration
- Suggest pagination
- Provide optimization examples

## Example 4: Type Errors

**Issue:**
TypeScript errors in widget configuration

**Prompt:**
```
/cxjs Getting TypeScript error: Type 'string' is not assignable to type 'Bind<string>'
```

**Expected Analysis:**
- Explain CxJS type system
- Show correct binding syntax
- Provide type definitions
- Suggest proper prop usage
- Give corrected example
