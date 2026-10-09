const express = require("express");
const controller = require("../controllers/authController");
const router = express.Router();
router.post("/student", controller.studentLogin);
router.post("/faculty", controller.facultyLogin);
module.exports = router;
