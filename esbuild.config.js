const path = require("path");
const fs = require("fs");
const { execSync } = require("child_process");
const esbuild = require("esbuild");
const chalk = require("chalk");
const gzipSize = require("gzip-size");

const replaceVariablePlugin = (variableName, replacement) => ({
  name: "replace-variable-plugin",
  setup(build) {
    build.onEnd((result) => {
      const outputFiles = result.outputFiles || [];
      outputFiles.forEach((file) => {
        let content = new TextDecoder("utf-8").decode(file.contents);
        const regex = new RegExp(
          `var\\s+${variableName}\\s*=\\s*\\{[^;]*\\};`,
          "g",
        );
        content = content.replace(
          regex,
          `var ${variableName} = ${replacement};`,
        );
        file.contents = new TextEncoder().encode(content);
      });
    });
  },
});

esbuild
  .build({
    entryPoints: ["src/index.ts"],
    outdir: "dist",
    format: "esm",
    bundle: true,
    minify: false,
    sourcemap: true,
    write: false,
    metafile: true,
    plugins: [
      replaceVariablePlugin("gpt2_default", "{}"),
      replaceVariablePlugin("r50k_base_default", "{}"),
      replaceVariablePlugin("p50k_base_default", "{}"),
      replaceVariablePlugin("p50k_edit_default", "{}"),
      replaceVariablePlugin("o200k_base_default", "{}"),
    ],
  })
  .then((result) => {
    if (!fs.existsSync("dist")) {
      fs.mkdirSync("dist");
    }
    const outputFiles = result.outputFiles || [];
    outputFiles.forEach((file) => {
      fs.writeFileSync(file.path, file.contents);
    });
    execSync("npx tsc --declaration --emitDeclarationOnly -p tsconfig.json");

    const outputIndexPath = "dist/index.js";
    const separatorIndex = outputIndexPath.lastIndexOf("/");
    const dirname = outputIndexPath.substring(0, separatorIndex + 1);
    const filename = outputIndexPath.substring(separatorIndex + 1);
    const gzipFile = gzipSize.fileSync(
      path.resolve(__dirname, outputIndexPath),
    );
    const fileStat = fs.statSync(outputIndexPath, "utf-8");
    const bundleSize = Number((fileStat.size / 1024).toFixed(2));
    const bundleGzipSize = Number((gzipFile / 1024).toFixed(2));

    console.log(
      chalk.gray(
        `${dirname}${chalk.cyan(filename)} ${chalk.yellowBright.bold(
          `${bundleSize.toLocaleString("en-US")} kB ${chalk.reset.gray(
            `| gzip: ${bundleGzipSize.toLocaleString("en-US")} kB`,
          )}`,
        )}`,
      ),
    );

    console.log(chalk.green("✓ esbuild done"));
  });
