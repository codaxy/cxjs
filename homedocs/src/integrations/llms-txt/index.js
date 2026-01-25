import { readFile, writeFile, access } from "node:fs/promises";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";
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
        const srcDir = join(process.cwd(), "src/pages");

        // Generate ordered page list from navigation
        const allPages = [];
        const smallPages = [];
        for (const category of navigation) {
          for (const group of category.groups) {
            for (const item of group.items) {
              const pageInfo = {
                path: `docs/${category.slug}/${item.slug}`,
                title: item.title,
                description: item.description || "",
                category: category.title,
                group: group.title,
              };
              allPages.push(pageInfo);
              if (item.llms === "small") {
                smallPages.push(pageInfo);
              }
            }
          }
        }

        // Generate full documentation file
        const fullContent = await generateDocContent(allPages, srcDir, false);
        await writeFile(
          join(distDir, "llms-full.txt"),
          `<SYSTEM>${description}</SYSTEM>\n\n${fullContent}`,
          "utf-8",
        );
        console.log("✅ llms-full.txt generated");

        // Generate small documentation file (only llms: 'small' entries, full content)
        const smallContent = await generateDocContent(smallPages, srcDir, false);
        await writeFile(
          join(distDir, "llms-small.txt"),
          `<SYSTEM>${description} (Key articles only)</SYSTEM>\n\n${smallContent}`,
          "utf-8",
        );
        console.log("✅ llms-small.txt generated");

        // Generate navigation index
        const navIndex = generateNavigationIndex(site);

        // Generate main llms.txt index
        const indexContent = `# ${title}

> ${description}

## Documentation Sets

- [Complete Documentation](${site}/llms-full.txt): Full CxJS documentation including all guides and API references
- [Key Documentation](${site}/llms-small.txt): Essential CxJS documentation for getting started

## Notes

- This content is auto-generated from the official CxJS documentation.
- Pages are ordered according to the documentation navigation structure.

${navIndex}`;

        await writeFile(join(distDir, "llms.txt"), indexContent, "utf-8");
        console.log("✅ llms.txt generated");
      },
    },
  };
}

/**
 * Generate navigation index with links and descriptions grouped by category
 * @param {string} site - Site URL
 * @returns {string} Markdown navigation index
 */
function generateNavigationIndex(site) {
  const sections = [];

  for (const category of navigation) {
    const categoryLines = [`### ${category.title}`];

    for (const group of category.groups) {
      categoryLines.push(`\n#### ${group.title}`);

      for (const item of group.items) {
        const url = `${site}/docs/${category.slug}/${item.slug}`;
        const description = item.description ? `: ${item.description}` : "";
        categoryLines.push(`- [${item.title}](${url})${description}`);
      }
    }

    sections.push(categoryLines.join("\n"));
  }

  return `## Documentation Pages\n\n${sections.join("\n\n")}`;
}

/**
 * Generate documentation content from ordered pages
 * @param {Array} orderedPages - Array of page objects with path and metadata
 * @param {string} srcDir - Source pages directory path
 * @param {boolean} onlyStructure - If true, only include headings
 * @returns {Promise<string>} Generated markdown content
 */
async function generateDocContent(orderedPages, srcDir, onlyStructure) {
  const entries = [];
  let skippedCount = 0;

  for (const page of orderedPages) {
    const mdxPath = join(srcDir, `${page.path}.mdx`);

    try {
      await access(mdxPath);
      const content = await extractMdxContent(mdxPath, srcDir, onlyStructure);
      entries.push(content);
    } catch (error) {
      // Silently skip pages that don't exist (they may be in navigation but not implemented yet)
      skippedCount++;
    }
  }

  if (skippedCount > 0) {
    console.log(
      `ℹ️  Skipped ${skippedCount} pages from navigation that don't exist yet`,
    );
  }

  return entries.join("\n\n---\n\n");
}

/**
 * Extract content from an MDX file
 * @param {string} mdxPath - Path to MDX file
 * @param {string} srcDir - Source directory for resolving imports
 * @param {boolean} onlyStructure - If true, only extract headings
 * @returns {Promise<string>} Extracted markdown content
 */
async function extractMdxContent(mdxPath, srcDir, onlyStructure) {
  const mdxContent = await readFile(mdxPath, "utf-8");
  const { data: frontmatter, content } = matter(mdxContent);

  // Extract title from frontmatter
  const title = frontmatter.title || "Untitled";

  // Parse imports to find ?raw imports
  const rawImports = {};
  const importRegex = /import\s+(\w+)\s+from\s+["'](.+?)\?raw["'];?/g;
  let match;
  while ((match = importRegex.exec(content)) !== null) {
    const [, varName, importPath] = match;
    rawImports[varName] = importPath;
  }

  let processedContent = content;

  // Replace CodeExample components with actual code blocks
  if (!onlyStructure && Object.keys(rawImports).length > 0) {
    const codeExampleRegex =
      /<CodeExample\s+code=\{(\w+)\}[^>]*>[\s\S]*?<\/CodeExample>/g;

    processedContent = await replaceAsync(
      processedContent,
      codeExampleRegex,
      async (match, varName) => {
        if (rawImports[varName]) {
          const codeFilePath = resolveImportPath(mdxPath, rawImports[varName]);
          try {
            const code = await readFile(codeFilePath, "utf-8");

            // Filter out section marker lines
            const filteredCode = code
              .split("\n")
              .filter(
                (line) =>
                  !line
                    .trim()
                    .match(
                      /^\/\/\s*@(model|controller|components|index)(-end)?$/,
                    ),
              )
              .join("\n");

            return "```tsx\n" + filteredCode + "\n```";
          } catch (error) {
            console.warn(`⚠️  Could not read code file: ${codeFilePath}`);
            return match; // Keep original if file not found
          }
        }
        return match;
      },
    );
  }

  // Remove import statements from MDX (but NOT from code blocks)
  // Split by code blocks, remove imports from non-code parts only
  const codeBlockRegex = /(```[\s\S]*?```)/g;
  const contentParts = processedContent.split(codeBlockRegex);
  processedContent = contentParts
    .map((part, index) => {
      // Even indices are non-code, odd indices are code blocks
      if (index % 2 === 0) {
        // Remove import statements only from non-code parts
        return part.replace(/import\s+[\s\S]*?from\s+["'][^"']+["'];?\s*/g, "");
      }
      return part; // Keep code blocks unchanged
    })
    .join("");

  // Remove frontmatter section if still present
  processedContent = processedContent.replace(/^---[\s\S]*?---\s*/m, "");

  // If only structure, keep only headings
  if (onlyStructure) {
    const lines = processedContent.split("\n");
    const headings = lines.filter((line) => line.match(/^#+\s/));
    processedContent = headings.join("\n");
  }

  // Build final output
  const parts = [];

  // Only add title if it's not already in the content
  if (!processedContent.trim().startsWith(`# ${title}`)) {
    parts.push(`# ${title}`);
  }

  if (processedContent.trim()) {
    parts.push(processedContent.trim());
  }

  return parts.join("\n\n");
}

/**
 * Resolve import path relative to the MDX file
 * @param {string} mdxPath - Path to the MDX file
 * @param {string} importPath - Relative import path from the MDX file
 * @returns {string} Resolved absolute path
 */
function resolveImportPath(mdxPath, importPath) {
  const mdxDir = dirname(mdxPath);
  return resolve(mdxDir, importPath);
}

/**
 * Async version of String.replace() for async callbacks
 * @param {string} str - Input string
 * @param {RegExp} regex - Regular expression
 * @param {Function} asyncFn - Async replacement function
 * @returns {Promise<string>} Replaced string
 */
async function replaceAsync(str, regex, asyncFn) {
  const matches = [];
  let match;
  const re = new RegExp(regex, regex.flags);

  while ((match = re.exec(str)) !== null) {
    matches.push({ match: match[0], index: match.index, args: match.slice(1) });
  }

  const replacements = await Promise.all(
    matches.map((m) => asyncFn(m.match, ...m.args)),
  );

  let result = str;
  for (let i = matches.length - 1; i >= 0; i--) {
    const { index, match } = matches[i];
    result =
      result.substring(0, index) +
      replacements[i] +
      result.substring(index + match.length);
  }

  return result;
}
