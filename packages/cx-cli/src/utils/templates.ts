import path from "path";
import fs from "fs-extra";
import extract from "extract-zip";
import { fileURLToPath } from "url";
import type { TemplatesManifest } from "../types/templates.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Load template configuration from app-templates.json
 */
export async function loadTemplateConfig(): Promise<TemplatesManifest> {
  // In bundled code, __dirname is dist/, so we go up one level to project root
  const configPath = path.join(__dirname, "..", "app-templates.json");
  const content = await fs.readFile(configPath, "utf-8");
  return JSON.parse(content);
}

/**
 * Download template from URL using native fetch API
 */
export async function downloadTemplate(
  url: string,
  destPath: string
): Promise<void> {
  const response = await fetch(url, {
    redirect: "follow",
    signal: AbortSignal.timeout(30000), // 30s timeout
  });

  if (!response.ok) {
    throw new Error(
      `Failed to download template: ${response.status} ${response.statusText}`
    );
  }

  const buffer = await response.arrayBuffer();
  await fs.writeFile(destPath, Buffer.from(buffer));
}

/**
 * Extract ZIP template to target directory
 */
export async function extractZipTemplate(
  zipPath: string,
  targetDir: string,
  srcFolder: string,
  projectName: string
): Promise<void> {
  const parentDir = path.dirname(targetDir);

  // Extract to parent directory
  await extract(zipPath, { dir: parentDir });

  // Rename from srcFolder to projectName
  const extractedPath = path.join(parentDir, srcFolder);
  if (!(await fs.pathExists(extractedPath))) {
    throw new Error(`Expected folder "${srcFolder}" not found in ZIP`);
  }

  await fs.rename(extractedPath, targetDir);
  await fs.unlink(zipPath);
}

/**
 * Read package.json scripts from project directory
 */
export async function readPackageScripts(
  projectPath: string
): Promise<Record<string, string> | null> {
  try {
    const pkgPath = path.join(projectPath, "package.json");
    const pkg = await fs.readJson(pkgPath);
    return pkg.scripts || null;
  } catch {
    return null;
  }
}
