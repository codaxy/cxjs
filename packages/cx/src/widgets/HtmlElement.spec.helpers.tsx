/** @jsxImportSource react */
import React from "react";

// Function component
export function ReactFunctionComponent(props: { title: string; children?: React.ReactNode }) {
   return (
      <div className="react-function-component">
         <h3>{props.title}</h3>
         <div className="content">{props.children}</div>
      </div>
   );
}

// Function component with hooks
export function ReactCounterComponent(props: { initialCount?: number }) {
   const [count, setCount] = React.useState(props.initialCount ?? 0);
   return (
      <div className="react-counter">
         <span className="count">{count}</span>
         <button onClick={() => setCount(count + 1)}>Increment</button>
      </div>
   );
}

// Class component
export class ReactClassComponent extends React.Component<
   { label: string; children?: React.ReactNode },
   { active: boolean }
> {
   constructor(props: { label: string; children?: React.ReactNode }) {
      super(props);
      this.state = { active: false };
   }

   render() {
      return (
         <div className={`react-class-component ${this.state.active ? "active" : ""}`}>
            <label>{this.props.label}</label>
            <div className="body">{this.props.children}</div>
         </div>
      );
   }
}

// Pure component
export class ReactPureComponent extends React.PureComponent<{ value: string }> {
   render() {
      return <span className="react-pure-component">{this.props.value}</span>;
   }
}

// Function component with useRef and useEffect
export function ReactRefEffectComponent(props: { onMount?: (element: HTMLDivElement | null) => void }) {
   const divRef = React.useRef<HTMLDivElement>(null);
   const mountedRef = React.useRef(false);

   React.useEffect(() => {
      mountedRef.current = true;
      props.onMount?.(divRef.current);
      return () => {
         mountedRef.current = false;
      };
   }, []);

   return (
      <div ref={divRef} className="react-ref-effect-component" data-mounted={mountedRef.current ? "true" : "false"}>
         Component with ref and effect
      </div>
   );
}

// Function component with useEffect that updates state
export function ReactEffectStateComponent(props: { value: string }) {
   const [processed, setProcessed] = React.useState<string>("");
   const renderCountRef = React.useRef(0);

   React.useEffect(() => {
      setProcessed(`Processed: ${props.value}`);
   }, [props.value]);

   renderCountRef.current += 1;

   return (
      <div className="react-effect-state-component">
         <span className="processed">{processed}</span>
         <span className="render-count">{renderCountRef.current}</span>
      </div>
   );
}

// Component for testing prop translation
export function ReactPropsComponent(props: {
   text: string;
   count: number;
   enabled: boolean;
   tags?: string[];
   onClick?: () => void;
}) {
   return (
      <div className="react-props-component">
         <span className="text">{props.text}</span>
         <span className="count">{props.count}</span>
         <span className="enabled">{props.enabled ? "yes" : "no"}</span>
         {props.tags && <span className="tags">{props.tags.join(", ")}</span>}
         {props.onClick && <button onClick={props.onClick}>Click</button>}
      </div>
   );
}
