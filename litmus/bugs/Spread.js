import { Button, HtmlElement } from "cx/widgets";

const TestButton = props => (
   <cx>
      <Button
         mod="hollow"
         text="Test"
         onClick={() => console.log("TestButton onClick")}
         {...props}
      />
   </cx>
);

let props = {
   mod: "primary"
};

export default (
   <cx>
      {/*<div>*/}
         {/*<h3>onClick works with ...props</h3>*/}

         {/*<Button*/}
         {/*   text="Normal button"*/}
         {/*   onClick={() => console.log("Button onClick")}*/}
         {/*   {...props}*/}
         {/*/>*/}
         {/*<h3>onClick doesn't work - this is a bug:</h3>*/}
         <TestButton text="Test button" />
         {/*<h3>onClick works because no attributes are passed</h3>*/}
         {/*<TestButton />*/}
      {/*</div>*/}
   </cx>
);
