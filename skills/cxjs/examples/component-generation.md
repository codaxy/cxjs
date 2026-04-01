# Component Generation Examples

## Example 1: TypeScript Form Component

**Prompt:**
```
/cxjs Generate a user registration form with validation in TypeScript
```

**Expected Output:**
A modern TypeScript form component with:
- Type-safe props and data interfaces
- Email and password validation
- Tailwind classes (if available) or modern CSS
- Proper error handling
- Store integration with typed bindings

**Sample Generated Code:**
```typescript
import { cx, TextField, Button } from 'cx/widgets';
import { bind, expr } from 'cx/ui';

interface RegistrationFormProps {
  onSubmit: () => void;
}

interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
}

export const RegistrationForm = ({ onSubmit }: RegistrationFormProps) => (
  <cx>
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Register</h2>
      <form className="space-y-4">
        <TextField
          label="Email"
          value={bind("$page.form.email")}
          required
          validationRegExp={/^[^\s@]+@[^\s@]+\.[^\s@]+$/}
          validationErrorText="Please enter a valid email"
        />
        <TextField
          label="Password"
          value={bind("$page.form.password")}
          required
          inputType="password"
          minLength={8}
          validationErrorText="Password must be at least 8 characters"
        />
        <TextField
          label="Confirm Password"
          value={bind("$page.form.confirmPassword")}
          required
          inputType="password"
          validationErrorText="Passwords must match"
        />
        <Button onClick={onSubmit} mod="primary" className="w-full">
          Register
        </Button>
      </form>
    </div>
  </cx>
);
```

## Example 2: TypeScript Grid with CRUD

**Prompt:**
```
/cxjs Create a Grid component with CRUD operations for managing products in TypeScript
```

**Expected Output:**
- TypeScript Grid component
- Proper type interfaces for Product data
- Add/Edit/Delete operations
- Controller for API integration
- Tailwind or modern CSS layout
- Error handling and loading states

**Sample Generated Code:**
```typescript
import { cx, Grid, Button, TextField, Window } from 'cx/widgets';
import { bind, expr, Controller } from 'cx/ui';

interface Product {
  id: string;
  name: string;
  price: number;
  status: 'active' | 'inactive';
}

export class ProductController extends Controller {
  async onInit() {
    await this.loadProducts();
  }

  async loadProducts() {
    try {
      this.store.set("$page.loading", true);
      const response = await fetch("/api/products");
      const products = await response.json();
      this.store.set("$page.products", products);
    } catch (error) {
      this.store.set("$page.error", error.message);
    } finally {
      this.store.set("$page.loading", false);
    }
  }
}

export const ProductGrid = () => (
  <cx>
    <ProductController />
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Products</h1>
        <Button onClick="add" mod="primary" icon="plus">
          Add Product
        </Button>
      </div>

      <Grid
        records={bind("$page.products")}
        loading={bind("$page.loading")}
        columns={[
          { field: "name", header: "Name", sortable: true },
          { field: "price", header: "Price", sortable: true, format: "currency;USD;2" },
          { field: "status", header: "Status", sortable: true },
          {
            header: "Actions",
            align: "center",
            items: (
              <cx>
                <div className="flex gap-2 justify-center">
                  <Button onClick="edit" mod="hollow" icon="edit" />
                  <Button onClick="delete" mod="hollow" icon="delete" confirm="Delete?" />
                </div>
              </cx>
            )
          }
        ]}
        scrollable
        buffered
        style={{ height: "600px" }}
      />
    </div>
  </cx>
);
```

## Example 3: TypeScript Custom Widget

**Prompt:**
```
/cxjs Create a custom StatusBadge widget in TypeScript that shows different colors based on status
```

**Expected Output:**
- Custom widget extending Widget base class
- TypeScript interface for props
- Conditional styling
- Type definition file
- Usage example

**Sample Generated Code:**
```typescript
import { Widget } from 'cx/ui';

interface StatusBadgeProps {
  status: 'success' | 'warning' | 'error' | 'info';
  text?: string;
  className?: string;
}

export class StatusBadge extends Widget {
  declareData() {
    super.declareData(...arguments, {
      status: undefined,
      text: undefined
    });
  }

  render(context, instance, key) {
    const { data } = instance;
    const statusColors = {
      success: 'bg-green-100 text-green-800',
      warning: 'bg-yellow-100 text-yellow-800',
      error: 'bg-red-100 text-red-800',
      info: 'bg-blue-100 text-blue-800'
    };

    return (
      <span
        key={key}
        className={`px-2 py-1 rounded text-sm font-medium ${statusColors[data.status]}`}
      >
        {data.text || data.status}
      </span>
    );
  }
}

// Usage
<StatusBadge status="success" text="Active" />
```

## Example 4: TypeScript Controller with API Integration

**Prompt:**
```
/cxjs Create a controller that fetches user data and computes full name
```

**Expected Output:**
- TypeScript controller with proper types
- API integration with error handling
- Computed values
- Type-safe store operations

**Sample Generated Code:**
```typescript
import { Controller } from 'cx/ui';

interface UserData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface PageData {
  user: UserData;
  fullName?: string;
  loading: boolean;
  error?: string;
}

export class UserController extends Controller {
  onInit() {
    this.loadUser();

    // Computed full name
    this.store.init<string>(
      "$page.fullName",
      this.computable("$page.user", (user: UserData) => {
        if (!user) return "";
        return `${user.firstName} ${user.lastName}`.trim();
      })
    );
  }

  async loadUser() {
    try {
      this.store.set("$page.loading", true);
      this.store.delete("$page.error");

      const userId = this.store.get("$route.userId");
      const response = await fetch(`/api/users/${userId}`);

      if (!response.ok) {
        throw new Error(`Failed to load user: ${response.statusText}`);
      }

      const user = await response.json();
      this.store.set("$page.user", user);
    } catch (error) {
      this.store.set("$page.error", error.message);
    } finally {
      this.store.set("$page.loading", false);
    }
  }
}
```
