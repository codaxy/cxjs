import { createFunctionalComponent, expr } from "cx/ui";
import { Icon, Repeater } from "cx/widgets";
import { m } from "./model";

export const Sidebar = createFunctionalComponent(() => (
  <div class="w-52 border-x border-border py-4 overflow-y-auto bg-sidebar">
    <Repeater records={m.categories} recordAlias={m.$category}>
      <div
        class={{
          "px-4 py-2.5 cursor-pointer flex items-center gap-2.5 text-sm transition-colors": true,
          "hover:bg-secondary": true,
          "bg-accent text-accent-foreground": expr(m.$category.id, m.activeCategory, (id, active) => id === active),
          "text-sidebar-foreground": expr(m.$category.id, m.activeCategory, (id, active) => id !== active),
        }}
        onClick={(e: any, { store }: any) => {
          store.set(m.activeCategory, store.get(m.$category.id));
        }}
      >
        <Icon name={m.$category.icon} />
        <span text={m.$category.name} />
      </div>
    </Repeater>
  </div>
));
