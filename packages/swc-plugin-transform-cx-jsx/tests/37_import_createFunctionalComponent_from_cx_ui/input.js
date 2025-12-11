// Test that createFunctionalComponent is imported from cx/ui (not cx/src/ui/createFunctionalComponent.js)
let MyComponent = (props) => (
  <cx>
    <div text={props.text} />
  </cx>
);

let AnotherComponent = (props) => (
  <cx>
    <span text={props.name} />
  </cx>
);
