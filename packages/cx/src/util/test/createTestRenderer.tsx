/** @jsxImportSource react */
import renderer from "react-test-renderer";
import { act } from "react";
import { Cx } from "../../ui/Cx";
import { View } from "../../data/View";

export async function createTestRenderer(store: View, widget: any) {
   let result: renderer.ReactTestRenderer;
   await act(async () => {
      result = renderer.create(createTestWidget(store, widget));
   });
   return result!;
}

export function createTestWidget(store: View, widget: any) {
   return <Cx widget={widget} store={store} subscribe immediate />;
}

export { act };
