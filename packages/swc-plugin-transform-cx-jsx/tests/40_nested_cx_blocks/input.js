// Test nested cx blocks
let component = (
  <cx>
    <div className="outer">
      {condition && (
        <cx>
          <span className="inner">Nested content</span>
        </cx>
      )}
    </div>
  </cx>
);
