import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const repoRoot = path.resolve(__dirname, "../../../../");
export const dataDir = path.join(repoRoot, "data");
export const registryDir = path.join(repoRoot, "spec", "registry");
