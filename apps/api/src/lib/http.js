export function sendJson(res, statusCode, payload) {
  const body = JSON.stringify(payload, null, 2);
  res.writeHead(statusCode, {
    "content-type": "application/json; charset=utf-8",
    "content-length": Buffer.byteLength(body),
  });
  res.end(body);
}

export async function readRawBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  if (chunks.length === 0) return "";
  return Buffer.concat(chunks).toString("utf8");
}

export async function readJsonBody(req) {
  const raw = await readRawBody(req);
  if (!raw) return {};

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function parseQuery(urlObj) {
  return Object.fromEntries(urlObj.searchParams.entries());
}
