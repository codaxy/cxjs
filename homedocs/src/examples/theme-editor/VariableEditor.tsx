import { createModel } from "cx/data";
import {
  createFunctionalComponent,
  expr,
  computable,
  PrivateStore,
  Prop,
} from "cx/ui";
import {
  ColorPicker,
  Dropdown,
  Icon,
  Repeater,
  TextField,
  Tooltip,
} from "cx/widgets";
import { variableMap, ThemeVarsDiv } from "cx-theme-variables";
import { m } from "./model";

interface ColorSwatchProps {
  value: Prop<string>;
}

const ColorSwatch = createFunctionalComponent(({ value }: ColorSwatchProps) => {
  const state = createModel<{ open: boolean; value: string }>();
  return (
    <PrivateStore data={{ value }}>
      <div class="relative theme-editor-variables">
        <div
          class="w-8 h-8 rounded-md border border-border shrink-0 cursor-pointer hover:border-foreground transition-colors"
          style={computable(state.value, (v) => ({
            background: v,
          }))}
          onClick={(e: any, { store }: any) => store.toggle(state.open)}
        />
        <Dropdown
          visible={state.open}
          placement="down-left"
          offset={4}
          arrow
          focusable
          autoFocus
          dismissOnFocusOut
        >
          <ColorPicker
            value={state.value}
            onColorClick={(e, { store }) => {
              store.set(state.open, false);
            }}
          />
        </Dropdown>
      </div>
    </PrivateStore>
  );
});

export const VariableEditor = createFunctionalComponent(() => (
  <ThemeVarsDiv
    theme={{
      inputPaddingX: "6px",
      inputPaddingY: "6px",
      inputLineHeight: "18px",
    }}
    class="w-80 border-r border-border p-4 overflow-y-auto bg-background"
  >
    <Repeater records={m.categories} recordAlias={m.$category} keyField="id">
      <div
        visible={expr(
          m.$category.id,
          m.activeCategory,
          (id, active) => id === active,
        )}
      >
        <div class="flex justify-between items-center mb-4">
          <h3
            class="m-0 text-base font-semibold text-foreground"
            text={m.$category.name}
          />
          <span
            class="text-xs text-muted-foreground"
            text={computable(
              m.$category.variables,
              (vars) => `${vars?.length ?? 0} vars`,
            )}
          />
        </div>

        <Repeater records={m.$category.variables} recordAlias={m.$variable}>
          <div class="mb-5">
            <div class="flex items-center gap-1">
              <div class="text-xs text-foreground" text={m.$variable.label} />
              <div
                class="text-muted-foreground cursor-help"
                tooltip={{
                  title: m.$variable.key,
                  text: computable(
                    m.$variable.key,
                    (key) => `var(${variableMap[key]})`,
                  ),
                  placement: "up",
                }}
              >
                <Icon
                  name="info"
                  style="width: 14px; height: 14px; display: block"
                />
              </div>
            </div>
            <div class="flex gap-2 items-center mt-1">
              <TextField
                value={m.$variable.value}
                style="flex: 1;"
                inputStyle="font-family: monospace"
              />
              <ColorSwatch
                value={m.$variable.value}
                visible={expr(m.$variable.type, (type) => type === "color")}
              />
            </div>
          </div>
        </Repeater>
      </div>
    </Repeater>
  </ThemeVarsDiv>
));
