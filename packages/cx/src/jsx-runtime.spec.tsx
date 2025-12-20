import assert from "assert";
import { TextField } from "./widgets/form/TextField";
import { NumberField } from "./widgets/form/NumberField";
import { Button } from "./widgets/Button";
import { Checkbox } from "./widgets/form/Checkbox";
import { bind } from "./ui/bind";
import { expr } from "./ui/expr";
import { createFunctionalComponent } from "./ui/createFunctionalComponent";

/**
 * These tests verify that widget props are correctly typed in JSX.
 * Negative tests use @ts-expect-error to verify that incorrect types are rejected.
 */

describe("jsx-runtime type inference", () => {
   describe("TextField", () => {
      it("accepts correct prop types", () => {
         const widget = (
            <cx>
               <TextField
                  value={bind("text")}
                  placeholder="Enter text"
                  disabled={false}
                  readOnly={true}
                  required={false}
                  minLength={5}
                  maxLength={100}
               />
            </cx>
         );
         assert.ok(widget);
      });

      it("accepts binding for string props", () => {
         const widget = (
            <cx>
               <TextField placeholder={bind("placeholder")} validationErrorText={bind("errorText")} />
            </cx>
         );
         assert.ok(widget);
      });

      it("accepts expressions for boolean props", () => {
         const widget = (
            <cx>
               <TextField disabled={expr("{loading}")} readOnly={expr("{!editable}")} />
            </cx>
         );
         assert.ok(widget);
      });

      it("rejects number for placeholder (expects string)", () => {
         const widget = (
            <cx>
               {/* @ts-expect-error - placeholder should be StringProp, not a number */}
               <TextField placeholder={123} />
            </cx>
         );
         assert.ok(widget);
      });

      it("rejects string for minLength (expects number)", () => {
         const widget = (
            <cx>
               {/* @ts-expect-error - minLength should be NumberProp, not a string */}
               <TextField minLength="five" />
            </cx>
         );
         assert.ok(widget);
      });

      it("rejects string for maxLength (expects number)", () => {
         const widget = (
            <cx>
               {/* @ts-expect-error - maxLength should be NumberProp, not a string */}
               <TextField maxLength="100" />
            </cx>
         );
         assert.ok(widget);
      });

      it("rejects number for disabled (expects boolean)", () => {
         const widget = (
            <cx>
               {/* @ts-expect-error - disabled should be BooleanProp, not a number */}
               <TextField disabled={1} />
            </cx>
         );
         assert.ok(widget);
      });

      it("rejects string for readOnly (expects boolean)", () => {
         const widget = (
            <cx>
               {/* @ts-expect-error - readOnly should be BooleanProp, not a string */}
               <TextField readOnly="true" />
            </cx>
         );
         assert.ok(widget);
      });

      it("rejects non-existent properties", () => {
         const widget = (
            <cx>
               {/* @ts-expect-error - nonExistentProp does not exist on TextFieldConfig */}
               <TextField nonExistentProp="value" />
            </cx>
         );
         assert.ok(widget);
      });
   });

   describe("NumberField", () => {
      it("accepts correct prop types", () => {
         const widget = (
            <cx>
               <NumberField
                  value={bind("amount")}
                  placeholder="Enter amount"
                  minValue={0}
                  maxValue={1000}
                  format="currency"
                  disabled={false}
               />
            </cx>
         );
         assert.ok(widget);
      });

      it("accepts bindings for number props", () => {
         const widget = (
            <cx>
               <NumberField minValue={bind("minVal")} maxValue={bind("maxVal")} increment={bind("step")} />
            </cx>
         );
         assert.ok(widget);
      });

      it("rejects string for value (expects number)", () => {
         const widget = (
            <cx>
               {/* @ts-expect-error - value should be NumberProp, not a literal string */}
               <NumberField value="100" />
            </cx>
         );
         assert.ok(widget);
      });

      it("rejects string for minValue (expects number)", () => {
         const widget = (
            <cx>
               {/* @ts-expect-error - minValue should be NumberProp, not a string */}
               <NumberField minValue="zero" />
            </cx>
         );
         assert.ok(widget);
      });

      it("rejects string for maxValue (expects number)", () => {
         const widget = (
            <cx>
               {/* @ts-expect-error - maxValue should be NumberProp, not a string */}
               <NumberField maxValue="one thousand" />
            </cx>
         );
         assert.ok(widget);
      });

      it("rejects boolean for increment (expects number)", () => {
         const widget = (
            <cx>
               {/* @ts-expect-error - increment should be NumberProp, not a boolean */}
               <NumberField increment={true} />
            </cx>
         );
         assert.ok(widget);
      });

      it("rejects number for format (expects string)", () => {
         const widget = (
            <cx>
               {/* @ts-expect-error - format should be StringProp, not a number */}
               <NumberField format={123} />
            </cx>
         );
         assert.ok(widget);
      });
   });

   describe("Button", () => {
      it("accepts correct prop types", () => {
         const widget = (
            <cx>
               <Button text="Click me" disabled={false} pressed={true} icon="search" />
            </cx>
         );
         assert.ok(widget);
      });

      it("accepts bindings for boolean props", () => {
         const widget = (
            <cx>
               <Button disabled={bind("isLoading")} pressed={bind("isPressed")} />
            </cx>
         );
         assert.ok(widget);
      });

      it("accepts expressions for enabled prop", () => {
         const widget = (
            <cx>
               <Button enabled={expr("!{isLoading}")} />
            </cx>
         );
         assert.ok(widget);
      });

      it("rejects string for disabled (expects boolean)", () => {
         const widget = (
            <cx>
               {/* @ts-expect-error - disabled should be BooleanProp, not a string */}
               <Button disabled="true" />
            </cx>
         );
         assert.ok(widget);
      });

      it("rejects number for pressed (expects boolean)", () => {
         const widget = (
            <cx>
               {/* @ts-expect-error - pressed should be BooleanProp, not a number */}
               <Button pressed={1} />
            </cx>
         );
         assert.ok(widget);
      });

      it("rejects number for icon (expects string)", () => {
         const widget = (
            <cx>
               {/* @ts-expect-error - icon should be StringProp, not a number */}
               <Button icon={42} />
            </cx>
         );
         assert.ok(widget);
      });

      it("rejects invalid type value", () => {
         const widget = (
            <cx>
               {/* @ts-expect-error - type should be "submit" | "button", not "reset" */}
               <Button type="reset" />
            </cx>
         );
         assert.ok(widget);
      });
   });

   describe("Checkbox", () => {
      it("accepts correct prop types", () => {
         const widget = (
            <cx>
               <Checkbox value={bind("checked")} text="Accept terms" disabled={false} />
            </cx>
         );
         assert.ok(widget);
      });

      it("rejects string for value (expects boolean)", () => {
         const widget = (
            <cx>
               {/* @ts-expect-error - value should be BooleanProp, not a string */}
               <Checkbox value="checked" />
            </cx>
         );
         assert.ok(widget);
      });

      it("rejects number for disabled (expects boolean)", () => {
         const widget = (
            <cx>
               {/* @ts-expect-error - disabled should be BooleanProp, not a number */}
               <Checkbox disabled={0} />
            </cx>
         );
         assert.ok(widget);
      });
   });

   describe("HtmlElement intrinsic elements", () => {
      it("accepts correct prop types for div", () => {
         const widget = (
            <cx>
               <div text="Hello" visible={true} class="container" style="padding: 10px" />
            </cx>
         );
         assert.ok(widget);
      });

      it("accepts bindings for text prop", () => {
         const widget = (
            <cx>
               <div text={bind("message")} />
            </cx>
         );
         assert.ok(widget);
      });

      it("accepts expressions for visible prop", () => {
         const widget = (
            <cx>
               <div visible={expr("{showDiv}")} text="Conditional" />
            </cx>
         );
         assert.ok(widget);
      });

      it("rejects boolean for text (expects string or number)", () => {
         const widget = (
            <cx>
               {/* @ts-expect-error - text should be StringProp | NumberProp, not a boolean */}
               <div text={false} />
            </cx>
         );
         assert.ok(widget);
      });

      it("rejects string for visible (expects boolean)", () => {
         const widget = (
            <cx>
               {/* @ts-expect-error - visible should be BooleanProp, not a string */}
               <div visible="true" />
            </cx>
         );
         assert.ok(widget);
      });
   });

   describe("Required props", () => {
      interface RequiredPropsConfig {
         title: string;
         count: number;
         optional?: boolean;
      }

      const ComponentWithRequiredProps = createFunctionalComponent<RequiredPropsConfig>(({ title, count, optional }) => (
         <cx>
            <div text={title} />
            <div text={String(count)} />
            {optional && <div text="optional shown" />}
         </cx>
      ));

      it("accepts all required props provided", () => {
         const widget = (
            <cx>
               <ComponentWithRequiredProps title="Hello" count={42} />
            </cx>
         );
         assert.ok(widget);
      });

      it("accepts required props with optional prop", () => {
         const widget = (
            <cx>
               <ComponentWithRequiredProps title="Hello" count={42} optional={true} />
            </cx>
         );
         assert.ok(widget);
      });

      it("rejects missing required prop (title)", () => {
         const widget = (
            <cx>
               {/* @ts-expect-error - title is required but missing */}
               <ComponentWithRequiredProps count={42} />
            </cx>
         );
         assert.ok(widget);
      });

      it("rejects missing required prop (count)", () => {
         const widget = (
            <cx>
               {/* @ts-expect-error - count is required but missing */}
               <ComponentWithRequiredProps title="Hello" />
            </cx>
         );
         assert.ok(widget);
      });

      it("rejects missing all required props", () => {
         const widget = (
            <cx>
               {/* @ts-expect-error - title and count are required but missing */}
               <ComponentWithRequiredProps optional={true} />
            </cx>
         );
         assert.ok(widget);
      });
   });
});
