import { VDOM } from "cx/ui";
import { Icon } from "cx/widgets";

export class DocSearch extends VDOM.Component {
   render() {
      return <div className="cxb-docsearch"></div>;
   }

   delayedInit() {
      if (this.initialized) return;
      if (typeof docsearch != "function") return;
      clearInterval(this.delayedInitTimer);
      this.initialized = true;
      try {
         docsearch({
            apiKey: "f693216413fd12fc412bdd65f66e8acc",
            indexName: "cxjs",
            container: ".cxb-docsearch",
            appId: "E6T8DCDI3M",
            debug: false, // Set debug to true if you want to inspect the dropdown,

            // #if development
            transformData: function (hits) {
               let address = `${location.protocol}//${location.hostname}`;
               if (location.port) address += ":" + location.port;

               return hits.map((hit) => ({
                  ...hit,
                  url: hit.url.replace("https://docs.cxjs.io", address),
               }));
            },
            // #end
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
