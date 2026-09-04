import { createPortal } from "react-dom";
import { useEffect, useRef, useState } from "react";

function copyStyles(sourceDoc, targetDoc) {
   Array.from(sourceDoc.styleSheets).forEach((styleSheet) => {
      try {
         if (styleSheet.href) {
            let link = targetDoc.createElement("link");
            link.rel = "stylesheet";
            link.href = styleSheet.href;
            targetDoc.head.appendChild(link);
         } else if (styleSheet.ownerNode && styleSheet.ownerNode.textContent) {
            // dev builds inject theme/widget CSS as inline <style> tags (style-loader),
            // which have no .href, so clone the tag's contents instead
            let style = targetDoc.createElement("style");
            style.textContent = styleSheet.ownerNode.textContent;
            targetDoc.head.appendChild(style);
         }
      } catch (err) {
         console.warn("IFramePortal: could not copy stylesheet", err);
      }
   });
}

// Renders `children` inside a same-origin iframe via a React portal, while the
// <iframe> element itself stays a normal sibling in the outer document's DOM/layout.
// Single React tree, single JS realm - only the DOM output is split across two
// documents. This mirrors iframe-based style isolation helpers (e.g. react-frame-component).
export const IFramePortal = ({ children, style }) => {
   let iframeRef = useRef(null);
   let [containerEl, setContainerEl] = useState(null);

   useEffect(() => {
      let iframeEl = iframeRef.current;

      function handleLoad() {
         let doc = iframeEl.contentDocument;
         doc.body.style.margin = "0";
         let container = doc.createElement("div");
         doc.body.appendChild(container);
         copyStyles(document, doc);
         setContainerEl(container);
      }

      if (iframeEl.contentDocument.readyState === "complete") handleLoad();
      else iframeEl.addEventListener("load", handleLoad);

      return () => iframeEl.removeEventListener("load", handleLoad);
   }, []);

   return (
      <div>
         <iframe ref={iframeRef} style={style} />
         {containerEl && createPortal(children, containerEl)}
      </div>
   );
};
