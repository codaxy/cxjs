# Refactoring Examples

## Example 1: Migrating from FlexRow to Modern Layout

### Before (Outdated)
```javascript
import { FlexRow, TextField, Button } from 'cx/widgets';

export default <cx>
  <FlexRow spacing>
    <TextField value:bind="user.name" />
    <TextField value:bind="user.email" />
    <Button onClick="save">Save</Button>
  </FlexRow>
</cx>
```

### Prompt
```
/cxjs Refactor this to use modern layout patterns with TypeScript
```

### After (Modern with Tailwind)
```typescript
import { cx, TextField, Button } from 'cx/widgets';
import { bind } from 'cx/ui';

interface UserFormProps {
  onSave: () => void;
}

export const UserForm = ({ onSave }: UserFormProps) => (
  <cx>
    <div className="flex gap-4 items-center">
      <TextField value={bind("$page.user.name")} placeholder="Name" />
      <TextField value={bind("$page.user.email")} placeholder="Email" />
      <Button onClick={onSave} mod="primary">Save</Button>
    </div>
  </cx>
);
```

### After (Modern without Tailwind)
```typescript
import { cx, TextField, Button } from 'cx/widgets';
import { bind } from 'cx/ui';

interface UserFormProps {
  onSave: () => void;
}

export const UserForm = ({ onSave }: UserFormProps) => (
  <cx>
    <div
      className="user-form"
      styles="display: flex; gap: 1rem; align-items: center"
    >
      <TextField value={bind("$page.user.name")} placeholder="Name" />
      <TextField value={bind("$page.user.email")} placeholder="Email" />
      <Button onClick={onSave} mod="primary">Save</Button>
    </div>
  </cx>
);
```

## Example 2: Controller Refactoring to TypeScript

### Before (JavaScript)
```javascript
import { Controller } from 'cx/ui';

export class UserController extends Controller {
  onInit() {
    let user = this.store.get("user");
    this.store.set("displayName", user.firstName + " " + user.lastName);

    let year = new Date().getFullYear();
    let birthYear = new Date(user.birthDate).getFullYear();
    this.store.set("age", year - birthYear);
  }
}
```

### Prompt
```
/cxjs Convert this controller to TypeScript with computed values
```

### After (TypeScript with Computed Values)
```typescript
import { Controller } from 'cx/ui';

interface UserData {
  firstName: string;
  lastName: string;
  birthDate: string;
}

interface PageData {
  user: UserData;
  displayName?: string;
  age?: number;
}

export class UserController extends Controller {
  onInit() {
    // Computed display name
    this.store.init<string>(
      "$page.displayName",
      this.computable("$page.user", (user: UserData) => {
        if (!user) return "";
        return `${user.firstName} ${user.lastName}`.trim();
      })
    );

    // Computed age
    this.store.init<number>(
      "$page.age",
      this.computable("$page.user.birthDate", (birthDate: string) => {
        if (!birthDate) return 0;
        const birth = new Date(birthDate);
        const today = new Date();
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
          age--;
        }
        return age;
      })
    );
  }
}
```

## Example 3: Store Structure Refactoring

### Before (Flat Structure)
```javascript
store.init("data", {
  userName: "",
  userEmail: "",
  userPhone: "",
  productName: "",
  productPrice: 0,
  loading: false,
  error: null
});
```

### Prompt
```
/cxjs Improve this store structure with TypeScript and namespacing
```

### After (Namespaced with Types)
```typescript
interface User {
  name: string;
  email: string;
  phone: string;
}

interface Product {
  name: string;
  price: number;
}

interface PageState {
  user: User;
  product: Product;
  ui: {
    loading: boolean;
    error: string | null;
  };
}

// Initialize with proper structure
store.init<PageState>("$page", {
  user: {
    name: "",
    email: "",
    phone: ""
  },
  product: {
    name: "",
    price: 0
  },
  ui: {
    loading: false,
    error: null
  }
});

// Usage with typed bindings
<TextField value={bind("$page.user.name")} />
<NumberField value={bind("$page.product.price")} />
```

## Example 4: Extracting Reusable Components

### Before (Repeated Code)
```javascript
// In multiple forms...
<div>
  <TextField label="Email" value:bind="form.email" required
    validationRegExp={/^[^\s@]+@[^\s@]+\.[^\s@]+$/} />
</div>

<div>
  <TextField label="Email" value:bind="user.email" required
    validationRegExp={/^[^\s@]+@[^\s@]+\.[^\s@]+$/} />
</div>

<div>
  <TextField label="Email" value:bind="contact.email" required
    validationRegExp={/^[^\s@]+@[^\s@]+\.[^\s@]+$/} />
</div>
```

### Prompt
```
/cxjs Extract this into a reusable EmailField component with TypeScript
```

### After (Reusable Component)
```typescript
import { cx, TextField } from 'cx/widgets';
import { bind } from 'cx/ui';

interface EmailFieldProps {
  value: any; // Binding
  label?: string;
  required?: boolean;
  placeholder?: string;
  className?: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const EmailField = ({
  value,
  label = "Email",
  required = false,
  placeholder = "Enter email address",
  className
}: EmailFieldProps) => (
  <cx>
    <TextField
      value={value}
      label={label}
      required={required}
      placeholder={placeholder}
      validationRegExp={EMAIL_REGEX}
      validationErrorText="Please enter a valid email address"
      inputType="email"
      className={className}
    />
  </cx>
);

// Usage
<EmailField value={bind("$page.form.email")} required />
<EmailField value={bind("$page.user.email")} label="User Email" />
<EmailField value={bind("$page.contact.email")} />
```

## Example 5: Complex Expression to Computed Value

### Before (Inline Complex Logic)
```javascript
<div>
  <span text:expr="{user.firstName} + ' ' + {user.lastName}" />
  <span text:expr="new Date().getFullYear() - new Date({user.birthDate}).getFullYear()" />
  <span text:expr="{user.status} === 'active' ? 'Active User' : 'Inactive User'" />
</div>
```

### Prompt
```
/cxjs Move these complex expressions to a TypeScript controller
```

### After (Controller with Computed Values)
```typescript
import { Controller } from 'cx/ui';

interface UserData {
  firstName: string;
  lastName: string;
  birthDate: string;
  status: 'active' | 'inactive';
}

export class UserDisplayController extends Controller {
  onInit() {
    // Full name computed value
    this.store.init<string>(
      "$page.fullName",
      this.computable("$page.user", (user: UserData) => {
        if (!user) return "";
        return `${user.firstName} ${user.lastName}`.trim();
      })
    );

    // Age computed value
    this.store.init<number>(
      "$page.age",
      this.computable("$page.user.birthDate", (birthDate: string) => {
        if (!birthDate) return 0;
        const birth = new Date(birthDate);
        return new Date().getFullYear() - birth.getFullYear();
      })
    );

    // Status text computed value
    this.store.init<string>(
      "$page.statusText",
      this.computable("$page.user.status", (status: string) => {
        return status === 'active' ? 'Active User' : 'Inactive User';
      })
    );
  }
}

// Simplified component
<div>
  <UserDisplayController />
  <span text={bind("$page.fullName")} />
  <span text={bind("$page.age")} />
  <span text={bind("$page.statusText")} />
</div>
```

## Example 6: Grid Modernization

### Before (Basic Grid)
```javascript
<Grid
  records:bind="users"
  columns={[
    { field: "name", header: "Name" },
    { field: "email", header: "Email" }
  ]}
/>
```

### Prompt
```
/cxjs Modernize this grid with TypeScript, actions, and better layout
```

### After (Modern Grid)
```typescript
import { cx, Grid, Button } from 'cx/widgets';
import { bind } from 'cx/ui';

interface User {
  id: string;
  name: string;
  email: string;
  status: 'active' | 'inactive';
}

export const UserGrid = () => (
  <cx>
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Users</h1>
        <Button onClick="addUser" mod="primary" icon="plus">
          Add User
        </Button>
      </div>

      <Grid
        records={bind("$page.users")}
        columns={[
          {
            field: "name",
            header: "Name",
            sortable: true,
            minWidth: 200
          },
          {
            field: "email",
            header: "Email",
            sortable: true,
            minWidth: 250
          },
          {
            field: "status",
            header: "Status",
            sortable: true,
            minWidth: 120,
            style: (value) => ({
              color: value === 'active' ? 'green' : 'gray'
            })
          },
          {
            header: "Actions",
            align: "center",
            minWidth: 150,
            items: (
              <cx>
                <div className="flex gap-2 justify-center">
                  <Button
                    onClick="editUser"
                    mod="hollow"
                    icon="edit"
                    tooltip="Edit User"
                  />
                  <Button
                    onClick="deleteUser"
                    mod="hollow"
                    icon="delete"
                    confirm="Are you sure you want to delete this user?"
                    tooltip="Delete User"
                  />
                </div>
              </cx>
            )
          }
        ]}
        scrollable
        buffered
        style={{ height: "600px" }}
        emptyText="No users found"
      />
    </div>
  </cx>
);
```
