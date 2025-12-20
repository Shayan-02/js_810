const router = require("express").Router();
const asyncHandler = require("../utils/asyncHandler");
const c = require("../controllers/users.controller");

router.get("/", asyncHandler(c.list));
router.get("/:id", asyncHandler(c.get));
router.post("/", asyncHandler(c.create));
router.put("/:id", asyncHandler(c.update));
router.delete("/:id", asyncHandler(c.remove));

module.exports = router;
