import express from "express";

import { createUser, login } from "../controllers/users.js";

const router = express.Router();

router.post("/v1/createUser", createUser);
router.post("/v1/login", login);

export default router;
