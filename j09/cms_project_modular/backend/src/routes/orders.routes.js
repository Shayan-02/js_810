const router = require("express").Router();
const asyncHandler = require("../utils/asyncHandler");
const c = require("../controllers/orders.controller");

router.get("/", asyncHandler(c.list));
router.delete("/:id", asyncHandler(c.remove));

module.exports = router;
