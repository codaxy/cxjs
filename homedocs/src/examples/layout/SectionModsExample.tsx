import { Section } from "cx/widgets";

// @index
export default (
  <div className="grid grid-cols-2 gap-4">
    <Section mod="primary" title="mod=primary">
      Primary style with blue background.
    </Section>

    <Section mod="success" title="mod=success">
      Success style with green background.
    </Section>

    <Section mod="warning" title="mod=warning">
      Warning style with orange background.
    </Section>

    <Section mod="error" title="mod=error">
      Error style with red background.
    </Section>
  </div>
);
// @index-end
