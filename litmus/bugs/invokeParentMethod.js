import { Controller } from "cx/ui";
import { Button } from "cx/widgets";

class PageController extends Controller {
    onSubmit(val) {
        console.log('val', val)
    }
}

export default (
    <cx>
        <div controller={PageController}>
            <Button
                onClick={(e, instance) => {
                    let controller = instance.controller;
                    //controller.invokeParentMethod('onSubmit', 1);
                    controller.invokeMethod('onSubmit', 2)
                }}
                text="Submit"
            />
        </div>
    </cx>
)