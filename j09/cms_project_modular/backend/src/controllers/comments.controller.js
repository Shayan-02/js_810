const { parsePageParams, buildPaginatedResponse } = require("../utils/pagination");
const comments = require("../services/comments.service");

async function list(req,res){
  const { page, limit, offset, q } = parsePageParams(req);
  const { rows, total } = await comments.list({ q, limit, offset });
  res.json(buildPaginatedResponse({ rows, total, page, limit }));
}

async function remove(req,res){
  const deleted = await comments.remove(req.params.id);
  res.json({ deleted });
}

module.exports = { list, remove };
