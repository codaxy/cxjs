import { merge, updateArray, createModel } from "cx/data";
import { Controller, KeySelection } from "cx/ui";
import { Button, Grid, NumberField } from "cx/widgets";

// @model
interface User {
  id: number;
  name: string;
  score: number;
  level: number;
}

interface Model {
  users: User[];
  selectedId: number;
  bonusPoints: number;
}

const m = createModel<Model>();
// @model-end

// @controller
class PageController extends Controller {
  onInit() {
    this.store.set(m.users, [
      { id: 1, name: "Alice", score: 100, level: 1 },
      { id: 2, name: "Bob", score: 150, level: 2 },
      { id: 3, name: "Carol", score: 80, level: 1 },
    ]);
    this.store.set(m.selectedId, 1);
    this.store.set(m.bonusPoints, 50);
  }

  addBonus() {
    const selectedId = this.store.get(m.selectedId);
    const bonus = this.store.get(m.bonusPoints);

    this.store.update(m.users, (users) =>
      updateArray(
        users,
        (user) => merge(user, { score: user.score + bonus }),
        (user) => user.id === selectedId,
      ),
    );
  }

  levelUp() {
    const selectedId = this.store.get(m.selectedId);

    this.store.update(m.users, (users) =>
      updateArray(
        users,
        (user) => merge(user, { level: user.level + 1 }),
        (user) => user.id === selectedId,
      ),
    );
  }

  reset() {
    this.onInit();
  }
}
// @controller-end

// @index
export default (
  <div controller={PageController}>
    <Grid
      records={m.users}
      selection={{ type: KeySelection, bind: m.selectedId, keyField: "id" }}
      columns={[
        { header: "Name", field: "name" },
        { header: "Score", field: "score", align: "right" },
        { header: "Level", field: "level", align: "center" },
      ]}
    />
    <div style="margin-top: 16px; display: flex; gap: 8px; align-items: center; flex-wrap: wrap">
      <NumberField value={m.bonusPoints} style="width: 80px" />
      <Button onClick="addBonus">Add Bonus</Button>
      <Button onClick="levelUp">Level Up</Button>
      <Button onClick="reset">Reset</Button>
    </div>
  </div>
);
// @index-end
