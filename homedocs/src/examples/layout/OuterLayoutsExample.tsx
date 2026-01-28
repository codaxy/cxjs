import { ContentPlaceholder, Content } from "cx/ui";

// @components
const AppLayout = (
  <div class="border rounded overflow-hidden">
    <header class="bg-primary text-primary-foreground p-3">App Header</header>
    <div class="flex">
      <aside class="w-32 bg-muted p-3">
        <ContentPlaceholder name="sidebar" />
      </aside>
      <main class="flex-1 p-3">
        <ContentPlaceholder />
      </main>
    </div>
  </div>
);
// @components-end

// @index
export default (
  <div outerLayout={AppLayout}>
    <Content for="sidebar">
      <nav class="flex flex-col gap-2 text-sm">
        <a href="#">Dashboard</a>
        <a href="#">Settings</a>
        <a href="#">Profile</a>
      </nav>
    </Content>
    <div>
      <h2 class="text-lg font-semibold mb-2">Welcome</h2>
      <p class="text-sm text-muted-foreground">
        This is the main content area.
      </p>
    </div>
  </div>
);
// @index-end
