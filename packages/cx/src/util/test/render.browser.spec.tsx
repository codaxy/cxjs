import { describe, it } from "vitest";
import assert from "assert";
import { Store } from "../../data/Store";
import { bind } from "../../ui/bind";
import { createCulture, Culture } from "../../ui/Culture";
import { cleanup, formatHTML, markup, render, settle } from "./render";

function format(innerHTML: string) {
   let el = document.createElement("div");
   el.innerHTML = innerHTML;
   return formatHTML(el);
}

describe("formatHTML", () => {
   it("returns an empty string for an empty node", () => {
      assert.equal(format(""), "");
   });

   it("keeps an element with only text on one line", () => {
      assert.equal(format('<span class="x">Text</span>'), '<span class="x">Text</span>');
   });

   it("puts each element on its own line, indented by depth", () => {
      assert.equal(
         format("<div><header><h2>Title</h2></header><main></main></div><footer></footer>"),
         [
            "<div>",
            "   <header>",
            "      <h2>Title</h2>",
            "   </header>",
            "   <main></main>",
            "</div>",
            "<footer></footer>",
         ].join("\n"),
      );
   });

   it("writes void elements without a closing tag", () => {
      assert.equal(
         format('<div><input type="text"><br><img src="a.png"></div>'),
         ["<div>", '   <input type="text">', "   <br>", '   <img src="a.png">', "</div>"].join("\n"),
      );
   });

   it("keeps the case of SVG element names and attributes", () => {
      assert.equal(
         format('<svg viewBox="0 0 10 10"><linearGradient id="g"></linearGradient></svg>'),
         ['<svg viewBox="0 0 10 10">', '   <linearGradient id="g"></linearGradient>', "</svg>"].join("\n"),
      );
   });

   it("escapes text and attributes like innerHTML", () => {
      assert.equal(
         format("<span>a &amp; b &lt; c &gt; d&nbsp;e</span>"),
         "<span>a &amp; b &lt; c &gt; d&nbsp;e</span>",
      );
      assert.equal(format(`<div title='say "hi"'></div>`), '<div title="say &quot;hi&quot;"></div>');
   });

   it("puts text next to elements on its own line, with trailing spaces as &#32;", () => {
      assert.equal(
         format("<div>Hello <b>World</b>!</div>"),
         ["<div>", "   Hello&#32;", "   <b>World</b>", "   !", "</div>"].join("\n"),
      );
   });

   it("shows whitespace-only text between elements", () => {
      assert.equal(
         format("<div><i></i> <i></i></div>"),
         ["<div>", "   <i></i>", "   &#32;", "   <i></i>", "</div>"].join("\n"),
      );
   });

   it("writes newlines in text as &#10;", () => {
      let span = document.createElement("span");
      span.textContent = "a\nb";
      let el = document.createElement("div");
      el.appendChild(span);
      assert.equal(formatHTML(el), "<span>a&#10;b</span>");
   });

   it("omits comments", () => {
      assert.equal(format("<div><!-- note --><i></i></div>"), ["<div>", "   <i></i>", "</div>"].join("\n"));
      assert.equal(format("<!-- top --><i></i>"), "<i></i>");
   });

   it("formats different structures differently", () => {
      let pairs = [
         ["<div>a<b></b></div>", "<div>a</div><b></b>"],
         ["<div><span>a</span></div>", "<div><span></span>a</div>"],
         ["<div><i></i></div><i></i>", "<div><i></i><i></i></div>"],
         ["<p>a b</p>", "<p>a&nbsp;b</p>"],
         ["<p>a </p>", "<p>a</p>"],
         ['<p class="a"></p>', "<p></p>"],
      ];
      for (let [a, b] of pairs) assert.notEqual(format(a), format(b), `${a} and ${b} should differ`);
   });
});

describe("markup", () => {
   it("removes the common indentation and the surrounding blank lines", () => {
      let value = markup`
         <div>
            <b></b>
         </div>
      `;
      assert.equal(value, "<div>\n   <b></b>\n</div>");
   });

   it("keeps a single line as it is", () => {
      assert.equal(markup`<i></i>`, "<i></i>");
   });

   it("inserts interpolated values", () => {
      let text = "Header";
      assert.equal(markup`<h2>${text}</h2>`, "<h2>Header</h2>");
   });

   it("produces the format of formatHTML", () => {
      let expected = markup`
         <ul>
            <li>One</li>
            <li>Two</li>
         </ul>
      `;
      assert.equal(format("<ul><li>One</li><li>Two</li></ul>"), expected);
   });
});

describe("render", () => {
   it("renders into a container attached to the document", async () => {
      let screen = await render(
         <cx>
            <div class="x">Hi</div>
         </cx>,
      );
      assert.ok(document.body.contains(screen.container));
      assert.equal(screen.html(), '<div class="x">Hi</div>');
   });

   it("binds the content to the given store, or to a new one", async () => {
      let store = new Store({ data: { name: "John" } });
      let screen = await render(
         <cx>
            <div text={bind("name")} />
         </cx>,
         { store },
      );
      assert.strictEqual(screen.store, store);
      assert.equal(screen.html(), "<div>John</div>");

      let other = await render(
         <cx>
            <div text={bind("name", "default")} />
         </cx>,
      );
      assert.ok(other.store instanceof Store);
      assert.equal(other.store.get("name"), "default");
   });

   it("formats with the given culture", async () => {
      let time = () => Culture.getDateTimeCulture().getFormatter("HHmmN").format(new Date("2026-04-24T12:00:00Z"));
      let screen = await render(
         <cx>
            <span text={time} />
         </cx>,
         { cultureInfo: createCulture({ timezone: "UTC" }) },
      );
      assert.equal(screen.html(), "<span>12:00</span>");
   });

   it("rerenders new content, keeping the options that are not given", async () => {
      let store = new Store({ data: { name: "John" } });
      let screen = await render(
         <cx>
            <div text={bind("name")} />
         </cx>,
         { store },
      );

      await screen.rerender(
         <cx>
            <span text={bind("name")} />
         </cx>,
      );
      assert.equal(screen.html(), "<span>John</span>");

      let other = new Store({ data: { name: "Jack" } });
      await screen.rerender(
         <cx>
            <span text={bind("name")} />
         </cx>,
         { store: other },
      );
      assert.strictEqual(screen.store, other);
      assert.equal(screen.html(), "<span>Jack</span>");
   });

   it("removes the container on cleanup", async () => {
      let screen = await render(
         <cx>
            <div>Hi</div>
         </cx>,
      );
      await cleanup();
      assert.ok(!document.body.contains(screen.container));
      assert.equal(screen.container.innerHTML, "");
   });
});

describe("settle", () => {
   it("waits until React has rendered the update", async () => {
      let store = new Store({ data: { name: "John" } });
      let screen = await render(
         <cx>
            <div text={bind("name")} />
         </cx>,
         { store },
      );
      await settle(() => store.set("name", "Jack"));
      assert.equal(screen.html(), "<div>Jack</div>");
   });

   it("turns React's act environment on only while it runs", async () => {
      let during: unknown;
      await settle(() => {
         during = (globalThis as any).IS_REACT_ACT_ENVIRONMENT;
      });
      assert.equal(during, true);
      assert.equal((globalThis as any).IS_REACT_ACT_ENVIRONMENT, false);
   });
});
