#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Function to ask a question and store the answer in the config object
function askQuestion(question, defaultAnswer) {
  return new Promise((resolve) =>
    rl.question(`${question} (${defaultAnswer}): `, resolve)
  ).then((a) => (a?.length ? a : defaultAnswer));
}

async function getShouldEnable(name, isEnabled) {
  if (isEnabled) {
    return false;
  }
  const shouldEnable = await askQuestion(`Enable "${name}"`, "yes");
  return shouldEnable === "yes";
}

/** @typedef {Object} Config
 *  @property {"commonjs" | "module"} type
 *  @property {?string} airentPackage
 *  @property {string} schemaPath
 *  @property {string} entityPath
 *  @property {?string[]} [augmentors]
 *  @property {?Template[]} [templates]
 *  @property {?string} airentApiServerPackage
 *  @property {string} requestContextImport
 */

const CONFIG_FILE_PATH = path.join(process.cwd(), "airent.config.json");

const AIRENT_API_SERVER_RESOURCES_PATH =
  "node_modules/airent-api-server/resources";

const API_AUGMENTOR_PATH = `${AIRENT_API_SERVER_RESOURCES_PATH}/augmentor.js`;
const API_SERVER_ACTION_TEMPLATE_PATH = `${AIRENT_API_SERVER_RESOURCES_PATH}/action-template.ts.ejs`;
const API_SERVER_SERVICE_TEMPLATE_PATH = `${AIRENT_API_SERVER_RESOURCES_PATH}/service-template.ts.ejs`;

async function loadConfig() {
  const configContent = await fs.promises.readFile(CONFIG_FILE_PATH, "utf8");
  const config = JSON.parse(configContent);
  const augmentors = config.augmentors ?? [];
  const templates = config.templates ?? [];
  return { ...config, augmentors, templates };
}

async function configure() {
  const config = await loadConfig();
  const { augmentors, templates } = config;

  const isApiServerEnabled = augmentors.includes(API_AUGMENTOR_PATH);
  const shouldEnableApiServer = await getShouldEnable(
    "Api Server",
    isApiServerEnabled
  );
  if (!shouldEnableApiServer) {
    return;
  }

  augmentors.push(API_AUGMENTOR_PATH);
  const isApiServerActionEnabled =
    templates.find((t) => t.name === API_SERVER_ACTION_TEMPLATE_PATH) !==
    undefined;
  if (!isApiServerActionEnabled) {
    templates.push({
      name: API_SERVER_ACTION_TEMPLATE_PATH,
      outputPath: "{entityPath}/generated/{kababEntityName}-action.ts",
      skippable: false,
    });
  }
  const isApiServerServiceEnabled =
    templates.find((t) => t.name === API_SERVER_SERVICE_TEMPLATE_PATH) !==
    undefined;
  if (!isApiServerServiceEnabled) {
    templates.push({
      name: API_SERVER_SERVICE_TEMPLATE_PATH,
      outputPath: "{entityPath}/generated/{kababEntityName}-service.ts",
      skippable: false,
    });
  }
  const isRequestContextImportEnabled =
    config.requestContextImport !== undefined;
  if (!isRequestContextImportEnabled) {
    const defaultRequestContextImport =
      "import { RequestContext } from '@/types/server';";
    config.requestContextImport = await askQuestion(
      'Statement to import "RequestContext"',
      config.requestContextImport ?? defaultRequestContextImport
    );
  }

  const content = JSON.stringify(config, null, 2) + "\n";
  await fs.promises.writeFile(CONFIG_FILE_PATH, content);
  console.log(`[AIRENT-API-SERVER/INFO] Package configured.`);
}

async function main() {
  try {
    if (!fs.existsSync(CONFIG_FILE_PATH)) {
      throw new Error(
        '[AIRENT-API-SERVER/ERROR] "airent.config.json" not found'
      );
    }
    await configure();
  } finally {
    rl.close();
  }
}

main().catch(console.error);
