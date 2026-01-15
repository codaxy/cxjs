import { LinkButton } from "cx/widgets";

// @index
export default () => (
  <div className="flex flex-wrap items-start gap-2">
    <LinkButton mod="primary" href="~/docs/intro/installation">
      Installation
    </LinkButton>
    <LinkButton mod="danger" href="~/docs/intro/breaking-changes">
      Breaking Changes
    </LinkButton>
    <LinkButton mod="hollow" href="~/docs/forms/text-field">
      TextField
    </LinkButton>
    <LinkButton disabled href="~/docs/intro/what-is-cxjs">
      Disabled
    </LinkButton>
  </div>
);
// @index-end
