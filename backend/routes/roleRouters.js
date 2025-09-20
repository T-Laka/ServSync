const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/roleControllers");

// CRUD
router.get("/", ctrl.getAllRoles);
router.post("/", ctrl.addRole);
router.get("/:id", ctrl.getById);
router.put("/:id", ctrl.updateRole);
router.delete("/:id", ctrl.deleteRole);

// Staff Auth/Profile
router.post("/login", ctrl.staffLogin);
router.post("/logout", ctrl.staffLogout);
router.get("/me", ctrl.getMyRole);
router.put("/me", ctrl.updateMyRole);

module.exports = router;
