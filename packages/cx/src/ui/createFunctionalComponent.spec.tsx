import { Store } from "../data/Store";
import { createFunctionalComponent } from "./createFunctionalComponent";
import { bind } from "./bind";
import { expr } from "./expr";
import { createTestRenderer, act } from "../util/test/createTestRenderer";

import assert from "assert";
import { Rescope } from "./Rescope";
import { LabelsLeftLayout } from "./layout/LabelsLeftLayout";
import { LabeledContainer } from "../widgets/form/LabeledContainer";
import { Repeater } from "./Repeater";
import { FirstVisibleChildLayout } from "./layout/FirstVisibleChildLayout";
import { useStoreMethods } from "../hooks";

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

    const component = await createTestRenderer(store, widget);

    let tree = component.toJSON();
    assert.deepEqual(tree, {
      type: "div",
      children: ["Spread"],
      props: {
        className: "test",
        style: {
          background: "red",
        },
      },
    });
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

    const component = await createTestRenderer(store, widget);

    let tree = component.toJSON();
    assert.deepEqual(tree, {
      type: "div",
      children: ["OK"],
      props: {},
    });
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

    const component = await createTestRenderer(store, widget);

    let tree = component.toJSON();
    assert.deepEqual(tree, [
      {
        type: "div",
        children: ["1"],
        props: {},
      },
      {
        type: "div",
        children: ["3"],
        props: {},
      },
    ]);
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

    const component = await createTestRenderer(store, widget);

    let tree = component.toJSON();

    assert.deepEqual(tree, {
      type: "div",
      props: {},
      children: [
        {
          type: "table",
          props: {
            className: "cxb-labelsleftlayout",
            style: undefined,
          },
          children: [
            {
              type: "tbody",
              props: {},
              children: [
                {
                  type: "tr",
                  props: {},
                  children: [
                    {
                      type: "td",
                      props: {
                        className: "cxe-labelsleftlayout-label",
                        style: undefined,
                      },
                      children: [
                        {
                          type: "label",
                          props: {
                            className: "cxb-label",
                          },
                          children: ["Test"],
                        },
                      ],
                    },
                    {
                      type: "td",
                      props: {
                        className: "cxe-labelsleftlayout-field",
                      },
                      children: null,
                    },
                  ],
                },
                {
                  type: "tr",
                  props: {},
                  children: [
                    {
                      type: "td",
                      props: {
                        className: "cxe-labelsleftlayout-label",
                        style: undefined,
                      },
                      children: [
                        {
                          type: "label",
                          props: {
                            className: "cxb-label",
                          },
                          children: ["Test"],
                        },
                      ],
                    },
                    {
                      type: "td",
                      props: {
                        className: "cxe-labelsleftlayout-field",
                      },
                      children: null,
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    });
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

    const component = await createTestRenderer(store, widget);

    let tree = component.toJSON();
    assert.deepEqual(tree, {
      type: "div",
      children: ["OK"],
      props: {},
    });
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

    const component = await createTestRenderer(store, widget);

    let tree = component.toJSON();

    assert.deepEqual(tree, [
      {
        type: "header",
        children: null,
        props: {},
      },
      {
        type: "main",
        children: [
          {
            type: "div",
            children: null,
            props: {},
          },
        ],
        props: {},
      },
      {
        type: "footer",
        children: null,
        props: {},
      },
    ]);
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

    const component = await createTestRenderer(store, widget);

    let tree = component.toJSON();

    assert.deepEqual(tree, [
      {
        type: "div",
        children: ["0"],
        props: {},
      },
      {
        type: "div",
        children: ["1"],
        props: {},
      },
      {
        type: "div",
        children: ["2"],
        props: {},
      },
    ]);

    await act(async () => {
      store.update("array", (array) => [array[0], { text: "10" }, array[2]]);
    });

    tree = component.toJSON();

    assert.deepEqual(tree, [
      {
        type: "div",
        children: ["0"],
        props: {},
      },
      {
        type: "div",
        children: ["10"],
        props: {},
      },
      {
        type: "div",
        children: ["2"],
        props: {},
      },
    ]);
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

    const component = await createTestRenderer(store, widget);

    let tree = component.toJSON();

    assert.deepEqual(tree, {
      type: "div",
      children: ["1"],
      props: {},
    });
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

    const component = await createTestRenderer(store, widget);

    let tree = component.toJSON();
    assert.deepEqual(tree, {
      type: "input",
      children: null,
      props: {
        type: "password",
      },
    });
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

    const component = await createTestRenderer(store, widget);

    let tree = component.toJSON();
    assert.deepEqual(tree, {
      type: "button",
      children: ["Submit Form"],
      props: {
        type: "submit",
      },
    });
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

    const component = await createTestRenderer(store, widget);

    let tree = component.toJSON();
    assert.deepEqual(tree, {
      type: "input",
      children: null,
      props: {
        type: "text",
      },
    });
  });
});
