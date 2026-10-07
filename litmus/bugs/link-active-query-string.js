import { computable, Controller } from "cx/ui";
import { Button, Link } from "cx/widgets";

// match="subroute" must treat `?` as a boundary like `/` — a page carrying
// query state (~/items?filter=x) is still on the href's route, the same way
// Route matching tolerates the query. `equal` and `prefix` are untouched:
// equal stays full-string equality (which is what query-routed navs rely on).
//
// This page renders every scenario twice: through LegacyLink (the verbatim
// pre-fix isActive) and through the patched Link, so the two behaviors can be
// compared side by side.

class LegacyLink extends Link {
  isActive(data) {
    if (data.active != null) return data.active;

    switch (this.match) {
      default:
      case "equal":
        return data.url === data.unresolvedHref;

      case "prefix":
        return data.url && data.unresolvedHref && data.url.indexOf(data.unresolvedHref) === 0;

      case "subroute":
        return (
          data.url &&
          data.unresolvedHref &&
          data.url.indexOf(data.unresolvedHref) === 0 &&
          (data.url === data.unresolvedHref || data.url[data.unresolvedHref.length] === "/")
        );
    }
  }
}

class PageController extends Controller {
  init() {
    super.init();
    this.store.init("$page.url", "~/items?filter=x");
  }
}

// Urls where the old and the fixed matcher agree on every link below.
const sameUrls = ["~/items", "~/items/42", "~/items/42?tab=log", "~/items-archive", "~/items-archive?filter=x", "~/docs", "~/other"];

// Urls where the two columns diverge (subroute + query on the href itself).
const divergentUrls = ["~/items?filter=x", "~/docs?topic=a", "~/docs?topic=b"];

const links = [
  { href: "~/items", match: "equal" },
  { href: "~/items", match: "prefix" },
  { href: "~/items", match: "subroute" },
  { href: "~/docs?topic=a", match: "equal" },
  { href: "~/docs?topic=b", match: "equal" },
  { href: "~/docs", match: "equal" },
  { href: "~/docs", match: "subroute" },
];

const activeStyle = "background:#2563eb;color:#fff;border-radius:4px";
const linkStyle = "padding: 2px 8px; display: inline-block";
const cell = "padding: 4px 16px 4px 0; font-family: monospace";

const demoLink = (LinkType, href, match) => (
  <cx>
    <LinkType
      href={href}
      url={{ bind: "$page.url" }}
      match={match}
      activeStyle={activeStyle}
      style={linkStyle}
      onClick={(e) => {
        e.preventDefault();
      }}
      text={href}
    />
  </cx>
);

export default (
  <cx>
    <div controller={PageController} style="padding: 20px; display: flex; flex-direction: column; gap: 16px">
      <h3>Link active state vs query strings — current vs fixed</h3>

      <div>
        <b>Current url:</b> <span text={{ bind: "$page.url" }} style="font-family: monospace" />
      </div>

      <div style="display: flex; flex-direction: column; gap: 8px">
        {[
          { label: "Same in both columns:", urls: sameUrls },
          { label: "Behaves differently:", urls: divergentUrls },
        ].map(({ label, urls }) => (
          <cx>
            <div style="display: flex; gap: 8px; flex-wrap: wrap; align-items: center">
              <span text={label} style="width: 160px; font-size: 12px; color: #666" />
              {urls.map((url) => (
                <cx>
                  <Button
                    text={url}
                    pressed={computable("$page.url", (current) => current === url)}
                    onClick={(e, { store }) => {
                      store.set("$page.url", url);
                    }}
                    style={computable("$page.url", (current) =>
                      current === url
                        ? "font-family: monospace; background: #2563eb; border-color: #2563eb; color: #fff"
                        : "font-family: monospace",
                    )}
                  />
                </cx>
              ))}
            </div>
          </cx>
        ))}
      </div>

      <table style="border-collapse: collapse">
        <tbody>
          <tr>
            <th style="text-align: left; padding: 4px 16px 4px 0">href</th>
            <th style="text-align: left; padding: 4px 16px 4px 0">match</th>
            <th style="text-align: left; padding: 4px 16px 4px 0">current cx</th>
            <th style="text-align: left; padding: 4px 16px 4px 0">with fix</th>
          </tr>
          {links.map(({ href, match }) => (
            <cx>
              <tr>
                <td style={cell} text={href} />
                <td style={cell} text={match} />
                <td style={cell}>{demoLink(LegacyLink, href, match)}</td>
                <td style={cell}>{demoLink(Link, href, match)}</td>
              </tr>
            </cx>
          ))}
        </tbody>
      </table>

      <p style="max-width: 72ch">
        Click the url buttons and compare the columns. The only divergence is <code>match="subroute"</code>{" "}
        when the url carries a query on the href itself (try <code>~/items?filter=x</code>): the current matcher{" "}
        rejects it because the boundary character is <code>?</code>, not <code>/</code> — while a subroute with a{" "}
        query (<code>~/items/42?tab=log</code>) already works, which is why the bug is easy to miss.{" "}
        <code>equal</code> is untouched (full-string equality), so query-routed navs behave identically in both{" "}
        columns: each <code>~/docs?topic=…</code> link activates only on its own topic. Use a bare{" "}
        <code>~/docs</code> <i>subroute</i> link when a parent item should light up on any topic.
      </p>
    </div>
  </cx>
);
