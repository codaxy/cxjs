import { enableTooltips, FlyweightTooltipTracker } from "cx/widgets";

enableTooltips();

// @index
export default () => (
  <div className="flex flex-col items-start gap-4">
    <div
      className="ellipsis overflow-hidden text-ellipsis whitespace-nowrap"
      style={{ width: "150px" }}
    >
      This is a long text that doesn't fit its designated space.
    </div>

    <a href="https://cxjs.io" target="_blank">
      Link to CxJS website
    </a>

    <FlyweightTooltipTracker
      onGetTooltip={(el) => {
        // Show full text for truncated elements
        if (
          el instanceof HTMLElement &&
          el.classList.contains("ellipsis") &&
          el.scrollWidth > el.clientWidth
        ) {
          return {
            title: "Full text",
            text: el.innerText,
          };
        }

        // Show URL for links
        if (el.tagName === "A" && el.getAttribute("href")?.startsWith("http")) {
          return {
            text: el.getAttribute("href")!,
            placement: "up",
          };
        }
      }}
    />
  </div>
);
// @index-end
