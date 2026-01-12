/** @jsxImportSource cx */
import { LinkButton } from "cx/widgets";

export default () => (
  <cx>
    <div style="display: flex; gap: 8px; flex-wrap: wrap;">
      <LinkButton href="/">Home</LinkButton>
      <LinkButton mod="primary" href="/docs/intro/welcome">
        Getting Started
      </LinkButton>
      <LinkButton mod="danger" href="/docs/widgets/buttons">
        See Buttons
      </LinkButton>
      <LinkButton mod="hollow" href="/docs/charts/charts">
        View Charts
      </LinkButton>
      <LinkButton disabled href="/">
        Disabled
      </LinkButton>
    </div>
  </cx>
);
