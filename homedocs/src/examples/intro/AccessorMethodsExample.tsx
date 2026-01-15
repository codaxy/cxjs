import { createModel } from "cx/data";

// @model
interface User {
  firstName: string;
  lastName: string;
  email: string;
}

interface PageModel {
  user: User;
  count: number;
}

const m = createModel<PageModel>();
// @model-end

// @index
export default () => (
  <table class="w-full text-sm">
    <thead>
      <tr>
        <th class="text-left py-2 pr-4 border-b border-border">Accessor</th>
        <th class="text-left py-2 border-b border-border">Result</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="py-2 pr-4">
          <code class="text-primary">m.user.firstName.toString()</code>
        </td>
        <td class="py-2">
          <code>"{m.user.firstName.toString()}"</code>
        </td>
      </tr>
      <tr>
        <td class="py-2 pr-4">
          <code class="text-primary">m.user.email.toString()</code>
        </td>
        <td class="py-2">
          <code>"{m.user.email.toString()}"</code>
        </td>
      </tr>
      <tr>
        <td class="py-2 pr-4">
          <code class="text-primary">m.count.toString()</code>
        </td>
        <td class="py-2">
          <code>"{m.count.toString()}"</code>
        </td>
      </tr>
      <tr>
        <td class="py-2 pr-4">
          <code class="text-primary">m.user.lastName.nameOf()</code>
        </td>
        <td class="py-2">
          <code>"{m.user.lastName.nameOf()}"</code>
        </td>
      </tr>
      <tr>
        <td class="py-2 pr-4">
          <code class="text-primary">m.count.nameOf()</code>
        </td>
        <td class="py-2">
          <code>"{m.count.nameOf()}"</code>
        </td>
      </tr>
    </tbody>
  </table>
);
// @index-end
