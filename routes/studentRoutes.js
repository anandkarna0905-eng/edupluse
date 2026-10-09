const express = require("express");
const controller = require("../controllers/studentController");

const router = express.Router();

router.get("/", controller.getStudents);
router.post("/", controller.createStudent);
router.get("/:id", controller.getStudent);
router.put("/:id", controller.updateStudent);
router.delete("/:id", controller.deleteStudent);

module.exports = router;