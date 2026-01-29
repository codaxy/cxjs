import { Button } from "cx/widgets";
import "../../icons/lucide";

// @index
export default (
  <div className="flex flex-wrap gap-2 items-center">
    <Button icon="search">Search</Button>
    <Button icon="plus" mod="primary">Add</Button>
    <Button icon="pencil" mod="hollow" />
    <Button icon="refresh-cw" mod="hollow" />
    <Button icon="x" mod="hollow" />
  </div>
);
// @index-end
