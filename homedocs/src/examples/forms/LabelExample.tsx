import { Label } from "cx/widgets";

// @index
export default (
  <div className="flex flex-col items-start gap-2">
    <Label>Standard Label</Label>
    <Label asterisk required>
      Required Field
    </Label>
  </div>
);
// @index-end
