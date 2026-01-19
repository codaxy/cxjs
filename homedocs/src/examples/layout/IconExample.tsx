import { Icon } from "cx/widgets";
import "../../icons/lucide";

// @index
export default () => (
  <div className="flex items-center gap-4">
    <Icon name="calendar" />
    <Icon name="calculator" className="text-blue-500" />
    <Icon name="bug" className="bg-yellow-200" />
    <Icon name="pencil" />
  </div>
);
// @index-end
