const express = require("express");
const router = express.Router();
const { chat } = require("../controller/assistantController");
const { optionalAuth } = require("../middleware/optionalAuth");

router.route("/assistant/chat").post(optionalAuth, chat);

module.exports = router;
