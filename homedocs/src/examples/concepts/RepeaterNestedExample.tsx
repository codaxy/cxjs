import { createModel } from "cx/data";
import { Controller } from "cx/ui";
import { Repeater } from "cx/widgets";

// @model
interface Transaction {
  id: number;
  description: string;
  amount: number;
}

interface Account {
  name: string;
  transactions: Transaction[];
}

interface PageModel {
  accounts: Account[];
  $account: Account;
  $transaction: Transaction;
}

const m = createModel<PageModel>();
// @model-end

// @controller
class PageController extends Controller {
  onInit() {
    this.store.init(m.accounts, [
      {
        name: "Checking",
        transactions: [
          { id: 1, description: "Groceries", amount: -85.5 },
          { id: 2, description: "Salary", amount: 3500 },
          { id: 3, description: "Electric bill", amount: -120 },
        ],
      },
      {
        name: "Savings",
        transactions: [
          { id: 4, description: "Transfer in", amount: 500 },
          { id: 5, description: "Interest", amount: 12.5 },
        ],
      },
    ]);
  }
}
// @controller-end

// @index
export default () => (
  <div class="flex flex-col gap-4" controller={PageController}>
    <Repeater records={m.accounts} recordAlias={m.$account}>
      <div class="border rounded p-3">
        <div class="font-medium mb-2 leading-none" text={m.$account.name} />
        <Repeater
          records={m.$account.transactions}
          recordAlias={m.$transaction}
        >
          <div class="flex justify-between text-sm py-1 border-b last:border-b-0">
            <span text={m.$transaction.description} />
            <span text={m.$transaction.amount} />
          </div>
        </Repeater>
      </div>
    </Repeater>
  </div>
);
// @index-end
