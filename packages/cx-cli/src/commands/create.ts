import * as p from "@clack/prompts";
import pc from "picocolors";
import path from "path";
import fs from "fs-extra";
import { execSync } from "child_process";
import os from "os";
import {
  loadTemplateConfig,
  downloadTemplate,
  extractZipTemplate,
  readPackageScripts,
} from "../utils/templates.js";

interface CreateOptions {
  template?: string;
  dryRun?: boolean;
  install?: boolean;
}

export async function create(name: string | undefined, options: CreateOptions) {
  console.log();
  p.intro(pc.bgCyan(pc.black(" cx-cli ")));

  // Load template configuration
  const manifest = await loadTemplateConfig();
  const templates = manifest.templates;

  const projectName =
    name ??
    ((await p.text({
      message: "Project name:",
      placeholder: "my-cx-app",
      validate: (value) => {
        if (!value) return "Project name is required";
        if (!/^[a-z0-9-]+$/.test(value))
          return "Project name can only contain lowercase letters, numbers, and hyphens";
      },
    })) as string);

  if (p.isCancel(projectName)) {
    p.cancel("Operation cancelled.");
    process.exit(0);
  }

  const template =
    options.template ??
    ((await p.select({
      message: "Select a template:",
      options: templates.map((t) => ({
        value: t.id,
        label: t.name,
      })),
    })) as string);

  if (p.isCancel(template)) {
    p.cancel("Operation cancelled.");
    process.exit(0);
  }

  let installDeps = options.install;
  if (installDeps === undefined) {
    const answer = await p.confirm({
      message: "Install dependencies?",
      initialValue: true,
    });

    if (p.isCancel(answer)) {
      p.cancel("Operation cancelled.");
      process.exit(0);
    }
    installDeps = answer;
  }

  const targetDir = path.resolve(process.cwd(), projectName);

  // Check if directory exists
  if (fs.existsSync(targetDir)) {
    const overwrite = await p.confirm({
      message: `Directory ${pc.cyan(projectName)} already exists. Overwrite?`,
      initialValue: false,
    });

    if (p.isCancel(overwrite) || !overwrite) {
      p.cancel("Operation cancelled.");
      process.exit(0);
    }

    if (!options.dryRun) {
      fs.removeSync(targetDir);
    }
  }

  if (options.dryRun) {
    p.log.info(`Would create project at ${pc.cyan(targetDir)}`);
    p.log.info(`Template: ${pc.cyan(template)}`);
    p.outro("Dry run complete!");
    return;
  }

  const selectedTemplate = templates.find((t) => t.id === template);
  if (!selectedTemplate) {
    p.log.error(`Template "${template}" not found`);
    process.exit(1);
  }

  const spinner = p.spinner();
  spinner.start("Downloading template...");

  try {
    const tempZip = path.join(os.tmpdir(), `cx-template-${Date.now()}.zip`);

    await downloadTemplate(selectedTemplate.url, tempZip);
    spinner.message("Extracting template...");
    await extractZipTemplate(
      tempZip,
      targetDir,
      selectedTemplate.srcFolder,
      projectName
    );
    spinner.stop("Template downloaded!");

    // Update package.json with project name
    const pkgPath = path.join(targetDir, "package.json");
    if (fs.existsSync(pkgPath)) {
      const pkg = fs.readJsonSync(pkgPath);
      pkg.name = projectName;
      fs.writeJsonSync(pkgPath, pkg, { spaces: 2 });
    }

    p.log.success(`Created ${pc.cyan(projectName)} with ${pc.cyan(template)} template`);

    if (installDeps) {
      const installSpinner = p.spinner();
      installSpinner.start("Installing dependencies...");
      try {
        execSync("npm install", { cwd: targetDir, stdio: "ignore" });
        installSpinner.stop("Dependencies installed!");
      } catch {
        installSpinner.stop("Failed to install dependencies");
        p.log.warn("You can install them manually with: npm install");
      }
    }

    // Display available scripts
    const scripts = await readPackageScripts(targetDir);
    if (scripts && Object.keys(scripts).length > 0) {
      const scriptsList = Object.entries(scripts)
        .map(
          ([name, cmd]) => `${pc.cyan(`npm run ${name}`)}\n    ${pc.dim(cmd)}`
        )
        .join("\n\n");

      p.note(scriptsList, "Available scripts");
    }

    const nextSteps = installDeps
      ? `cd ${projectName}\nnpm run dev`
      : `cd ${projectName}\nnpm install\nnpm run dev`;

    p.note(nextSteps, "Next steps");

    p.outro("Happy coding!");
  } catch (error) {
    spinner.stop("Failed to create project");

    const errorMessage = error instanceof Error ? error.message : String(error);

    if (errorMessage.includes("fetch") || errorMessage.includes("download")) {
      p.log.error("Failed to download template. Please check your internet connection.");
    } else if (errorMessage.includes("not found")) {
      p.log.error("Template structure is invalid. Please report this issue.");
    } else {
      p.log.error(`Failed to create project: ${errorMessage}`);
    }

    process.exit(1);
  }
}
