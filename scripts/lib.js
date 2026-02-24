const fs = require("node:fs");

function splitCsvLine(line) {
  const cells = [];
  let cur = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        cur += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }
    if (ch === "," && !inQuotes) {
      cells.push(cur);
      cur = "";
      continue;
    }
    cur += ch;
  }

  cells.push(cur);
  return cells.map((v) => v.trim());
}

function parseCsv(raw) {
  const lines = raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length === 0) return [];
  const headers = splitCsvLine(lines[0]);

  return lines.slice(1).map((line) => {
    const vals = splitCsvLine(line);
    const row = {};
    headers.forEach((h, i) => {
      row[h] = vals[i] || "";
    });
    return row;
  });
}

function readCsv(filePath) {
  return parseCsv(fs.readFileSync(filePath, "utf8"));
}

function list(value) {
  if (!value || value === "-" || value === "none") return [];
  return value.split(/[;,]/).map((s) => s.trim()).filter(Boolean);
}

module.exports = {
  readCsv,
  list,
};
