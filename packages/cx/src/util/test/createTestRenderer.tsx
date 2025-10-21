/** @jsxImportSource react */
import renderer from "react-test-renderer";
import { Cx } from "../../ui/Cx";
import { View } from "../../data/View";

export function createTestRenderer(store: View, widget: any) {
   return renderer.create(<Cx widget={widget} store={store} subscribe immediate />);
}
