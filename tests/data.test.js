const test = require("node:test");
const assert = require("node:assert/strict");
const { execFileSync } = require("node:child_process");

test("catalog data validates", () => {
  const out = execFileSync("node", ["scripts/validate-data.js"], { encoding: "utf8" });
  assert.match(out, /Data validation passed\./);
});

test("registry files generate", () => {
  const out = execFileSync("node", ["scripts/generate-registry.js"], { encoding: "utf8" });
  assert.match(out, /Generated 50 registry item files/);
});
