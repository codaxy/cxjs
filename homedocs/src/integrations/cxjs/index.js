/**
 * @type {() => import('astro').AstroIntegration}
 */
export default function cxjs() {
  return {
    name: "@cxjs/astro",
    hooks: {
      "astro:config:setup": ({ addRenderer, updateConfig }) => {
        addRenderer({
          name: "@cxjs/astro",
          serverEntrypoint: new URL("./server.jsx", import.meta.url).href,
          clientEntrypoint: new URL("./client.jsx", import.meta.url).href,
          jsxImportSource: "cx",
        });

        updateConfig({
          vite: {
            ssr: {
              noExternal: ["cx"],
            },
          },
        });
      },
    },
  };
}
