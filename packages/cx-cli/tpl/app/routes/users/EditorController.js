import { Controller, History } from "cx/ui";
import { getUser, postUser, deleteUser, putUser } from "./api";

export default class extends Controller {
    onInit() {
        //As Rescope is used $route params are available under $root.$route
        let userId = this.store.get("$root.$route.userId");

        if (userId == "new") {
            this.store.set("user", {
                display: "New User"
            });
        } else {
            getUser(userId).then(data => {
                this.store.set("user", data);
            });
        }
    }

    onSave() {
        let { invalid, user } = this.store.getData();

        let userId = this.store.get("$root.$route.userId");

        let promise = userId == "new" ? postUser(user) : putUser(userId, user);

        promise.then(() => {
            History.pushState({}, null, "~/users");
        });
    }

    onDelete() {
        let userId = this.store.get("$root.$route.userId");

        deleteUser(userId).then(() => {
            History.pushState({}, null, "~/users");
        });
    }
}
