//IE sometimes returns null while other browsers always return document.body.
export function getActiveElement(doc?: Document): Element {
   if (!doc) doc = document;
   let active = doc?.activeElement ?? doc?.body;

   //when focus is inside a same-origin iframe, `doc.activeElement` only reports the
   //<iframe> element itself - drill into its own document to find the element that's
   //actually focused there (recursively, in case of nested iframes)
   if (active && active.tagName === "IFRAME") {
      const iframe = active as HTMLIFrameElement;
      let frameDoc = iframe.contentDocument;
      if (frameDoc) return getActiveElement(frameDoc);
   }

   return active;
}
