import { FlexCol, FlexRow } from "cx/widgets";

// @index
export default () => (
  <FlexCol spacing="large">
    <div>
      <strong>spacing</strong>
      <FlexRow spacing style="border: 1px dotted lightgray">
        <div style="width: 30px; height: 30px; background: lightgray" />
        <div style="width: 40px; height: 40px; background: lightgray" />
        <div style="width: 50px; height: 50px; background: lightgray" />
      </FlexRow>
    </div>
    <div>
      <strong>justify="center"</strong>
      <FlexRow spacing justify="center" style="border: 1px dotted lightgray">
        <div style="width: 30px; height: 30px; background: lightgray" />
        <div style="width: 40px; height: 40px; background: lightgray" />
        <div style="width: 50px; height: 50px; background: lightgray" />
      </FlexRow>
    </div>
    <div>
      <strong>align="center" justify="end"</strong>
      <FlexRow
        spacing
        align="center"
        justify="end"
        style="border: 1px dotted lightgray"
      >
        <div style="width: 30px; height: 30px; background: lightgray" />
        <div style="width: 40px; height: 40px; background: lightgray" />
        <div style="width: 50px; height: 50px; background: lightgray" />
      </FlexRow>
    </div>
    <div>
      <strong>wrap pad</strong>
      <FlexRow pad spacing wrap style="border: 1px dotted lightgray">
        {Array.from({ length: 16 }).map((_, i) => (
          <div
            key={i}
            style="width: 30px; height: 30px; background: lightgray"
          />
        ))}
      </FlexRow>
    </div>
  </FlexCol>
);
// @index-end
