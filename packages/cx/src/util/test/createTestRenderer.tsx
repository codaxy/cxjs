/** @jsxImportSource react */
import renderer from "react-test-renderer";
import { Cx } from "../../ui/Cx";
import { View } from "../../data/View";

export function createTestRenderer(store: View, widget: any) {
   return renderer.create(createTestWidget(store, widget));
}

export function createTestWidget(store: View, widget: any) {
   return <Cx widget={widget} store={store} subscribe immediate />;
}
