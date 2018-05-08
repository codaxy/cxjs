import {Store} from "cx/data";
import {Url, History, Widget, startHotAppLoop} from "cx/ui";
import {Timing, Debug} from "cx/util";

//css
import "./index.scss";

//store
const store = new Store();

//routing
Url.setBaseFromScript("app*.js");
History.connect(store, "url");

//debug
Widget.resetCounter();
Timing.enable("app-loop");
Debug.enable("app-data");

//app loop
import Routes from "./routes";

startHotAppLoop(module, document.getElementById("app"), store, Routes);
