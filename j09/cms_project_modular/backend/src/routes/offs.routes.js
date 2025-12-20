const router = require("express").Router();
const asyncHandler = require("../utils/asyncHandler");
const c = require("../controllers/offs.controller");

router.get("/", asyncHandler(c.list));
router.put("/:id/toggle", asyncHandler(c.toggle));
router.delete("/:id", asyncHandler(c.remove));

module.exports = router;
