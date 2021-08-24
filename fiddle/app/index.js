import "core-js/stable";
import "regenerator-runtime/runtime";
import { startAppLoop, Url, Widget, History } from "cx/ui";
import { Store } from "cx/data";
import { Debug } from "cx/util";
import { App } from "./routes/";
import "./index.scss";
import "./components/icons";

var store = new Store();

Url.setBaseFromScript("app*.js");
History.connect(store, "url");
Widget.optimizePrepare = false;
Widget.resetCounter();
Debug.enable("app-data");

var stop = startAppLoop(document.getElementById("app"), store, App);

if (module.hot) {
   // accept itself
   module.hot.accept();

   // remember data on dispose
   module.hot.dispose(function (data) {
      data.state = store.getData();
      if (stop) stop();
   });

   //apply data on hot replace
   if (module.hot.data) store.load(module.hot.data.state);
}
