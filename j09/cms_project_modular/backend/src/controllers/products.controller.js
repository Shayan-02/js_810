const { parsePageParams, buildPaginatedResponse } = require("../utils/pagination");
const products = require("../services/products.service");

async function list(req, res){
  const { page, limit, offset, q } = parsePageParams(req);
  const { rows, total } = await products.list({ q, limit, offset });
  res.json(buildPaginatedResponse({ rows, total, page, limit }));
}

async function get(req, res){
  const item = await products.getById(req.params.id);
  if(!item) return res.status(404).send("Not found");
  res.json(item);
}

async function create(req, res){
  const { title } = req.body;
  if(!title) return res.status(400).send("title is required");
  const id = await products.create(req.body);
  res.status(201).json({ id });
}

async function update(req, res){
  const { title } = req.body;
  if(!title) return res.status(400).send("title is required");
  const updated = await products.update(req.params.id, req.body);
  res.json({ updated });
}

async function remove(req, res){
  const deleted = await products.remove(req.params.id);
  res.json({ deleted });
}

module.exports = { list, get, create, update, remove };
