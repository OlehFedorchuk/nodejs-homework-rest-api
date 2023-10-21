import express  from "express";

import ctrl from "../../controllers/auth.js";

import { validateBody, authenticate } from "../../middlewars/index.js";

import { schemas } from "../../models/user.js";

 const router = express.Router();
 

router.post("/register", validateBody(schemas.registerSchema), ctrl.register);
router.post("/login", validateBody(schemas.loginSchema), ctrl.login);
router.get("/current", authenticate, ctrl.getCurrent);
router.post("/logout", authenticate, ctrl.logout);
router.patch("/", authenticate, validateBody(schemas.subscriptionSchema), ctrl.subscriptionUpdate);
 export default router;