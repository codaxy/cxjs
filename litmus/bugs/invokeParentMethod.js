import { Controller } from "cx/ui";
import { Button } from "cx/widgets";

class PageController extends Controller {
    test(val) {
        console.log('val', val)
    }
}

export default (
    <cx>
        <div controller={PageController}>
            <Button
                onClick={(e, instance) => {
                    let controller = instance.controller;
                    // controller.invokeParentMethod('test', 1);
                    controller.invokeMethod('test', 2)
                }}
                text="test"
            />
        </div>
    </cx>
)