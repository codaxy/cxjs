// Test multiple spreads in one element
let props1 = { a: 1 };
let props2 = { b: 2 };
let component = (
  <cx>
    <div {...props1} className="test" {...props2} id="myDiv" />
  </cx>
);
