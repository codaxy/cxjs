import { readFile, writeFile, access, mkdir } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { JSDOM } from "jsdom";
import { unified } from "unified";
import rehypeParse from "rehype-parse";
import rehypeRemark from "rehype-remark";
import remarkStringify from "remark-stringify";
import remarkGfm from "remark-gfm";
import { navigation } from "../../data/navigation.js";

/**
 * Custom Astro integration for generating llms.txt files with navigation-based ordering
 * @param {Object} options - Configuration options
 * @param {string} options.title - Title for the llms.txt
 * @param {string} options.description - Description of the documentation
 * @param {string} options.site - Site URL
 * @returns {import('astro').AstroIntegration}
 */
export default function llmsTxt(options = {}) {
  const { title = "Documentation", description = "", site = "" } = options;

  return {
    name: "llms-txt",
    hooks: {
      "astro:build:done": async ({ dir, pages }) => {
        const distDir = fileURLToPath(dir);

        // Generate ordered page list from navigation
        const orderedPages = [];
        for (const category of navigation) {
          for (const group of category.groups) {
            for (const item of group.items) {
              const pagePath = `docs/${category.slug}/${item.slug}`;
              orderedPages.push({
                path: pagePath,
                title: item.title,
                category: category.title,
                group: group.title,
              });
            }
          }
        }

        // Generate full documentation file
        const fullContent = await generateDocContent(
          orderedPages,
          distDir,
          false
        );
        await writeFile(
          join(distDir, "llms-full.txt"),
          `<SYSTEM>${description}</SYSTEM>\n\n${fullContent}`,
          "utf-8"
        );
        console.log("✅ llms-full.txt generated");

        // Generate structure-only file
        const smallContent = await generateDocContent(orderedPages, distDir, true);
        await writeFile(
          join(distDir, "llms-small.txt"),
          `<SYSTEM>Index of key documentation pages and sections</SYSTEM>\n\n${smallContent}`,
          "utf-8"
        );
        console.log("✅ llms-small.txt generated");

        // Generate main llms.txt index
        const indexContent = `# ${title}

> ${description}

## Documentation Sets

- [Complete Documentation](${site}/llms-full.txt): Full CxJS documentation including all guides and API references
- [Documentation Structure](${site}/llms-small.txt): Index of key documentation pages and sections

## Notes

- This content is auto-generated from the official CxJS documentation.
- Pages are ordered according to the documentation navigation structure.`;

        await writeFile(join(distDir, "llms.txt"), indexContent, "utf-8");
        console.log("✅ llms.txt generated");
      },
    },
  };
}

/**
 * Generate documentation content from ordered pages
 * @param {Array} orderedPages - Array of page objects with path and metadata
 * @param {string} distDir - Distribution directory path
 * @param {boolean} onlyStructure - If true, only include headings
 * @returns {Promise<string>} Generated markdown content
 */
async function generateDocContent(orderedPages, distDir, onlyStructure) {
  const entries = [];
  let skippedCount = 0;

  for (const page of orderedPages) {
    const htmlPath = join(distDir, page.path, "index.html");

    try {
      await access(htmlPath);
      const content = await extractPageContent(htmlPath, onlyStructure);
      entries.push(content);
    } catch (error) {
      // Silently skip pages that don't exist (they may be in navigation but not implemented yet)
      skippedCount++;
    }
  }

  if (skippedCount > 0) {
    console.log(`ℹ️  Skipped ${skippedCount} pages from navigation that don't exist yet`);
  }

  return entries.join("\n\n---\n\n");
}

/**
 * Extract content from an HTML file
 * @param {string} htmlPath - Path to HTML file
 * @param {boolean} onlyStructure - If true, only extract headings
 * @returns {Promise<string>} Extracted markdown content
 */
async function extractPageContent(htmlPath, onlyStructure) {
  const html = await readFile(htmlPath, "utf-8");
  const dom = new JSDOM(html);
  const doc = dom.window.document;

  // Get main content
  const main = doc.querySelector("main");
  if (!main) {
    throw new Error(`No <main> element found in ${htmlPath}`);
  }

  // Extract and remove h1 for separate handling
  const h1 = main.querySelector("h1");
  const title = h1?.textContent?.trim() || "Untitled";
  if (h1) h1.remove();

  // Get meta description
  const metaDesc = doc
    .querySelector('meta[name="description"]')
    ?.getAttribute("content")
    ?.trim();

  // Remove unwanted elements
  const selectorsToRemove = ["nav", "footer", "header", ".toc"];
  for (const selector of selectorsToRemove) {
    const elements = main.querySelectorAll(selector);
    elements.forEach((el) => el.remove());
  }

  // Convert HTML to Markdown
  let markdown = await htmlToMarkdown(main.innerHTML);

  // If only structure, keep only headings
  if (onlyStructure) {
    const lines = markdown.split("\n");
    const headings = lines.filter((line) => line.match(/^#+\s/));
    markdown = headings.join("\n");
  }

  // Build final output
  const parts = [`# ${title}`];
  if (metaDesc && !onlyStructure) {
    parts.push(`> ${metaDesc}`);
  }
  if (markdown.trim()) {
    parts.push(markdown.trim());
  }

  return parts.join("\n\n");
}

/**
 * Convert HTML to Markdown using unified/rehype/remark
 * @param {string} html - HTML content
 * @returns {Promise<string>} Markdown content
 */
async function htmlToMarkdown(html) {
  const file = await unified()
    .use(rehypeParse)
    .use(rehypeRemark)
    .use(remarkGfm)
    .use(remarkStringify, {
      bullet: "-",
      fence: "`",
      fences: true,
      incrementListMarker: false,
    })
    .process(html);

  return String(file);
}
