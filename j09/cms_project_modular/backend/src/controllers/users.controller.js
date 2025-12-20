const { parsePageParams, buildPaginatedResponse } = require("../utils/pagination");
const users = require("../services/users.service");

async function list(req, res){
  const { page, limit, offset, q } = parsePageParams(req);
  const { rows, total } = await users.list({ q, limit, offset });
  res.json(buildPaginatedResponse({ rows, total, page, limit }));
}

async function get(req, res){
  const item = await users.getById(req.params.id);
  if(!item) return res.status(404).send("Not found");
  res.json(item);
}

async function create(req, res){
  const { firstname, lastname, username, password } = req.body;
  if(!firstname || !lastname || !username || !password){
    return res.status(400).send("firstname/lastname/username/password required");
  }
  const id = await users.create(req.body);
  res.status(201).json({ id });
}

async function update(req, res){
  const { firstname, lastname, username, password } = req.body;
  if(!firstname || !lastname || !username || !password){
    return res.status(400).send("firstname/lastname/username/password required");
  }
  const updated = await users.update(req.params.id, req.body);
  res.json({ updated });
}

async function remove(req, res){
  const deleted = await users.remove(req.params.id);
  res.json({ deleted });
}

module.exports = { list, get, create, update, remove };
