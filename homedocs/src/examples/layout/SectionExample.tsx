import { Button, FlexRow, Heading, Section } from "cx/widgets";
import "../../icons/lucide";

// @index
export default (
  <div className="flex flex-col gap-4">
    <Section mod="card" title="Simple Section">
      This is a simple section with a title and some content.
    </Section>

    <Section mod="card" title="Section with Footer">
      This section has a footer with action buttons.
      <FlexRow putInto="footer" spacing>
        <Button mod="hollow" icon="calendar" />
        <Button mod="hollow" icon="calculator" />
        <Button mod="hollow" icon="search" />
      </FlexRow>
    </Section>

    <Section mod="card">
      <FlexRow align="center" putInto="header">
        <Heading level={4} className="text-blue-400">
          Custom Header
        </Heading>
        <Button mod="hollow" icon="x" style="margin-left: auto" />
      </FlexRow>
      This section has a custom header with a close button.
    </Section>
  </div>
);
// @index-end
