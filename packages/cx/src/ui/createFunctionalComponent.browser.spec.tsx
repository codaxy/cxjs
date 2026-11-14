import { describe, it } from "vitest";
import { Store } from "../data/Store";
import { createFunctionalComponent } from "./createFunctionalComponent";
import { bind } from "./bind";
import { expr } from "./expr";
import { render, settle, markup } from "../util/test/render";

import assert from "assert";
import { Rescope } from "./Rescope";
import { LabelsLeftLayout } from "./layout/LabelsLeftLayout";
import { LabeledContainer } from "../widgets/form/LabeledContainer";
import { Repeater } from "./Repeater";
import { FirstVisibleChildLayout } from "./layout/FirstVisibleChildLayout";
import { useStoreMethods } from "../hooks";
import { AccessorChain, createAccessorModelProxy } from "../data/createAccessorModelProxy";

describe("createFunctionalComponent generic type safety", () => {
  interface User {
    id: number;
    name: string;
  }

  interface GenericListProps<T> {
    items: AccessorChain<T[]>;
    onSelect?: (item: T) => void;
  }

  const GenericList = createFunctionalComponent(
    <T,>({ items, onSelect }: GenericListProps<T>) => (
      <cx>
        <div />
      </cx>
    )
  );

  it("infers generic type parameter from AccessorChain", () => {
    let model = createAccessorModelProxy<{ users: User[] }>();

    const widget = (
      <cx>
        <GenericList
          items={model.users}
          onSelect={(user) => {
            // user should be inferred as User
            const id: number = user.id;
            const name: string = user.name;
            // @ts-expect-error - nonExistent does not exist on User
            const x = user.nonExistent;
          }}
        />
      </cx>
    );
    assert.ok(widget);
  });

  it("accepts PureContainerConfig props like visible", () => {
    let model = createAccessorModelProxy<{ users: User[] }>();

    const widget = (
      <cx>
        <GenericList
          items={model.users}
          visible={true}
        />
      </cx>
    );
    assert.ok(widget);
  });
});

describe("createFunctionalComponent type safety", () => {
  interface MyComponentProps {
    title: string;
    count: number;
    optional?: boolean;
  }

  const TypedComponent = createFunctionalComponent<MyComponentProps>(
    ({ title, count, optional }) => (
      <cx>
        <div text={title} />
        <div text={String(count)} />
        {optional && <div text="optional shown" />}
      </cx>
    )
  );

  it("rejects non-existing properties", () => {
    const widget = (
      <cx>
        <TypedComponent
          title="Test"
          count={5}
          // @ts-expect-error - nonExisting does not exist on MyComponentProps
          nonExisting="invalid"
        />
      </cx>
    );
    assert.ok(widget);
  });

  it("rejects wrong property type", () => {
    const widget = (
      <cx>
        <TypedComponent
          title="Test"
          // @ts-expect-error - count should be number, not string
          count="wrong"
        />
      </cx>
    );
    assert.ok(widget);
  });

  it("rejects missing required properties", () => {
    const widget = (
      <cx>
        {/* @ts-expect-error - count is required but missing */}
        <TypedComponent title="Test" />
      </cx>
    );
    assert.ok(widget);
  });
});

describe("createFunctionalComponent", () => {
  it("allows spread", async () => {
    const SuperDiv = createFunctionalComponent(({ ...props }) => {
      return (
        <cx>
          <div {...props} />
        </cx>
      );
    });

    let props = {
      text: "Spread",
      style: "background: red;",
    };

    const widget = (
      <cx>
        <SuperDiv {...props} class="test" />
      </cx>
    );

    let store = new Store();

    const screen = await render(widget, { store });

    assert.equal(screen.html(), '<div class="test" style="background: red;">Spread</div>');
  });

  it("visible and Rescope behave as expected", async () => {
    const RootRescope = createFunctionalComponent(({}) => {
      return (
        <cx>
          <Rescope bind="x">
            <div text={bind("y")} />
          </Rescope>
        </cx>
      );
    });

    const widget = (
      <cx>
        <RootRescope visible={expr("!!{x}")} />
      </cx>
    );

    let store = new Store({
      data: {
        x: {
          y: "OK",
        },
      },
    });

    const screen = await render(widget, { store });

    assert.equal(screen.html(), "<div>OK</div>");
  });

  it("visible and multiple items behave as expected", async () => {
    const FComponent = createFunctionalComponent(({}) => {
      return (
        <cx>
          <div>1</div>
          <div visible={false}>2</div>
          <div>3</div>
        </cx>
      );
    });

    const widget = (
      <cx>
        <FComponent />
      </cx>
    );

    let store = new Store();

    const screen = await render(widget, { store });

    assert.equal(screen.html(), markup`
      <div>1</div>
      <div>3</div>
    `);
  });

  it("respects inner layouts", async () => {
    const FComponent = createFunctionalComponent(({}) => {
      return (
        <cx>
          <LabeledContainer label="Test" />
          <LabeledContainer label="Test" />
        </cx>
      );
    });

    const widget = (
      <cx>
        <div layout={LabelsLeftLayout}>
          <FComponent />
        </div>
      </cx>
    );

    let store = new Store();

    const screen = await render(widget, { store });

    // the parent's layout arranges the component's fields: one table, with a row for each field
    let tables = screen.container.querySelectorAll("table");
    assert.equal(tables.length, 1);
    let rows = Array.from(tables[0].querySelectorAll("tr"));
    assert.deepEqual(
      rows.map((tr) => tr.querySelector("label")?.textContent),
      ["Test", "Test"],
    );
  });

  it("can use refs for data bindings", async () => {
    const X = createFunctionalComponent(({}) => {
      let { ref } = useStoreMethods();
      let x = ref("x", "OK");
      return (
        <cx>
          <div text={x} />
        </cx>
      );
    });

    const widget = (
      <cx>
        <X visible={true} />
      </cx>
    );

    let store = new Store();

    const screen = await render(widget, { store });

    assert.equal(screen.html(), "<div>OK</div>");
  });

  it("adds children at the right place", async () => {
    const X = createFunctionalComponent(({ children }: { children: any }) => (
      <cx>
        <header />
        <main>{children}</main>
        <footer />
      </cx>
    ));

    const widget = (
      <cx>
        <X>
          <div />
        </X>
      </cx>
    );

    let store = new Store();

    const screen = await render(widget, { store });

    assert.equal(screen.html(), markup`
      <header></header>
      <main>
         <div></div>
      </main>
      <footer></footer>
    `);
  });

  it("works well with repeaters", async () => {
    const X = createFunctionalComponent(({}) => {
      let { ref } = useStoreMethods();
      let text = ref("$record.text");
      return (
        <cx>
          <div text={text} />
        </cx>
      );
    });

    const widget = (
      <cx>
        <Repeater records={bind("array")}>
          <X />
        </Repeater>
      </cx>
    );

    let store = new Store({
      data: { array: [{ text: "0" }, { text: "1" }, { text: "2" }] },
    });

    const screen = await render(widget, { store });

    assert.equal(screen.html(), markup`
      <div>0</div>
      <div>1</div>
      <div>2</div>
    `);

    await settle(() => store.update("array", (array) => [array[0], { text: "10" }, array[2]]));

    assert.equal(screen.html(), markup`
      <div>0</div>
      <div>10</div>
      <div>2</div>
    `);
  });

  it("can have its own layout", async () => {
    const X = createFunctionalComponent(() => (
      <cx>
        <div>1</div>
        <div>2</div>
        <div>3</div>
      </cx>
    ));

    const widget = (
      <cx>
        <X layout={FirstVisibleChildLayout} />
      </cx>
    );

    let store = new Store();

    const screen = await render(widget, { store });

    assert.equal(screen.html(), "<div>1</div>");
  });

  it("passes type config property to the factory function", async () => {
    const CustomInput = createFunctionalComponent(
      ({ type }: { type?: string }) => (
        <cx>
          <input type={type || "text"} />
        </cx>
      )
    );

    const widget = (
      <cx>
        <CustomInput type="password" />
      </cx>
    );

    let store = new Store();

    const screen = await render(widget, { store });

    assert.equal(screen.html(), '<input type="password">');
  });

  it("passes type config property with other props", async () => {
    interface ButtonProps {
      type?: "button" | "submit";
      label: string;
    }

    const CustomButton = createFunctionalComponent(
      ({ type, label }: ButtonProps) => (
        <cx>
          <button type={type || "button"}>{label}</button>
        </cx>
      )
    );

    const widget = (
      <cx>
        <CustomButton type="submit" label="Submit Form" />
      </cx>
    );

    let store = new Store();

    const screen = await render(widget, { store });

    assert.equal(screen.html(), '<button type="submit">Submit Form</button>');
  });

  it("defaults type when not provided", async () => {
    const CustomInput = createFunctionalComponent(
      ({ type = "text" }: { type?: string }) => (
        <cx>
          <input type={type} />
        </cx>
      )
    );

    const widget = (
      <cx>
        <CustomInput />
      </cx>
    );

    let store = new Store();

    const screen = await render(widget, { store });

    assert.equal(screen.html(), '<input type="text">');
  });
});
