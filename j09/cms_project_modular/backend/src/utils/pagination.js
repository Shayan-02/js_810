function parsePageParams(req) {
  const page = Math.max(parseInt(req.query.page || "1", 10), 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit || "10", 10), 1), 100);
  const offset = (page - 1) * limit;
  const q = String(req.query.q || "").trim();
  return { page, limit, offset, q };
}

function buildPaginatedResponse({ rows, total, page, limit }) {
  const totalPages = Math.max(Math.ceil(total / limit), 1);
  return { data: rows, page, limit, total, totalPages };
}

module.exports = { parsePageParams, buildPaginatedResponse };
