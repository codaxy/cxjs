// @index
export default () => (
  <div style="position: relative; width: 240px; height: 240px; margin: 20px auto">
    {Array.from({ length: 16 }, (_, i) => {
      const angle = (i / 16) * 2 * Math.PI - Math.PI / 2;
      const radius = 100;
      const x = 120 + radius * Math.cos(angle) - 20;
      const y = 120 + radius * Math.sin(angle) - 20;
      return (
        <div
          style={`position: absolute; left: ${x}px; top: ${y}px; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; color: white; text-shadow: 0 0 2px rgba(0,0,0,0.5)`}
          class={`cxs-color-${i}`}
          text={i}
        />
      );
    })}
  </div>
);
// @index-end
