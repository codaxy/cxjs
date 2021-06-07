import { VDOM } from "cx/ui";
import { Icon } from "cx/widgets";

export class DocSearch extends VDOM.Component {
   render() {
      return (
         <div className="cxb-docsearch">
            <input type="text" id="docsearch" placeholder="Search..." className="cxe-docsearch-input" />
            {Icon.render("search", { className: "cxe-docsearch-icon" })}
         </div>
      );
   }

   delayedInit() {
      if (this.initialized) return;
      if (typeof docsearch != "function") return;
      clearInterval(this.delayedInitTimer);
      this.initialized = true;
      try {
         docsearch({
            apiKey: "b77ab797ddcee40f03751aeb694168ed",
            indexName: "cxjs",
            inputSelector: "#docsearch",
            debug: false, // Set debug to true if you want to inspect the dropdown
         });
      } catch (err) {
         console.log("DocSearch init error.", err);
      }
   }

   componentDidMount() {
      this.delayedInit();
      this.delayedInitTimer = setInterval(() => this.delayedInit(), 100);
   }

   componentWillUnmount() {
      clearInterval(this.delayedInitTimer);
   }
}
