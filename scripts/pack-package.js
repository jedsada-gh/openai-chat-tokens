const fs = require("fs");
const path = require("path");

const main = async () => {
  const content = fs.readFileSync(
    path.resolve(__dirname, "../package.json"),
    "utf8",
  );
  const packageJson = JSON.parse(content);

  delete packageJson.scripts;
  delete packageJson.dependencies;
  delete packageJson.devDependencies;
  delete packageJson.prettier;

  fs.writeFileSync(
    path.resolve(__dirname, "../package.json"),
    JSON.stringify(packageJson, null, 2),
  );
};

main()
  .then()
  .catch(console.error)
  .finally(() => process.exit(0));
