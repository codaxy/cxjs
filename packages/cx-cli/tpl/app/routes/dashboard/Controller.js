import { Controller } from "cx/ui";

export default class extends Controller {
    onInit() {
        this.store.init("bars", [
            {
                day: "Mo",
                value: 500,
                colorIndex: 12
            },
            {
                day: "Tu",
                value: 900,
                colorIndex: 9
            },
            {
                day: "We",
                value: 850,
                colorIndex: 10
            },
            {
                day: "Th",
                value: 950,
                colorIndex: 9
            },
            {
                day: "Fr",
                value: 1000,
                colorIndex: 8
            }
        ]);
    }
}
