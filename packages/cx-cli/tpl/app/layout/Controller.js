import { Controller } from "cx/ui";

export default class extends Controller {
    onInit() {
        this.store.init("layout.aside.open", window.innerWidth >= 800);

        this.addTrigger("navigation", ["url"], () => {
            if (window.innerWidth < 800)
                this.store.set("layout.aside.open", false);
        });
    }

    onMainClick(e, { store }) {
        if (window.innerWidth < 800) store.set("layout.aside.open", false);
    }
}
