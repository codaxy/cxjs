import { ConfigureOverlayContainerContext } from "cx/widgets";

export function configureOverlayContainer(
   containerEl: HTMLElement,
   context: ConfigureOverlayContainerContext
) {
   let { relatedElement } = context;
   if (!relatedElement) return;
   let el: HTMLElement | null = relatedElement;
   while (el) {
      if (el.dataset?.themeContainerClass) {
         containerEl.classList.add(el.dataset.themeContainerClass);
         return;
      }
      el = el.parentElement;
   }
}
