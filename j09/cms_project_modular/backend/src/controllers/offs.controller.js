const { parsePageParams, buildPaginatedResponse } = require("../utils/pagination");
const offs = require("../services/offs.service");

async function list(req,res){
  const { page, limit, offset, q } = parsePageParams(req);
  const { rows, total } = await offs.list({ q, limit, offset });
  res.json(buildPaginatedResponse({ rows, total, page, limit }));
}

async function toggle(req,res){
  const updated = await offs.toggle(req.params.id);
  res.json({ updated });
}

async function remove(req,res){
  const deleted = await offs.remove(req.params.id);
  res.json({ deleted });
}

module.exports = { list, toggle, remove };
