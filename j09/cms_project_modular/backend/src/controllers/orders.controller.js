const { parsePageParams, buildPaginatedResponse } = require("../utils/pagination");
const orders = require("../services/orders.service");

async function list(req,res){
  const { page, limit, offset, q } = parsePageParams(req);
  const { rows, total } = await orders.list({ q, limit, offset });
  res.json(buildPaginatedResponse({ rows, total, page, limit }));
}

async function remove(req,res){
  const deleted = await orders.remove(req.params.id);
  res.json({ deleted });
}

module.exports = { list, remove };
