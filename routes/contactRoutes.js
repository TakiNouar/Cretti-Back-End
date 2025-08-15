const { Router } = require("express");
const contact = require("../controller/contactController");
const router = Router();

router.post("/", contact);

module.exports = router;
