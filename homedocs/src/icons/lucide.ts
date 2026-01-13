import { Icon } from "cx/widgets";
import { VDOM } from "cx/ui";
import { Search, Plus, Pencil, RefreshCw, X, Folder } from "lucide";

type IconNode = [tag: string, attrs: Record<string, string | number>][];

// Convert Lucide IconNode to React element
function renderLucideIcon(iconNode: IconNode) {
  return (props: Record<string, any>) => {
    const { key, className, style, ...rest } = props;

    const children = iconNode.map(([tag, attrs], i) =>
      VDOM.createElement(tag, { key: i, ...attrs }),
    );

    return VDOM.createElement(
      "svg",
      {
        key,
        xmlns: "http://www.w3.org/2000/svg",
        width: 24,
        height: 24,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: 2,
        strokeLinecap: "round",
        strokeLinejoin: "round",
        className,
        style,
        ...rest,
      },
      ...children,
    );
  };
}

// Register individual Lucide icons
Icon.register("search", renderLucideIcon(Search));
Icon.register("plus", renderLucideIcon(Plus));
Icon.register("pencil", renderLucideIcon(Pencil));
Icon.register("refresh-cw", renderLucideIcon(RefreshCw));
Icon.register("x", renderLucideIcon(X));
Icon.register("folder", renderLucideIcon(Folder));
