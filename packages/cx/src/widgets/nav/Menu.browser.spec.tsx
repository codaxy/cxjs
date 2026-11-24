import "../../index.scss";
import { describe, expect, it } from "vitest";
import { userEvent } from "vitest/browser";
import { Menu } from "./Menu";
import { Submenu } from "./Submenu";
import { MenuItem } from "./MenuItem";
import { render, RenderResult } from "../../util/test/render";

describe("Menu keyboard navigation", () => {
   async function setup() {
      let clicked: string[] = [];
      let item = (text: string) => (
         <MenuItem onClick={() => clicked.push(text)} autoClose>
            {text}
         </MenuItem>
      );
      let screen = await render(
         <cx>
            <Menu horizontal>
               <Submenu arrow>
                  File
                  <Menu putInto="dropdown">
                     {item("New")}
                     <Submenu arrow>
                        Recent
                        <Menu putInto="dropdown">
                           {item("Report")}
                           {item("Budget")}
                        </Menu>
                     </Submenu>
                  </Menu>
               </Submenu>
               {item("Help")}
            </Menu>
         </cx>,
      );
      return { screen, clicked };
   }

   function menuItem(screen: RenderResult, text: string) {
      return screen.getByText(text, { exact: true }).element().closest(".cxb-menuitem") as HTMLElement;
   }

   // menu items with a dropdown open it on focus (openOnFocus), so the keys must also work when it is already open
   it("moves the focus into submenus with the arrow keys (#994)", async () => {
      let { screen, clicked } = await setup();
      menuItem(screen, "File").focus();

      await userEvent.keyboard("{ArrowDown}");
      await expect.poll(() => document.activeElement).toBe(menuItem(screen, "New"));

      await userEvent.keyboard("{ArrowDown}");
      await expect.poll(() => document.activeElement).toBe(menuItem(screen, "Recent"));

      await userEvent.keyboard("{ArrowRight}");
      await expect.poll(() => document.activeElement).toBe(menuItem(screen, "Report"));

      await userEvent.keyboard("{ArrowDown}");
      await expect.poll(() => document.activeElement).toBe(menuItem(screen, "Budget"));

      await userEvent.keyboard("{Enter}");
      await expect.poll(() => clicked).toEqual(["Budget"]);
   });

   it("moves the focus back to the parent item with the opposite arrow key", async () => {
      let { screen } = await setup();
      menuItem(screen, "File").focus();

      await userEvent.keyboard("{ArrowDown}");
      await userEvent.keyboard("{ArrowDown}");
      await userEvent.keyboard("{ArrowRight}");
      await expect.poll(() => document.activeElement).toBe(menuItem(screen, "Report"));

      await userEvent.keyboard("{ArrowLeft}");
      await expect.poll(() => document.activeElement).toBe(menuItem(screen, "Recent"));

      await userEvent.keyboard("{ArrowUp}");
      await expect.poll(() => document.activeElement).toBe(menuItem(screen, "New"));

      await userEvent.keyboard("{ArrowUp}");
      await expect.poll(() => document.activeElement).toBe(menuItem(screen, "File"));
   });
});
