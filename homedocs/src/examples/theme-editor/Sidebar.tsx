import { createFunctionalComponent, expr } from "cx/ui";
import { Icon } from "cx/widgets";
import { m } from "./model";
import { categoryGroups } from "./data";

export const Sidebar = createFunctionalComponent(() => (
  <div class="w-52 border-x border-border overflow-y-auto bg-sidebar">
    {categoryGroups.map((group) => (
      <div key={group.name}>
        <div class="px-4 pt-4 pb-2 mt-2 first:mt-0 text-xs font-semibold text-foreground uppercase tracking-wide">
          {group.name}
        </div>
        {group.categories.map((cat) => (
          <div
            key={cat.id}
            class={{
              "px-4 py-2.5 cursor-pointer flex items-center gap-2.5 text-sm transition-colors": true,
              "hover:bg-secondary": true,
              "bg-accent text-accent-foreground": expr(
                m.activeCategory,
                (active) => cat.id === active,
              ),
              "text-sidebar-foreground": expr(
                m.activeCategory,
                (active) => cat.id !== active,
              ),
            }}
            onClick={(e: any, { store }: any) => {
              store.set(m.activeCategory, cat.id);
            }}
          >
            <Icon name={cat.icon} />
            <span>{cat.name}</span>
          </div>
        ))}
      </div>
    ))}
  </div>
));
