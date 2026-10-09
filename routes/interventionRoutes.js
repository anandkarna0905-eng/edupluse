const express = require("express");
const controller = require("../controllers/interventionController");

const router = express.Router();

router.get("/", controller.getInterventions);
router.post("/", controller.createIntervention);
router.put("/:id", controller.updateIntervention);
router.delete("/:id", controller.deleteIntervention);

module.exports = router;