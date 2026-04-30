const express = require("express");
const { downloadVideo } = require("../controllers/downloadController");

const router = express.Router();

router.post("/", downloadVideo);

module.exports = router;