import { createAccessorModelProxy } from "cx/data";
import { Button, Dropdown } from "cx/widgets";

// @model
interface PageModel {
  showDropdown: boolean;
}

const m = createAccessorModelProxy<PageModel>();
// @model-end

// @index
export default () => (
  <div className="p-5 border-2 border-dashed border-gray-300 rounded relative">
    <span className="absolute top-1 right-2 text-xs text-gray-400">Parent Container</span>
    <Button
      onClick={(e, { store }) => {
        store.toggle(m.showDropdown);
      }}
    >
      Toggle Parent Dropdown
    </Button>
    <Dropdown
      visible={m.showDropdown}
      arrow
      offset={10}
      placement="down"
      onResolveRelatedElement={(el) => el.parentElement}
      style="padding: 20px; max-width: 300px"
    >
      Dropdown positioned relative to the parent container.
    </Dropdown>
  </div>
);
// @index-end
