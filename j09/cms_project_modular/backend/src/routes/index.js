const router = require("express").Router();

router.use("/products", require("./products.routes"));
router.use("/users", require("./users.routes"));
router.use("/comments", require("./comments.routes"));
router.use("/orders", require("./orders.routes"));
router.use("/offs", require("./offs.routes"));

module.exports = router;
