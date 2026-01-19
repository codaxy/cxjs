/** @jsxImportSource react */

import { RenderingContext, Instance, Widget } from "cx/ui";
import type { NumberProp, WidgetConfig } from "cx/ui";

export interface SquareConfig extends WidgetConfig {
  red?: NumberProp;
  green?: NumberProp;
  blue?: NumberProp;
}

export class Square extends Widget<SquareConfig> {
  declare red: number;
  declare green: number;
  declare blue: number;

  declareData(...args: Record<string, any>[]) {
    super.declareData(...args, {
      red: undefined,
      green: undefined,
      blue: undefined,
    });
  }

  setRandomColor(instance: Instance) {
    instance.set("red", Math.floor(Math.random() * 256));
    instance.set("green", Math.floor(Math.random() * 256));
    instance.set("blue", Math.floor(Math.random() * 256));
  }

  render(context: RenderingContext, instance: Instance, key: string) {
    const { data } = instance;
    return (
      <div
        key={key}
        style={{
          width: 100,
          height: 100,
          backgroundColor: `rgb(${data.red}, ${data.green}, ${data.blue})`,
          cursor: "pointer",
          borderRadius: 4,
        }}
        onClick={() => this.setRandomColor(instance)}
      />
    );
  }
}

Square.prototype.red = 0;
Square.prototype.green = 0;
Square.prototype.blue = 0;
