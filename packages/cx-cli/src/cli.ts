import { Command } from "commander";
import { create } from "./commands/create.js";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load version from package.json
const packageJsonPath = path.join(__dirname, "..", "package.json");
const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf-8"));

const program = new Command();

program
  .name("cx-cli")
  .description("Modern CLI for scaffolding CxJS applications")
  .version(packageJson.version);

program
  .command("create")
  .description("Create a new CxJS project")
  .argument("[name]", "Project name")
  .option("-t, --template <template>", "Template to use")
  .option("--dry-run", "Show what would be created without creating files")
  .option("-i, --install", "Install dependencies after creation")
  .option("--no-install", "Skip installing dependencies")
  .action(create);

program.parse();
