/** @jsxImportSource react */

import { VDOM } from "cx/ui";
import { Icon } from "cx/widgets";
import type { IconNode } from "lucide";
import {
  Activity,
  BarChart3,
  Bell,
  ChevronDown,
  ChevronsRight,
  Bug,
  Calculator,
  Calendar,
  Check,
  Circle,
  Copy,
  Download,
  Eye,
  EyeOff,
  File,
  FileCode,
  FileJson,
  FileText,
  Folder,
  FolderOpen,
  GripVertical,
  Info,
  ListTodo,
  LoaderCircle,
  Menu,
  MessageCircle,
  Move,
  Palette,
  PanelTop,
  Pencil,
  PieChart,
  Plus,
  RefreshCw,
  Search,
  Space,
  Square,
  Star,
  Table2,
  TextCursorInput,
  ToggleLeft,
  TrendingDown,
  Trash2,
  Type,
  Upload,
  X,
  Zap,
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
Icon.register("star", getRenderer(Star));
Icon.register("file", getRenderer(File));
Icon.register("file-code", getRenderer(FileCode));
Icon.register("file-json", getRenderer(FileJson));
Icon.register("file-text", getRenderer(FileText));
Icon.register("trash", getRenderer(Trash2));
Icon.register("folder-open", getRenderer(FolderOpen));
Icon.register("loading", getRenderer(LoaderCircle));
Icon.register("trending-down", getRenderer(TrendingDown));
Icon.register("bar-chart", getRenderer(BarChart3));
Icon.register("pie-chart", getRenderer(PieChart));
Icon.register("list-todo", getRenderer(ListTodo));
Icon.register("zap", getRenderer(Zap));
Icon.register("activity", getRenderer(Activity));
Icon.register("grip-vertical", getRenderer(GripVertical));
Icon.register("palette", getRenderer(Palette));
Icon.register("circle", getRenderer(Circle));
Icon.register("info", getRenderer(Info));
//Icon.register("square", getRenderer(Square)); // it needs to be filled
Icon.register("type", getRenderer(Type));
Icon.register("panel-top", getRenderer(PanelTop));
Icon.register("table", getRenderer(Table2));
Icon.register("move", getRenderer(Move));
Icon.register("copy", getRenderer(Copy));
Icon.register("download", getRenderer(Download));
Icon.register("refresh", getRenderer(RefreshCw));
Icon.register("text-cursor-input", getRenderer(TextCursorInput));
Icon.register("toggle-left", getRenderer(ToggleLeft));
Icon.register("forward", getRenderer(ChevronsRight));
Icon.register("drop-down", getRenderer(ChevronDown));
Icon.register("bell", getRenderer(Bell));
Icon.register("menu", getRenderer(Menu));
Icon.register("message-circle", getRenderer(MessageCircle));
