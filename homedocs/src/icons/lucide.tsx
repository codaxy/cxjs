/** @jsxImportSource react */

import { VDOM } from "cx/ui";
import { Icon } from "cx/widgets";
import type { IconNode } from "lucide";
import {
  Bug,
  Calculator,
  Calendar,
  Check,
  Eye,
  EyeOff,
  Folder,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Upload,
  X,
} from "lucide";

// Convert Lucide IconNode to React element
function getRenderer(iconNode: IconNode) {
  return ({ key, ...rest }: Record<string, any>) => (
    <svg
      key={key}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...rest}
    >
      {iconNode.map(([tag, attrs], i) =>
        VDOM.createElement(tag, { key: i, ...attrs }),
      )}
    </svg>
  );
}

// Register individual Lucide icons
Icon.register("search", getRenderer(Search));
Icon.register("plus", getRenderer(Plus));
Icon.register("pencil", getRenderer(Pencil));
Icon.register("refresh-cw", getRenderer(RefreshCw));
Icon.register("x", getRenderer(X));
Icon.register("folder", getRenderer(Folder));
Icon.register("calendar", getRenderer(Calendar));
Icon.register("calculator", getRenderer(Calculator));
Icon.register("check", getRenderer(Check));
Icon.register("bug", getRenderer(Bug));
Icon.register("eye", getRenderer(Eye));
Icon.register("eye-off", getRenderer(EyeOff));
Icon.register("upload", getRenderer(Upload));
