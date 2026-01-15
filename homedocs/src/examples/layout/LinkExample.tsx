import { Link } from "cx/widgets";

// @index
export default () => (
  <div className="flex flex-col items-start gap-2">
    <Link href="~/docs/intro/what-is-cxjs">What is CxJS</Link>
    <Link href="~/docs/layout/link-button">See LinkButton</Link>
    <Link href="~/docs/forms/text-field" disabled>
      Disabled Link
    </Link>
  </div>
);
// @index-end
