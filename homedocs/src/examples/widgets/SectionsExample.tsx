/** @jsxImportSource cx */
import { Section, Button, FlexRow, Heading } from "cx/widgets";

export default () => (
  <cx>
    <div style="display: flex; flex-direction: column; gap: 16px;">
      <Section mod="card" title="Section with Title">
        This is a section with a simple title. Sections are used to divide
        content into distinct parts.
      </Section>

      <Section mod="card" title="Section with Footer">
        This section has a footer with action buttons.
        <FlexRow putInto="footer" style="gap: 8px;">
          <Button mod="hollow">Cancel</Button>
          <Button mod="primary">Save</Button>
        </FlexRow>
      </Section>

      <Section mod="card">
        <FlexRow align="center" putInto="header">
          <Heading level={4} style="margin: 0;">
            Custom Header
          </Heading>
          <Button mod="hollow" icon="close" style="margin-left: auto;" />
        </FlexRow>
        This section has a custom header with a close button.
      </Section>
    </div>
  </cx>
);
