import { describe, it } from "vitest";
import { Store } from "../data/Store";
import assert from "assert";
import { render, settle, markup } from "../util/test/render";
import { bind } from "../ui/bind";
import { VDOM } from "../ui/Widget";
import { Instance } from "../ui/Instance";

describe("HtmlElement", () => {
  it("renders textual content provided through the text property", async () => {
    let widget = (
      <cx>
        <div text={bind("text")} />
      </cx>
    );

    let store = new Store({
      data: {
        text: "Test",
      },
    });

    const screen = await render(widget, { store });

    assert.equal(screen.html(), "<div>Test</div>");
  });

  it("allows spread bindings", async () => {
    let store = new Store({
      data: {
        title: "title",
      },
    });

    const screen = await render(
      <cx>
        <a href="#" {...{ title: { bind: "title" } }}>
          Link
        </a>
      </cx>,
      { store },
    );

    assert.equal(screen.html(), '<a href="#" title="title">Link</a>');
  });

  it("supports SVG elements with camelCase attributes", async () => {
    let store = new Store();

    const screen = await render(
      <cx>
        <svg>
          <path
            d="M200,176V64a23.9,23.9,0,0,0-24-24H40"
            fill="none"
            stroke="#343434"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="12"
          />
        </svg>
      </cx>,
      { store },
    );

    // camelCase props are rendered as the corresponding SVG attributes
    let path =
      '<path d="M200,176V64a23.9,23.9,0,0,0-24-24H40" fill="none" stroke="#343434" ' +
      'stroke-linecap="round" stroke-linejoin="round" stroke-width="12"></path>';
    assert.equal(screen.html(), markup`
      <svg>
         ${path}
      </svg>
    `);
  });

  it("infers event handler parameter types", async () => {
    type ClickArgs = {
      event: React.MouseEvent<HTMLButtonElement>;
      instance: Instance;
    };
    let clickedWith: ClickArgs | null = null;

    let store = new Store();

    const screen = await render(
      <cx>
        <button
          onClick={(e, instance) => {
            // TypeScript should infer e as React.MouseEvent<HTMLButtonElement> and instance as Instance
            clickedWith = { event: e, instance };
          }}
        >
          Click me
        </button>
      </cx>,
      { store },
    );

    assert.equal(screen.html(), "<button>Click me</button>");

    await settle(() => screen.getByRole("button", { name: "Click me" }).click());
    assert.ok(clickedWith, "onClick should be called");
    // clickedWith is assigned in the callback, which TypeScript's control flow analysis doesn't see
    let { event, instance } = clickedWith as unknown as ClickArgs;
    assert.equal(event.type, "click");
    assert.equal(event.target, screen.container.querySelector("button"));
    assert.ok(instance && instance.widget, "onClick should receive the widget instance");
  });
});
