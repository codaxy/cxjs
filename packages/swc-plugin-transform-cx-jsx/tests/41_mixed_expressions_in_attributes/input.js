// Test mixed expressions in attributes
let active = true;
let component = (
  <cx>
    <div
      className={`base ${active ? 'active' : 'inactive'}`}
      style={{ color: 'red', fontSize: 14 }}
      onClick={e => handleClick(e)}
      data-count={items.length}
    />
  </cx>
);
