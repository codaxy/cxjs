export class ResizeManager {
   static subscribe(callback: () => void): () => void;

   static notify(): void;

   static trackElement(
      el: Element,
      callback: (entries: ResizeObserverEntry[], observer: ResizeObserver) => void,
   ): () => void;
}
