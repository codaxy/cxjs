// Test self-closing tags with spread and attributes
let props = { className: "test", id: "myInput" };
let component = (
  <cx>
    <input type="text" {...props} placeholder="Enter text" />
  </cx>
);
