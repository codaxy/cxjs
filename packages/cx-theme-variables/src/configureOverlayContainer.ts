import { closest } from "cx/util";
import { ConfigureOverlayContainerContext } from "cx/widgets";

export function configureOverlayContainer(
   containerEl: HTMLElement,
   context: ConfigureOverlayContainerContext,
) {
   let { relatedElement } = context;
   if (!relatedElement && context.initiatingEvent?.target)
      relatedElement =
         closest(
            context.initiatingEvent?.target as HTMLElement,
            (x) => x instanceof HTMLElement,
         ) ?? undefined;
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
