import { Button, MsgBox } from "cx/widgets";

// @index
export default () => (
  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
    <Button
      onClick={() => {
        MsgBox.alert({
          title: "Terms of Service",
          children: (
            <div>
              <p>Please read the following carefully:</p>
              <ul style={{ marginLeft: "20px", marginTop: "8px" }}>
                <li>You must be 18 or older</li>
                <li>You agree to our privacy policy</li>
                <li>You accept the terms of use</li>
              </ul>
              <p style={{ marginTop: "12px", fontStyle: "italic" }}>
                By clicking OK, you accept these terms.
              </p>
            </div>
          ),
          okText: "I Accept",
        });
      }}
    >
      Rich Content Alert
    </Button>
    <Button
      onClick={() => {
        MsgBox.yesNo({
          title: "Delete Confirmation",
          children: (
            <div>
              <p>
                <strong>Warning:</strong> This action cannot be undone.
              </p>
              <p style={{ marginTop: "8px" }}>
                Are you sure you want to permanently delete this file?
              </p>
            </div>
          ),
          yesText: "Yes, Delete",
          noText: "Keep File",
        });
      }}
    >
      Rich Content Confirm
    </Button>
  </div>
);
// @index-end
